import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ApartmentRounded,
  AdminPanelSettingsRounded,
  AppsRounded,
  LogoutRounded,
  MenuOpenRounded,
  MenuRounded,
  SchoolRounded,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { orgTheme } from '../theme';
import type { User } from '../types/auth';

const SIDEBAR_FULL = 260;
const SIDEBAR_MINI = 74;

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const initials = user.full_name
    .split(' ')
    .map((x) => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const activeOrganizations = pathname === '/organizations';
  const activeSuperAdmin = pathname === '/super-admin/create';
  const activePortalManagement = pathname === '/portal-management';

  return (
    <Box
      sx={{
        width: collapsed ? SIDEBAR_MINI : SIDEBAR_FULL,
        height: '100vh',
        position: 'sticky',
        top: 0,
        bgcolor: orgTheme.primary,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
      }}
    >
      <Box sx={{ flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', height: 70, display: 'flex', alignItems: 'center' }}>
        {collapsed ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Expand" placement="right" arrow>
              <IconButton
                onClick={() => setCollapsed(false)}
                size="small"
                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <MenuRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Stack direction="row" alignItems="center" sx={{ px: 2, width: '100%', justifyContent: 'space-between', overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SchoolRounded sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ color: '#fff', fontWeight: 700, fontSize: 14.5, lineHeight: 1.2 }}>
                  {orgTheme.appName}
                </Typography>
                <Typography noWrap sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                  Management System
                </Typography>
              </Box>
            </Stack>
            <Tooltip title="Collapse" placement="right" arrow>
              <IconButton
                onClick={() => setCollapsed(true)}
                size="small"
                sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <MenuOpenRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      <Box sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        <Tooltip title={collapsed ? 'Organizations' : ''} placement="right" arrow>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => navigate('/organizations')}
            sx={{
              px: collapsed ? 0 : 1.5,
              py: 1.1,
              mx: collapsed ? 'auto' : 0,
              width: collapsed ? 46 : '100%',
              height: collapsed ? 46 : 'auto',
              borderRadius: 2.5,
              cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              bgcolor: activeOrganizations ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { bgcolor: activeOrganizations ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' },
            }}
          >
            <ApartmentRounded sx={{ color: activeOrganizations ? '#fff' : 'rgba(255,255,255,0.6)' }} />
            {!collapsed && (
              <Typography sx={{ color: activeOrganizations ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: activeOrganizations ? 700 : 500, fontSize: 13.5 }}>
                Organizations
              </Typography>
            )}
          </Stack>
        </Tooltip>

        <Tooltip title={collapsed ? 'Create Super Admin' : ''} placement="right" arrow>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => navigate('/super-admin/create')}
            sx={{
              mt: 1,
              px: collapsed ? 0 : 1.5,
              py: 1.1,
              mx: collapsed ? 'auto' : 0,
              width: collapsed ? 46 : '100%',
              height: collapsed ? 46 : 'auto',
              borderRadius: 2.5,
              cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              bgcolor: activeSuperAdmin ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { bgcolor: activeSuperAdmin ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' },
            }}
          >
            <AdminPanelSettingsRounded sx={{ color: activeSuperAdmin ? '#fff' : 'rgba(255,255,255,0.6)' }} />
            {!collapsed && (
              <Typography sx={{ color: activeSuperAdmin ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: activeSuperAdmin ? 700 : 500, fontSize: 13.5 }}>
                Create Super Admin
              </Typography>
            )}
          </Stack>
        </Tooltip>

        <Tooltip title={collapsed ? 'Portal Management' : ''} placement="right" arrow>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => navigate('/portal-management')}
            sx={{
              mt: 1,
              px: collapsed ? 0 : 1.5,
              py: 1.1,
              mx: collapsed ? 'auto' : 0,
              width: collapsed ? 46 : '100%',
              height: collapsed ? 46 : 'auto',
              borderRadius: 2.5,
              cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              bgcolor: activePortalManagement ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { bgcolor: activePortalManagement ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' },
            }}
          >
            <AppsRounded sx={{ color: activePortalManagement ? '#fff' : 'rgba(255,255,255,0.6)' }} />
            {!collapsed && (
              <Typography
                sx={{
                  color: activePortalManagement ? '#fff' : 'rgba(255,255,255,0.75)',
                  fontWeight: activePortalManagement ? 700 : 500,
                  fontSize: 13.5,
                }}
              >
                Portal Management
              </Typography>
            )}
          </Stack>
        </Tooltip>
      </Box>

      <Box sx={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.08)', p: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
          sx={{
            px: 1,
            py: 1,
            borderRadius: 2.5,
            bgcolor: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: alpha('#fff', 0.2),
              border: '1.5px solid rgba(255,255,255,0.3)',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {initials || 'OA'}
          </Avatar>
          {!collapsed && (
            <>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ color: '#fff', fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>
                  {user.full_name}
                </Typography>
                <Typography noWrap sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'capitalize' }}>
                  {user.role.replace(/_/g, ' ')}
                </Typography>
              </Box>
              <Tooltip title="Sign out" placement="right">
                <IconButton
                  onClick={onLogout}
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.45)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <LogoutRounded sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
