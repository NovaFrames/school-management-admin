import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { registerUser } from '../api/auth';
import { getOrganizations } from '../api/organizations';
import type { Organization } from '../types/organization';

export default function CreateSuperAdminPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadOrganizations = async () => {
      setOrganizationsLoading(true);
      try {
        const list = await getOrganizations();
        setOrganizations(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load organizations');
      } finally {
        setOrganizationsLoading(false);
      }
    };
    void loadOrganizations();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organizationId) {
      setError('Please select an organization');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role: 'super_admin',
        organization_id: organizationId,
      });
      setSuccess(`Super admin created: ${result.user.email}`);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create super admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Create Super Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            This page creates a user through <code>/api/register</code> with role fixed to <code>super_admin</code>.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                select
                label="Organization"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                required
                fullWidth
                disabled={organizationsLoading || loading}
                helperText={organizationsLoading ? 'Loading organizations...' : 'Select organization by ID'}
              >
                <MenuItem value="" disabled>
                  Select organization
                </MenuItem>
                {organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.org_name} ({org.id})
                  </MenuItem>
                ))}
              </TextField>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              {!organizationsLoading && organizations.length === 0 && (
                <Alert severity="warning">No organizations found. Create an organization first.</Alert>
              )}

              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" variant="contained" disabled={loading || organizationsLoading || organizations.length === 0}>
                  {loading ? (
                    <>
                      <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                      Creating...
                    </>
                  ) : (
                    'Create Super Admin'
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
