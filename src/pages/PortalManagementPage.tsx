import { useEffect, useState } from 'react';
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
  MenuItem,
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
import { DeleteRounded, EditRounded, RefreshRounded } from '@mui/icons-material';
import {
  createPortal,
  deletePortalById,
  getPortalById,
  getPortals,
  getUserPortalAccess,
  grantUserPortalAccess,
  revokeUserPortalAccess,
  updatePortalById,
  updateUserPortalAccess,
} from '../api/portals';
import type { Portal, UserPortalAccess } from '../types/portal';

export default function PortalManagementPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [portalLoading, setPortalLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [portalCode, setPortalCode] = useState('');
  const [portalDisplayName, setPortalDisplayName] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [editingPortal, setEditingPortal] = useState<Portal | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');

  const [accessUserId, setAccessUserId] = useState('');
  const [selectedPortalCode, setSelectedPortalCode] = useState('');
  const [accessRows, setAccessRows] = useState<UserPortalAccess[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [editingAccessId, setEditingAccessId] = useState('');
  const [editingAccessPortalCode, setEditingAccessPortalCode] = useState('');

  const loadPortals = async () => {
    setPortalLoading(true);
    setError('');
    try {
      const list = await getPortals();
      setPortals(list);
      if (!selectedPortalCode && list.length > 0) {
        setSelectedPortalCode(list[0].code);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch portals');
    } finally {
      setPortalLoading(false);
    }
  };

  useEffect(() => {
    void loadPortals();
  }, []);

  const handleCreatePortal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = portalCode.trim();
    const display_name = portalDisplayName.trim();
    if (!code || !display_name) {
      setError('code and display_name are required');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const created = await createPortal(code, display_name);
      setPortals((prev) => [created, ...prev]);
      setPortalCode('');
      setPortalDisplayName('');
      setSelectedPortalCode((prev) => prev || created.code);
      setSuccess('Portal created successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create portal');
    } finally {
      setBusy(false);
    }
  };

  const handleLookupPortal = async () => {
    if (!lookupId.trim()) {
      setError('Portal id is required for lookup');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const found = await getPortalById(lookupId.trim());
      setSuccess(`Found portal: ${found.code} (${found.display_name})`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch portal');
    } finally {
      setBusy(false);
    }
  };

  const openEditPortal = (portal: Portal) => {
    setEditingPortal(portal);
    setEditCode(portal.code);
    setEditDisplayName(portal.display_name);
  };

  const closeEditPortal = () => {
    setEditingPortal(null);
    setEditCode('');
    setEditDisplayName('');
  };

  const handleUpdatePortal = async () => {
    if (!editingPortal) return;
    const code = editCode.trim();
    const displayName = editDisplayName.trim();
    if (!code || !displayName) {
      setError('code and display_name are required');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updatePortalById(editingPortal.id, {
        code,
        display_name: displayName,
      });
      setPortals((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSuccess('Portal updated successfully');
      closeEditPortal();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update portal');
    } finally {
      setBusy(false);
    }
  };

  const handleDeletePortal = async (portal: Portal) => {
    const accepted = window.confirm(`Delete portal "${portal.display_name}" (${portal.code})?`);
    if (!accepted) return;

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await deletePortalById(portal.id);
      setPortals((prev) => prev.filter((item) => item.id !== portal.id));
      setSuccess('Portal deleted successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete portal');
    } finally {
      setBusy(false);
    }
  };

  const loadUserAccess = async () => {
    if (!accessUserId.trim()) {
      setError('user_id is required');
      return;
    }
    setAccessLoading(true);
    setError('');
    try {
      const rows = await getUserPortalAccess(accessUserId.trim());
      setAccessRows(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch user portal access');
    } finally {
      setAccessLoading(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user_id = accessUserId.trim();
    const portal_code = selectedPortalCode.trim();
    if (!user_id || !portal_code) {
      setError('user_id and portal_code are required');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const result = await grantUserPortalAccess(user_id, portal_code);
      setSuccess(result.message);
      await loadUserAccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to grant portal access');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateAccess = async (access_id: string) => {
    if (!editingAccessPortalCode.trim()) {
      setError('portal_code is required');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await updateUserPortalAccess(access_id, editingAccessPortalCode.trim());
      setSuccess('Portal access updated successfully');
      setEditingAccessId('');
      setEditingAccessPortalCode('');
      await loadUserAccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update portal access');
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeAccess = async (access: UserPortalAccess) => {
    const accepted = window.confirm(`Revoke access ${access.id}?`);
    if (!accepted) return;

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await revokeUserPortalAccess(access.id);
      setSuccess('Portal access revoked successfully');
      setAccessRows((prev) => prev.filter((item) => item.id !== access.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to revoke portal access');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Portal Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage portals and user portal access.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshRounded />}
              onClick={() => void loadPortals()}
              disabled={portalLoading || busy}
            >
              Refresh Portals
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Create Portal
          </Typography>
          <Box component="form" onSubmit={handleCreatePortal}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                label="code"
                value={portalCode}
                onChange={(e) => setPortalCode(e.target.value)}
                fullWidth
              />
              <TextField
                label="display_name"
                value={portalDisplayName}
                onChange={(e) => setPortalDisplayName(e.target.value)}
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={busy}>
                {busy ? <CircularProgress color="inherit" size={18} /> : 'Create'}
              </Button>
            </Stack>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mt={2.5}>
            <TextField
              label="Lookup portal by id"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              fullWidth
            />
            <Button variant="outlined" onClick={() => void handleLookupPortal()} disabled={busy}>
              Search by ID
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          {portalLoading ? (
            <Stack alignItems="center" justifyContent="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="22%">ID</TableCell>
                    <TableCell width="20%">Code</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell width="20%">Created</TableCell>
                    <TableCell width="16%" align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portals.map((portal) => (
                    <TableRow key={portal.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{portal.id}</TableCell>
                      <TableCell>{portal.code}</TableCell>
                      <TableCell>{portal.display_name}</TableCell>
                      <TableCell>{portal.created_at ? new Date(portal.created_at).toLocaleString() : '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEditPortal(portal)} disabled={busy}>
                          <EditRounded fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => void handleDeletePortal(portal)}
                          disabled={busy}
                          color="error"
                        >
                          <DeleteRounded fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {portals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box sx={{ py: 5, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            No portals found.
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

      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(2, 17, 37, 0.08)' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            User Portal Access
          </Typography>

          <Box component="form" onSubmit={handleGrantAccess}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                label="user_id"
                value={accessUserId}
                onChange={(e) => setAccessUserId(e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="portal_code"
                value={selectedPortalCode}
                onChange={(e) => setSelectedPortalCode(e.target.value)}
                fullWidth
                disabled={portals.length === 0}
              >
                {portals.length === 0 ? (
                  <MenuItem value="" disabled>
                    No portals available
                  </MenuItem>
                ) : (
                  portals.map((portal) => (
                    <MenuItem key={portal.id} value={portal.code}>
                      {portal.code} ({portal.display_name})
                    </MenuItem>
                  ))
                )}
              </TextField>
              <Button type="submit" variant="contained" disabled={busy || portals.length === 0}>
                Grant Access
              </Button>
              <Button variant="outlined" onClick={() => void loadUserAccess()} disabled={accessLoading || busy}>
                {accessLoading ? <CircularProgress color="inherit" size={18} /> : 'Load Access'}
              </Button>
            </Stack>
          </Box>

          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="21%">Access ID</TableCell>
                  <TableCell width="18%">User ID</TableCell>
                  <TableCell>Portal</TableCell>
                  <TableCell width="20%">Created</TableCell>
                  <TableCell width="23%" align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accessRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{row.id}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{row.user_id}</TableCell>
                    <TableCell>
                      {editingAccessId === row.id ? (
                        <Stack direction="row" spacing={1}>
                          <TextField
                            size="small"
                            value={editingAccessPortalCode}
                            onChange={(e) => setEditingAccessPortalCode(e.target.value)}
                            placeholder="portal_code"
                          />
                          <Button size="small" variant="contained" onClick={() => void handleUpdateAccess(row.id)}>
                            Save
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setEditingAccessId('');
                              setEditingAccessPortalCode('');
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      ) : (
                        `${row.portal_code || '-'}${row.display_name ? ` (${row.display_name})` : ''}`
                      )}
                    </TableCell>
                    <TableCell>{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</TableCell>
                    <TableCell align="right">
                      {editingAccessId !== row.id && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingAccessId(row.id);
                              setEditingAccessPortalCode(row.portal_code || '');
                            }}
                            disabled={busy}
                          >
                            <EditRounded fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => void handleRevokeAccess(row)}
                            disabled={busy}
                            color="error"
                          >
                            <DeleteRounded fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!accessLoading && accessRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ py: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Enter a user_id and load access to view records.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingPortal)} onClose={busy ? undefined : closeEditPortal} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Portal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="code"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="display_name"
            value={editDisplayName}
            onChange={(e) => setEditDisplayName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditPortal} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={() => void handleUpdatePortal()} disabled={busy} variant="contained">
            {busy ? <CircularProgress color="inherit" size={18} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
