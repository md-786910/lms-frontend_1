import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { authAPI } from '../api/authapi/authAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import MotionWrapper from '../components/MotionWrapper';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [apiMessage, setApiMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setApiMessage('Access token invalid or expired.');
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
        setApiMessage('Credentials updated. Redirecting to terminal...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setApiMessage(res.message || 'Update request denied.');
      }
    } catch (error) {
      setApiMessage(error?.response?.data?.message || 'Security protocol error. Retry required.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <Button 
            variant="ghost" 
            className="absolute top-8 left-8 text-slate-400 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300 rounded-full px-4"
            onClick={() => navigate('/login')}
        >
            <ArrowLeft className="h-4 w-4" /> <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </Button>

        <MotionWrapper className="w-full max-w-md p-4 relative z-10">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                    Security <span className="text-blue-500">Update</span>
                </h1>
                <p className="text-slate-400 mt-3 font-medium tracking-tight">Credential Modification Terminal</p>
            </div>

            <Card className="border border-slate-800 shadow-2xl bg-[#0f172a]/80 backdrop-blur-2xl">
                <CardHeader className="space-y-1 pb-8 border-b border-slate-800/50">
                    <CardTitle className="text-xl font-bold text-center text-white tracking-tight">New Password</CardTitle>
                    <CardDescription className="text-center text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                        Define secure access tokens
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-8 px-8">
                    {isSuccess ? (
                        <div className="space-y-6 py-4 text-center animate-enter">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Access Restored</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Your security credentials have been successfully updated.</p>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 animate-progress"></div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password" class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Security Token</Label>
                            <div className="relative group focus-ring rounded-lg">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="pl-10 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white transition-all rounded-lg"
                                placeholder="••••••••"
                            />
                            </div>
                            {errors.password && <p className="text-red-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Token</Label>
                            <div className="relative group focus-ring rounded-lg">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="pl-10 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white transition-all rounded-lg"
                                placeholder="••••••••"
                            />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors.confirmPassword}</p>}
                        </div>

                        {apiMessage && (
                            <Alert className={`py-2 border-l-4 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-destructive/10 border-destructive text-destructive'}`}>
                            <AlertDescription className="text-[11px] font-bold text-center uppercase">
                                {apiMessage}
                            </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-xs font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 rounded-lg"
                            disabled={isSubmitting || !token}
                        >
                            {isSubmitting ? 'Verifying...' : 'Update Terminal Access'}
                        </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </MotionWrapper>
    </div>
  );
};

export default ResetPassword;