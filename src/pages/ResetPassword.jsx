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
    <div className="min-h-screen bg-[#F5ECE4] relative overflow-hidden font-sans text-[#2E2E2E]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-[#734425]/15 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#C26819]/15 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-5xl border-[#E1D4C7] shadow-2xl bg-white/95 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid gap-0 lg:grid-cols-5">
              <div className="relative overflow-hidden lg:col-span-2 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none bg-gradient-to-br from-[#24130A] via-[#734425] to-[#5D361D] text-white p-8 lg:p-10">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff,transparent_35%),radial-gradient(circle_at_80%_0%,#C26819,transparent_30%)]" />
                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-heading font-bold tracking-wider uppercase ring-1 ring-white/20">
                    <span className="h-2 w-2 rounded-full bg-[#C26819]" />
                    Secure reset
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#F5ECE4]/70">Password Recovery</p>
                    <h1 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight">Regain access with a fresh, strong password.</h1>
                    <p className="text-sm text-[#F5ECE4]/80 max-w-sm">Finish this quick step to keep your employee account protected and continue where you left off.</p>
                  </div>
                  <div className="space-y-4 text-sm text-[#F5ECE4]/90 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur border border-white/10 text-[#C26819]">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-white">Enterprise-grade security</p>
                        <p className="text-xs text-[#F5ECE4]/75">Passwords are encrypted in transit and at rest.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur border border-white/10 text-[#C26819]">
                        <span className="text-xs font-heading font-black">1m</span>
                      </div>
                      <div>
                        <p className="font-heading font-bold text-white">Takes ~1 minute</p>
                        <p className="text-xs text-[#F5ECE4]/75">Update your credentials and get back to work seamlessly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-8 lg:p-10 space-y-6 bg-[#FAF6F2] rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#C26819]">Step 2 of 3</p>
                    <div>
                      <h2 className="text-2xl font-heading font-extrabold text-[#2E2E2E] uppercase tracking-tight">Set a new password</h2>
                      <p className="text-sm text-[#2E2E2E]/70 font-medium">Choose a unique passphrase to secure your employee account.</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-[#2E2E2E]/60">
                    <div className="h-10 w-10 rounded-full bg-[#E1D4C7]/60 flex items-center justify-center font-heading font-bold text-[#734425]">02</div>
                    <div>
                      <p className="text-[#2E2E2E] font-bold">Reset & verify</p>
                      <p className="text-xs">Next: login</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-1.5 w-full rounded-full bg-[#E1D4C7]/50 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-[#734425] via-[#C26819] to-[#734425]" />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-[#2E2E2E]/60">
                    <span>Request</span>
                    <span className="font-bold text-[#734425]">Reset</span>
                    <span>Login</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Label htmlFor="password" className="font-bold text-[#2E2E2E]">New Password</Label>
                      <span className="text-xs text-[#2E2E2E]/60">Minimum 6 characters</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#2E2E2E]/40" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-12 pl-10 bg-white border-[#E1D4C7] focus-visible:ring-2 focus-visible:ring-[#C26819] text-[#2E2E2E] rounded-xl"
                        placeholder="Enter a new password"
                      />
                    </div>
                    {errors.password && <p className="text-xs font-bold text-rose-600">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Label htmlFor="confirmPassword" className="font-bold text-[#2E2E2E]">Confirm Password</Label>
                      <span className="text-xs text-[#2E2E2E]/60">Must match exactly</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#2E2E2E]/40" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-12 pl-10 bg-white border-[#E1D4C7] focus-visible:ring-2 focus-visible:ring-[#C26819] text-[#2E2E2E] rounded-xl"
                        placeholder="Re-enter password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-xs font-bold text-rose-600">{errors.confirmPassword}</p>}
                  </div>

                  {apiMessage && (
                    <Alert className={isSuccess ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}>
                      <AlertDescription className={isSuccess ? 'text-emerald-800 font-medium' : 'text-rose-800 font-medium'}>
                        {apiMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#734425] hover:bg-[#5D361D] hover:shadow-lg hover:shadow-[#734425]/20 text-white font-heading font-bold uppercase tracking-wider rounded-xl transition duration-200"
                      disabled={isSubmitting || !token}
                    >
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                    <p className="text-xs text-[#2E2E2E]/50 text-center">By continuing you confirm this device is trusted.</p>
                  </div>
                </form>

                <div className="mt-4 rounded-xl border border-[#E1D4C7] bg-white p-4">
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Password tips</p>
                  <ul className="mt-2 space-y-1 text-xs text-[#2E2E2E]/70 list-disc list-inside">
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
