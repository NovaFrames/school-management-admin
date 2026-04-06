import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { AddRounded, DeleteRounded, EditRounded, RefreshRounded } from '@mui/icons-material';
import {
  createOrganization,
  deleteOrganizationById,
  getOrganizations,
  updateOrganizationById,
} from '../api/organizations';
import type { Organization } from '../types/organization';

type ModalMode = 'create' | 'edit';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgNameInput, setOrgNameInput] = useState('');

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return organizations;
    return organizations.filter((org) => org.org_name.toLowerCase().includes(normalized));
  }, [organizations, search]);

  const fetchOrganizations = async () => {
    setError('');
    setLoading(true);
    try {
      const list = await getOrganizations();
      setOrganizations(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrganizations();
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingOrg(null);
    setOrgNameInput('');
  };

  const openCreateDialog = () => {
    setMode('create');
    setOrgNameInput('');
    setEditingOrg(null);
    setDialogOpen(true);
  };

  const openEditDialog = (org: Organization) => {
    setMode('edit');
    setEditingOrg(org);
    setOrgNameInput(org.org_name);
    setDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    const name = orgNameInput.trim();
    if (!name) {
      setError('Organization name is required');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'create') {
        const created = await createOrganization(name);
        setOrganizations((prev) => [created, ...prev]);
        setSuccess('Organization created successfully');
      } else if (editingOrg) {
        const updated = await updateOrganizationById(editingOrg.id, name);
        setOrganizations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSuccess('Organization updated successfully');
      }
      closeDialog();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Operation failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (org: Organization) => {
    const accepted = window.confirm(`Delete "${org.org_name}"?`);
    if (!accepted) return;

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await deleteOrganizationById(org.id);
      setOrganizations((prev) => prev.filter((item) => item.id !== org.id));
      setSuccess('Organization deleted successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Organization Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create, view, update and delete organizations.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshRounded />}
                onClick={() => void fetchOrganizations()}
                disabled={loading || busy}
              >
                Refresh
              </Button>
              <Button variant="contained" startIcon={<AddRounded />} onClick={openCreateDialog} disabled={busy}>
                Add Organization
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Search organizations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="18%">ID</TableCell>
                    <TableCell>Organization Name</TableCell>
                    <TableCell width="20%">Created</TableCell>
                    <TableCell width="16%" align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((org) => (
                    <TableRow key={org.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{org.id}</TableCell>
                      <TableCell>{org.org_name}</TableCell>
                      <TableCell>
                        {org.created_at ? new Date(org.created_at).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEditDialog(org)} disabled={busy}>
                          <EditRounded fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => void handleDelete(org)} disabled={busy} color="error">
                          <DeleteRounded fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box sx={{ py: 5, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            No organizations found.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={busy ? undefined : closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{mode === 'create' ? 'Create Organization' : 'Edit Organization'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Organization name"
            margin="dense"
            value={orgNameInput}
            onChange={(e) => setOrgNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={() => void handleCreateOrUpdate()} disabled={busy} variant="contained">
            {busy ? <CircularProgress color="inherit" size={18} /> : mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
