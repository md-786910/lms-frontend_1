import { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authapi/authAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail } from 'lucide-react';

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
                setApiMessage(res.message || 'Reset link sent. Please check your email.');
            } else {
                setApiMessage(res.message || 'Failed to send reset link.');
            }
        } catch (error) {
            console.log({error})
            setApiMessage(error?.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Forgot Password
                    </h1>
                    <p className="text-slate-600 mt-2">Enter your email to receive reset instructions</p>
                </div>

                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center">Reset your password</CardTitle>
                        <CardDescription className="text-center">
                            We’ll send a reset link to your email
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="pl-10 h-12"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center mt-4">
                                <Button variant="link" onClick={() => navigate('/login')}>
                                    Back to Login
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;