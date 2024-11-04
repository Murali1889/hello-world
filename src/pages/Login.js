import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Snackbar, Alert } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useFirebase } from '../context/FirebaseContext';
import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signOut
} from 'firebase/auth';

const ALLOWED_DOMAIN = 'hyperverge.co';

export default function LoginPage() {
  const { auth } = useFirebase();
    const { user } = useAuth();
    const { showSuccess, showError, showActionMessage, showWarning } = useMessage();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [unverifiedUser, setUnverifiedUser] = useState(null);

    useEffect(() => {
      // Only redirect if user exists and is verified
      if (user && user.emailVerified) {
          navigate('/');
      }
  }, [user, navigate]);

    const validateDomain = (email) => {
        const domain = email.split('@')[1];
        return domain === ALLOWED_DOMAIN;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return false;
        }
        if (!validateDomain(email)) {
            showError(`Access restricted to @${ALLOWED_DOMAIN} email addresses only`);
            return false;
        }
        return true;
    };

    const handleResendVerification = async (user) => {
        try {
            await sendEmailVerification(user);
            showSuccess('Verification email sent successfully! Please check your inbox');
        } catch (error) {
            showError('Failed to send verification email. Please try again later');
        }
    };

    const handleAuthSuccess = async (userCredential) => {
        if (!validateDomain(userCredential.user.email)) {
            await signOut(auth);
            showError('Access denied. This application is restricted to Hyperverge employees only');
            return false;
        }

        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            setUnverifiedUser(userCredential.user);
            showActionMessage(
                'Please verify your email address to continue',
                'warning',
                'Resend Verification',
                () => handleResendVerification(userCredential.user)
            );
            return false;
        }

        showSuccess('Welcome back! You have successfully logged in');
        navigate('/');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) return;

        if (!isLogin && password !== confirmPassword) {
            showError('Passwords do not match. Please try again');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await handleAuthSuccess(userCredential);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setUnverifiedUser(userCredential.user);
                showActionMessage(
                    'Account created successfully! Please check your email for verification',
                    'success',
                    'Resend Email',
                    () => handleResendVerification(userCredential.user)
                );
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsLogin(true);
            }
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password";
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = "An account with this email already exists";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address";
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = "Email/password sign-in is not enabled";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Please choose a stronger password";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled. Please contact support";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password";
                    break;
                default:
                    errorMessage = "An unexpected error occurred. Please try again";
            }
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                hd: ALLOWED_DOMAIN
            });
            const result = await signInWithPopup(auth, provider);

            if (!validateDomain(result.user.email)) {
                await signOut(auth);
                showError('Access denied. This application is restricted to Hyperverge employees only');
                return;
            }

            await handleAuthSuccess(result);
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
              showWarning('Google sign-in was cancelled');
            } else {
                showError('Failed to sign in with Google. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
    };

  // The rest of your JSX code remains exactly the same...
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"

      >
        <Card className="overflow-hidden shadow-2xl bg-white">
          <div className="p-8">
            <motion.h1
              className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {isLogin ? "Welcome Back!" : "Join Us Today"}
            </motion.h1>
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "signup"}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email <span className="ml-2 text-xs text-purple-600 font-normal">
                    (@hyperverge.co only)
                  </span></Label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={isLogin ? "Enter your password" : "Create a password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="h-5 w-5 rounded-full border-t-2 border-r-2 border-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    isLogin ? "Log In" : "Sign Up"
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                {isLogin ? "Log in" : "Sign up"} with Google
              </Button>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}