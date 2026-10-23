import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { userAPI } from '../api/authapi/authAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const SetNewPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [email, setEmail] = useState('');
    const [tokenError, setTokenError] = useState('');
    const [apiMessage, setApiMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    

    useEffect(() => {
        if (!token) {
            setTokenError('Token missing from URL.');
            return;
        }
        const decoded = jwtDecode(token);
        setEmail(decoded?.sub?.email)
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
        try {
            const res = await userAPI.setNewPassword({ token, password: formValues.password }); // create this method too
            if (res.status) {
                setIsSuccess(true);
                setApiMessage('Password set successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setApiMessage(res.message || 'Failed to set new password.');
            }
        } catch (error) {
            setApiMessage(error?.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5ECE4] p-4 font-sans text-[#2E2E2E] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-[#734425]/15 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#C26819]/15 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <Card className="border border-[#E1D4C7] shadow-2xl bg-[#FAF6F2]/95 backdrop-blur-md rounded-3xl overflow-hidden p-2">
                    <CardHeader className="space-y-1.5 pb-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#734425] text-white flex items-center justify-center shadow-md mb-2">
                            <Lock className="h-6 w-6 text-[#F5ECE4]" />
                        </div>
                        <CardTitle className="text-2xl font-heading font-extrabold uppercase tracking-tight text-[#2E2E2E]">Set New Password</CardTitle>
                        <CardDescription className="text-sm text-[#2E2E2E]/70 font-medium">
                            Enter a strong password below to secure your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {tokenError ? (
                            <Alert className="border-rose-200 bg-rose-50 mb-4 rounded-xl">
                                <AlertDescription className="text-rose-800 font-medium">
                                    {tokenError}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-wider text-[#2E2E2E]">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#2E2E2E]/40" />
                                        <Input
                                            value={email}
                                            disabled
                                            className="pl-10 h-12 bg-white/70 border-[#E1D4C7] text-[#2E2E2E]/70 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="font-bold text-xs uppercase tracking-wider text-[#2E2E2E]">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#2E2E2E]/40" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="pl-10 h-12 bg-white border-[#E1D4C7] focus-visible:ring-2 focus-visible:ring-[#C26819] text-[#2E2E2E] rounded-xl"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    {errors.password && <p className="text-rose-600 text-xs font-bold mt-1">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="font-bold text-xs uppercase tracking-wider text-[#2E2E2E]">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="h-12 bg-white border-[#E1D4C7] focus-visible:ring-2 focus-visible:ring-[#C26819] text-[#2E2E2E] rounded-xl"
                                        placeholder="Confirm password"
                                    />
                                    {errors.confirmPassword && <p className="text-rose-600 text-xs font-bold mt-1">{errors.confirmPassword}</p>}
                                </div>

                                {apiMessage && (
                                    <Alert className={isSuccess ? 'border-emerald-200 bg-emerald-50 rounded-xl' : 'border-rose-200 bg-rose-50 rounded-xl'}>
                                        <AlertDescription className={isSuccess ? 'text-emerald-800 font-medium' : 'text-rose-800 font-medium'}>
                                            {apiMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-[#734425] hover:bg-[#5D361D] text-white font-heading font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#734425]/20 transition-all active:scale-[0.98]"
                                    disabled={isSubmitting || !email}
                                >
                                    {isSubmitting ? 'Saving...' : 'Set New Password'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SetNewPassword;