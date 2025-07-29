import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Google, Microsoft, VpnKey } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { AsYouType, CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/auth';

type AuthMode = 'login' | 'signup';
type AuthMethod = 'email' | 'phone';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    inputValue: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryInfo, setCountryInfo] = useState({
    flag: '🌐',
    code: 'US',
    isValid: false,
  });

  const getFlagEmoji = useCallback((countryCode: string) => {
    try {
      return countryCode
        .toUpperCase()
        .split('')
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join('');
    } catch (e) {
      return '🌐';
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      phone: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      inputValue: '',
    });
    setError('');
  }, []);

  const handleAuthModeToggle = (event: React.MouseEvent<HTMLElement>, newAuthMode: AuthMode | null) => {
    if (newAuthMode !== null) {
      setAuthMode(newAuthMode);
      resetForm();
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === 'inputValue') {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (isEmail) {
          setAuthMethod('email');
          setFormData((prev) => ({ ...prev, email: value, phone: '' }));
        } else {
          setAuthMethod('phone');
          const phoneNumber = new AsYouType(countryInfo.code as CountryCode);
          const formatted = phoneNumber.input(value);
          const parsed = parsePhoneNumberFromString(formatted, countryInfo.code as CountryCode);
          setFormData((prev) => ({ ...prev, phone: formatted, email: '' }));
          if (parsed) {
            setCountryInfo({
              flag: getFlagEmoji(parsed.country || 'US'),
              code: parsed.country || 'US',
              isValid: parsed.isValid(),
            });
          }
        }
      }
    },
    [countryInfo.code, getFlagEmoji]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      try {
        let result;
        if (authMethod === 'email') {
          result =
            authMode === 'signup'
              ? await signUpWithEmail(formData.email, formData.password)
              : await signInWithEmail(formData.email, formData.password);
        } else {
          setError('Phone authentication coming soon');
          setIsLoading(false);
          return;
        }

        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Authentication failed');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [authMode, authMethod, formData, onClose]
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {authMode === 'login' ? 'Welcome back' : 'Get Started'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ToggleButtonGroup
          value={authMode}
          exclusive
          onChange={handleAuthModeToggle}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="login">Sign In</ToggleButton>
          <ToggleButton value="signup">Create Account</ToggleButton>
        </ToggleButtonGroup>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authMode === 'signup' && (
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            )}
            <TextField
              label="Email or Phone"
              name="inputValue"
              value={formData.inputValue}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: authMethod === 'phone' ? countryInfo.flag : undefined,
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {authMode === 'signup' && (
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </Box>
        </form>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
          <Typography sx={{ mx: 1 }}>Or</Typography>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Google />}
            onClick={async () => {
              const result = await signInWithGoogle();
              if (result.success) onClose();
              else setError(result.error || 'Google sign-in failed');
            }}
          >
            Google
          </Button>
          <Button variant="outlined" startIcon={<Microsoft />}>
            Microsoft
          </Button>
          <Button variant="outlined" startIcon={<VpnKey />}>
            SSO
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
