import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
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
  const { showSuccess, showError } = useMessage();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return false;
    }
    const domain = email.split('@')[1];
    if (domain !== ALLOWED_DOMAIN) {
      showError(`Access restricted to @${ALLOWED_DOMAIN} email addresses only`);
      return false;
    }
    return true;
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    if (!isLogin && password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        if (!user.emailVerified) {
          await sendEmailVerification(user);
          await signOut(auth);
          showError('Please verify your email before logging in');
          return;
        }
        showSuccess('Successfully logged in');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(user);
        await signOut(auth);
        showSuccess('Account created! Please verify your email');
        setIsLogin(true);
      }
    } catch (error) {
      const errorMessages = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/user-disabled': 'Account disabled',
        'auth/user-not-found': 'Account not found',
        'auth/wrong-password': 'Incorrect password'
      };
      showError(errorMessages[error.code] || 'Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: ALLOWED_DOMAIN });
      const { user } = await signInWithPopup(auth, provider);
      
      if (!user.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await signOut(auth);
        showError('Access restricted to Hyperverge employees');
        return;
      }
      
      showSuccess('Successfully logged in with Google');
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        showError('Google sign-in failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#000040] via-[#1E3A8A] to-[#00002B]">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden shadow-2xl bg-white">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000040] to-[#1E3A8A]">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h1>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email 
                  <span className="ml-2 text-xs text-[#000040] font-normal">(@hyperverge.co only)</span>
                </Label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? "Enter password" : "Create password"}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#000040] hover:from-[#000040] hover:to-[#1E3A8A] text-white"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-r-2 border-white" />
                ) : (
                  isLogin ? "Log In" : "Sign Up"
                )}
              </Button>
            </form>

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
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleGoogleAuth}
                className="w-full mt-4 border-[#000040]/20 hover:bg-[#000040]/5"
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                {isLogin ? "Log in" : "Sign up"} with Google
              </Button>
            </div>
          </div>

          <div className="px-8 py-4 bg-[#F0F1F9] border-t border-[#000040]/10">
            <p className="text-sm text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="font-medium text-[#000040] hover:text-[#1E3A8A]"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}