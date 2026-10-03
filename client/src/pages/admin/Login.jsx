import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';

function AdminLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation(api.login, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
      navigate('/admin');
    },
    onError: (err) => {
      setError(err.message || 'Login failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container text-on-primary-container mb-4">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Admin Login</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Oxegene Coffee Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-error-container text-on-error-container font-body-md text-body-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-lg bg-surface-container-high text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@oxegene.coffee"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-lg bg-surface-container-high text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="w-full h-12 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 font-label-lg text-label-lg transition-all shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isLoading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <a
            href="/"
            className="font-label-md text-label-md text-secondary hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Menu</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
