import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <AdminNavbar />
      <main className="flex-1 ml-60"><Outlet /></main>
    </div>
  );
}
