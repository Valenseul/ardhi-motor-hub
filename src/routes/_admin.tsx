import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useAuth, signOut } from "@/lib/useAuth";
import { LayoutDashboard, Car, LogOut, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOWROOM } from "@/lib/showroom";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) {
    if (typeof window !== "undefined") nav({ to: "/login" });
    return null;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold">Akses ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">Akun <strong>{user.email}</strong> belum memiliki role admin. Hubungi pemilik untuk diaktifkan.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/"><Button variant="outline">Beranda</Button></Link>
            <Button onClick={async () => { await signOut(); nav({ to: "/login" }); }}>Logout</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src="/logo.jpeg"
              alt="Ardhi Motor"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />
          </span>
          <div>
            <div className="font-display text-sm font-bold leading-none">{SHOWROOM.name}</div>
            <div className="text-[10px] text-sidebar-foreground/70">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <Link to="/admin" activeOptions={{ exact: true }} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent font-semibold" }}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link to="/admin/mobil" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent font-semibold" }}>
            <Car className="h-4 w-4" /> Manajemen Mobil
          </Link>
        </nav>
        <div className="space-y-2 border-t border-sidebar-border p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
            <ExternalLink className="h-4 w-4" /> Lihat Website
          </a>
          <button onClick={async () => { await signOut(); nav({ to: "/login" }); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> Logout
          </button>
          <div className="truncate px-3 pt-1 text-[10px] text-sidebar-foreground/70">{user.email}</div>
        </div>
      </aside>
      <main className="md:pl-60">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6 md:hidden">
          <span className="font-display font-bold">{SHOWROOM.name} Admin</span>
          <button onClick={async () => { await signOut(); nav({ to: "/login" }); }}><LogOut className="h-4 w-4" /></button>
        </header>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
