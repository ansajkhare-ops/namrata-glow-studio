"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn('google', { callbackUrl: '/admin' });
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username: credentials.username,
      password: credentials.password,
    });

    if (res?.error) {
      setError("Invalid username or password");
      setLoading(false);
    } else {
      window.location.href = '/admin'; // Force reload into secure session
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', margin: '140px auto 100px', padding: '50px 40px', textAlign: 'center' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 className="section-title" style={{ margin: '0 0 10px 0', fontSize: '2.2rem' }}>Admin Portal</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Log in using your authorized Studio Gmail account or standard credentials.</p>
        <div style={{ width: '60px', height: '3px', background: 'var(--gradient-glow)', margin: '20px auto 0', borderRadius: '3px' }}></div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {error && <div className="status-message error">{error}</div>}

        <button 
          onClick={handleGoogleLogin} 
          className="btn-primary" 
          disabled={loading}
          type="button"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', textTransform: 'none', fontSize: '1rem', fontWeight: '500' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
          <span style={{ padding: '0 15px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
        </div>

        <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '1px' }}>USERNAME</label>
            <input 
              type="text" 
              placeholder="admin" 
              required 
              className="form-input" 
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '1px' }}>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              className="form-input" 
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
