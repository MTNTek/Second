/**
 * Admin Page - Protected Route
 * Perry Eden Group - Professional Services Platform
 */

import AdminAuth from '../components/AdminAuth';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminAuth>
      <AdminDashboard />
    </AdminAuth>
  );
}
