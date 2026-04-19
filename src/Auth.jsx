import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card" style={{ margin: '100px auto', maxWidth: '450px', width: '100%' }}>
      <div className="dashboard-header" style={{ marginBottom: '20px' }}>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      </div>
      
      {error && (
        <div className="state-message" style={{ color: 'var(--danger)', padding: '10px', marginBottom: '20px', borderColor: 'var(--danger)' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
          <input 
            type="email" 
            className="habit-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Password</label>
          <input 
            type="password" 
            className="habit-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '25px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}
