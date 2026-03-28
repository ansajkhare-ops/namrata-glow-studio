import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="main-content" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
        <AdminLogin />
      </main>
    );
  }

  return (
    <main className="main-content" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}>
        <a href="/api/auth/signout" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.8rem' }}>Log out</a>
      </div>
      <AdminDashboard />
    </main>
  );
}
