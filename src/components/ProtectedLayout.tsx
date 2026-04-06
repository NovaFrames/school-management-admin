import { useState } from 'react';
import { clearAuthSession, getStoredUser, setAuthSession } from '../api/session';
import Layout from './Layout';
import LoginPage from '../pages/LoginPage';
import type { User } from '../types/auth';

export default function ProtectedLayout() {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const handleLogin = (loggedInUser: User, token: string, refreshToken?: string) => {
    setAuthSession({ user: loggedInUser, accessToken: token, refreshToken });
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Layout user={user} onLogout={handleLogout} />;
}
