import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApartmentOutlined,
  EmailOutlined,
  LockOutlined,
  SchoolOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { orgTheme } from '../theme';
import type { User } from '../types/auth';
import { loginUser } from '../api/auth';

interface Props {
  onLogin: (user: User, token: string, refreshToken?: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('orgadmin@test.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user, token, refreshToken } = await loginUser({ email, password });
      onLogin(user, token, refreshToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: orgTheme.background }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          flexShrink: 0,
          bgcolor: orgTheme.primary,
          px: 6,
          py: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', top: -90, right: -90 }} />
        <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', bottom: 50, left: -70 }} />

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SchoolOutlined sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#fff" lineHeight={1.2}>
              {orgTheme.appName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Management System
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={800} color="#fff" mb={1.5} lineHeight={1.3}>
            Manage organizations smarter
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, lineHeight: 1.8 }}>
            Secure admin login and complete organization CRUD in one dashboard.
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ApartmentOutlined sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                Create, list, update and delete organizations
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', position: 'relative', zIndex: 1 }}>
          © {new Date().getFullYear()} {orgTheme.appName}. All rights reserved.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 6, lg: 10 },
          py: 6,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2} sx={{ display: { xs: 'flex', md: 'none' }, mb: 4 }}>
          <SchoolOutlined sx={{ color: orgTheme.primary, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color={orgTheme.primary}>
            {orgTheme.appName}
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" fontWeight={800} color="text.primary" mb={0.75}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Sign in with your org admin account.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              autoComplete="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ fontSize: 19, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ fontSize: 19, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: 15,
                borderRadius: '10px',
                bgcolor: orgTheme.primary,
                boxShadow: `0 4px 16px ${alpha(orgTheme.primary, 0.35)}`,
                '&:hover': {
                  bgcolor: orgTheme.secondary,
                  boxShadow: `0 6px 20px ${alpha(orgTheme.primary, 0.45)}`,
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />
          <Typography variant="caption" color="text.disabled" display="block" textAlign="center">
            API base: {import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
