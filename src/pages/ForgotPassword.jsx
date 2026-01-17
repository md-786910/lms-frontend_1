import { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authapi/authAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import MotionWrapper from '../components/MotionWrapper';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [apiMessage, setApiMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const validationSchema = {
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Enter a valid email address.' },
        ],
    };

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useFormValidation(
        { email: '' },
        validationSchema
    );

    const onSubmit = async (formValues) => {
        setApiMessage('');
        setIsSuccess(false);
        try {
            const res = await authAPI.forgotPassword(formValues);
            if (res.status) {
                setIsSuccess(true);
                setApiMessage(res.message || 'Verification link dispatched to your inbox.');
            } else {
                setApiMessage(res.message || 'Authentication lookup failed.');
            }
        } catch (error) {
            console.log({error})
            setApiMessage(error?.response?.data?.message || 'Network protocol error. Retry requested.');
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
                            <KeyRound className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        Account <span className="text-blue-500">Recovery</span>
                    </h1>
                    <p className="text-slate-400 mt-3 font-medium tracking-tight">Identity Verification Terminal</p>
                </div>

                <Card className="border border-slate-800 shadow-2xl bg-[#0f172a]/80 backdrop-blur-2xl">
                    <CardHeader className="space-y-1 pb-8 border-b border-slate-800/50">
                        <CardTitle className="text-xl font-bold text-center text-white tracking-tight">Reset Password</CardTitle>
                        <CardDescription className="text-center text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                            Enter credentials for reset link
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
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Link Dispatched</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">We've sent a secure authentication link to your email address.</p>
                                </div>
                                <Button 
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-xs h-11"
                                >
                                    Return to Terminal
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registered Email</Label>
                                    <div className="relative group focus-ring rounded-lg">
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="pl-10 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white transition-all rounded-lg"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors.email}</p>}
                                </div>

                                {apiMessage && (
                                    <Alert className="py-2 bg-red-500/10 border-red-500/20 rounded-lg">
                                        <AlertDescription className="text-[11px] font-bold text-red-400 uppercase text-center">
                                            {apiMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-xs font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 rounded-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Send Recovery Link'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </MotionWrapper>
        </div>
    );
};

export default ForgotPassword;