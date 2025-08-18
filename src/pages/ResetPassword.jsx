import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { authAPI, userAPI } from '../api/authapi/authAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [apiMessage, setApiMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setApiMessage('Invalid or missing token.');
    }
  }, [token]);

  const validationSchema = {
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minLength', value: 6, message: 'Password must be at least 6 characters.' },
    ],
    confirmPassword: [
      { type: 'required', message: 'Please confirm your password.' },
      { type: 'match', field: 'password', message: 'Passwords do not match.' },
    ]
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(
    { password: '', confirmPassword: '' },
    validationSchema
  );

  const onSubmit = async (formValues) => {
    setApiMessage('');
    setIsSuccess(false);

    if (!token) return;

    try {
      const res = await authAPI.resetPassword({ token, password: formValues.password });
      if (res.status) {
        setIsSuccess(true);
        setApiMessage('Password has been reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setApiMessage(res.message || 'Failed to reset password.');
      }
    } catch (error) {
      setApiMessage(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="pl-10 h-12"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="pl-10 h-12"
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {apiMessage && (
                <Alert className={isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <AlertDescription className={isSuccess ? 'text-green-700' : 'text-red-700'}>
                    {apiMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                disabled={isSubmitting || !token}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;