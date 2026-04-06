import { useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { LogoutRounded } from '@mui/icons-material';
import { orgTheme } from '../theme';
import type { User } from '../types/auth';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/organizations': { title: 'Organizations', subtitle: 'Manage all organizations with full CRUD.' },
  '/super-admin/create': { title: 'Create Super Admin', subtitle: 'Create a super admin account from inside the web app.' },
};

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: Props) {
  const { pathname } = useLocation();
  const page = PAGE_META[pathname] ?? { title: 'Portal', subtitle: '' };
  const initials = user.full_name
    .split(' ')
    .map((x) => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Box
      sx={{
        height: 70,
        bgcolor: '#fff',
        borderBottom: '1px solid #f0f2f5',
        px: { xs: 2.5, md: 3.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexShrink: 0,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: orgTheme.primary }}>
          {orgTheme.appName} / {page.title}
        </Typography>
        <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
          {page.title}
        </Typography>
        {page.subtitle && <Typography sx={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{page.subtitle}</Typography>}
      </Box>

      <Stack direction="row" alignItems="center" spacing={1.5} flexShrink={0}>
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            bgcolor: '#f7f8fa',
            border: '1.5px solid #eef0f4',
            borderRadius: 2,
            px: 1.5,
            py: 0.65,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.45)' }}>{today}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ borderColor: '#eef0f4', my: 1 }} />
        <Tooltip title="Sign out" arrow>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={onLogout}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 2.5,
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f7f8fa' },
            }}
          >
            <Avatar sx={{ width: 34, height: 34, bgcolor: orgTheme.primary, fontSize: 12, fontWeight: 700 }}>{initials || 'OA'}</Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>{user.full_name}</Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', textTransform: 'capitalize' }}>{user.role.replace(/_/g, ' ')}</Typography>
            </Box>
            <LogoutRounded sx={{ fontSize: 15, color: 'rgba(0,0,0,0.3)', display: { xs: 'none', sm: 'block' } }} />
          </Stack>
        </Tooltip>
      </Stack>
    </Box>
  );
}
