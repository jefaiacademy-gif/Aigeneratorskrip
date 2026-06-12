import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <AdminNavbar />
      <main className="flex-1 ml-0 md:ml-[260px] min-h-screen overflow-x-hidden">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
