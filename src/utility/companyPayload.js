export const companyPayload = (values) => {
  return {
    company_obj: {
      company_name: values.companyName,
      company_size: parseInt(values.companySize),
      logo: "https://example.com/logo.png",
      industry_id: parseInt(values.industry),
      company_website: values.website,
      country_id: 103,
      subscribe_newsletter: values.subscribeNewsletter,
      terms_accepted: values.agreeToTerms
    },
    user: {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone_number: parseInt(values.phone),
      phone_country_code: "+91",
      job_title: values.jobTitle,
      password: values.password,
      confirmPassword: values.confirmPassword
    }
  };
};
