import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { authAPI, userAPI } from '../api/authapi/authAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-5xl border-slate-200 shadow-2xl bg-white/90 backdrop-blur">
          <CardContent className="p-0">
            <div className="grid gap-0 lg:grid-cols-5">
              <div className="relative overflow-hidden lg:col-span-2 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white p-8">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff,transparent_35%),radial-gradient(circle_at_80%_0%,#a5b4fc,transparent_30%)]" />
                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide capitalize ring-1 ring-white/25">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Secure reset
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-indigo-100">Password Recovery</p>
                    <h1 className="text-3xl font-semibold leading-tight">Regain access with a fresh, strong password.</h1>
                    <p className="text-sm text-indigo-100/80 max-w-sm">Finish this quick step to keep your employee account protected and continue where you left off.</p>
                  </div>
                  <div className="space-y-3 text-sm text-indigo-50/90">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Enterprise-grade security</p>
                        <p className="text-indigo-100/80">Passwords are encrypted in transit and at rest.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                        <span className="text-sm font-semibold">1m</span>
                      </div>
                      <div>
                        <p className="font-semibold">Takes ~1 minute</p>
                        <p className="text-indigo-100/80">Update your credentials and get back to work seamlessly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-8 lg:p-10 space-y-6 bg-white rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold capitalize tracking-[0.08em] text-indigo-600">Step 2 of 3</p>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">Set a new password</h2>
                      <p className="text-sm text-slate-500">Choose a unique passphrase to secure your employee account.</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-indigo-600">02</div>
                    <div>
                      <p className="text-slate-700 font-semibold">Reset & verify</p>
                      <p>Next: login</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Request</span>
                    <span className="font-semibold text-slate-700">Reset</span>
                    <span>Login</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Label htmlFor="password" className="font-medium text-slate-800">New Password</Label>
                      <span className="text-slate-500">Minimum 6 characters</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-12 pl-10 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        placeholder="Enter a new password"
                      />
                    </div>
                    {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Label htmlFor="confirmPassword" className="font-medium text-slate-800">Confirm Password</Label>
                      <span className="text-slate-500">Must match exactly</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-12 pl-10 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        placeholder="Re-enter password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-rose-600">{errors.confirmPassword}</p>}
                  </div>

                  {apiMessage && (
                    <Alert className={isSuccess ? 'border-green-200 bg-emerald-50' : 'border-red-200 bg-rose-50'}>
                      <AlertDescription className={isSuccess ? 'text-emerald-700' : 'text-rose-700'}>
                        {apiMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:shadow-lg hover:shadow-indigo-200 text-white font-semibold transition duration-200"
                      disabled={isSubmitting || !token}
                    >
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                    <p className="text-xs text-slate-500 text-center">By continuing you confirm this device is trusted.</p>
                  </div>
                </form>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">Password tips</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc list-inside">
                    <li>Use a phrase with letters, numbers, and symbols.</li>
                    <li>Avoid reusing work or personal passwords.</li>
                    <li>Consider a password manager for secure storage.</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
