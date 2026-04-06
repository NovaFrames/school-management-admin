import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import OrganizationsPage from './pages/OrganizationsPage';
import CreateSuperAdminPage from './pages/CreateSuperAdminPage';
import PortalManagementPage from './pages/PortalManagementPage';

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/organizations" replace />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/super-admin/create" element={<CreateSuperAdminPage />} />
        <Route path="/portal-management" element={<PortalManagementPage />} />
        <Route path="*" element={<Navigate to="/organizations" replace />} />
      </Route>
    </Routes>
  );
}
