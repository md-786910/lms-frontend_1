import { useState, useCallback, useEffect } from "react";

// Validation rules
const validationRules = {
  required: (value) => {
    if (value === null || value === undefined) return false;
    return value.toString().trim() !== "";
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  minLength: (min) => (value) => {
    return value && value.length >= min;
  },

  maxLength: (max) => (value) => {
    return !value || value.length <= max;
  },

  pattern: (regex) => (value) => {
    return !value || regex.test(value);
  },

  number: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  phone: (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ""));
  },

  match: (fieldName) => (value, allValues) => {
    return value === allValues[fieldName];
  },

  min: (minValue) => (value) => {
    return !value || parseFloat(value) >= minValue;
  },

  max: (maxValue) => (value) => {
    return !value || parseFloat(value) <= maxValue;
  },
};
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a),
    bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
};
// Main hook
export const useFormValidation = (
  initialValues = {},
  validationSchema = {},
  options = {}
) => {
  const [values, setValues] = useState({ ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    validateOnChange = true,
    validateOnBlur = true,
    enableReinitialize = false,
  } = options;

  // Reinitialize when initialValues change (async load, language switch, etc.)
  useEffect(() => {
    if (!enableReinitialize) return;
    if (!shallowEqual(values, initialValues)) {
      setValues({ ...initialValues });
      setErrors({});
      setTouched({});
    }
  }, [enableReinitialize, initialValues]);

  const setFieldValue = useCallback((fieldName, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  }, []);

  const validateField = useCallback(
    (fieldName, value, allValues = values) => {
      const fieldRules = validationSchema[fieldName];
      if (!fieldRules) return "";

      for (const rule of fieldRules) {
        const { type, message, value: ruleValue } = rule;

        if (type === "required" && !validationRules.required(value)) {
          return message || `${fieldName} is required`;
        }

        if (!value && type !== "required") continue;

        let validator;
        if (ruleValue !== undefined) {
          validator = validationRules[type](ruleValue);
        } else {
          validator = validationRules[type];
        }

        if (type === "match") {
          if (!validator(value, allValues)) {
            return message || `${fieldName} does not match`;
          }
        } else if (validator && !validator(value)) {
          return message || `${fieldName} is invalid`;
        }
      }

      return "";
    },
    [validationSchema, values]
  );

  const validateForm = useCallback(
    (fields) => {
      const newErrors = {};
      let isValid = true;
      const fieldsToValidate = fields || Object.keys(validationSchema);

      fieldsToValidate.forEach((fieldName) => {
        const error = validateField(fieldName, values[fieldName], values);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });
      console.log("VALIDATE FORM -> Errors:", newErrors);
      setErrors(newErrors);
      return isValid;
    },
    [values, validationSchema, validateField]
  );

  const formValidation = useCallback(
    (fields, formValues = values) => {
      const newErrors = {};
      let isValid = true;
      const fieldsToValidate = fields || Object.keys(validationSchema);

      fieldsToValidate.forEach((fieldName) => {
        const error = validateField(
          fieldName,
          formValues[fieldName],
          formValues
        );
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      console.log("VALIDATE FORM -> Errors:", newErrors);
      setErrors(newErrors);
      return isValid;
    },
    [validationSchema, validateField]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({ ...prev, [name]: fieldValue }));

      if (validateOnChange) {
        const error = validateField(name, fieldValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnBlur, validateField, values]
  );

  const resetForm = useCallback(
    (nextInitialValues) => {
      const base = nextInitialValues ?? initialValues ?? {};
      setValues(base);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  const handleSubmit = useCallback(
    (onSubmit) => {
      return async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        const isFormValid = validateForm();
        const isValidForm = formValidation(undefined, values);
        if (isFormValid || isValidForm) {
          try {
            await onSubmit(values);
          } catch (error) {
            console.error("Form submission error:", error);
          }
        }

        setIsSubmitting(false);
      };
    },
    [values, validationSchema, validateForm, formValidation]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    formValidation,
    resetForm,
    setFieldValue,
  };
};
