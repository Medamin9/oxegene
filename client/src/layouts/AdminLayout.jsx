import React, { useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const { data: userData, isLoading, error } = useQuery('currentUser', api.getCurrentUser, {
    retry: false,
  });

  const logoutMutation = useMutation(api.logout, {
    onSuccess: () => {
      queryClient.clear();
      navigate('/admin/login');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-label-lg text-label-lg text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !userData?.user || userData.user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
    { path: '/admin/menu', label: 'Menu', icon: 'restaurant_menu' },
    { path: '/admin/content', label: 'Content', icon: 'edit_note' },
    { path: '/admin/messages', label: 'Messages', icon: 'mail' },
    { path: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col">
        <div className="p-6 border-b border-outline-variant">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">local_cafe</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Oxegene Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-label-lg text-label-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <div className="mb-3 px-4 py-2 rounded-lg bg-surface-container-high">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Logged in as</p>
            <p className="font-label-md text-label-md text-on-surface font-semibold">
              {userData.user.name}
            </p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-error-container text-on-error-container hover:bg-error transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-label-lg text-label-lg">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
