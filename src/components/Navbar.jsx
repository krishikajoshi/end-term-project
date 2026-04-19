import React from 'react';

export default function Navbar({ activeTab, setActiveTab, isLightMode, setIsLightMode, handleLogout }) {
  return (
    <>
      <div className="dashboard-header" style={{ marginBottom: '20px', borderBottom: 'none' }}>
        <h2 style={{ fontSize: '28px' }}>Dashboard</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => setIsLightMode(!isLightMode)} 
            style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', 
              padding: '6px 16px', cursor: 'pointer', color: 'var(--text-primary)', 
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', transition: 'all 0.2s' 
            }}
          >
            {isLightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', borderBottom: '1px solid var(--card-border)', paddingBottom: '15px' }}>
        <button 
          onClick={() => setActiveTab('habits')}
          style={{ 
            background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px',
            color: activeTab === 'habits' ? 'var(--text-primary)' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'habits' ? 'var(--card-bg)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Habits
        </button>
        <button 
          onClick={() => setActiveTab('sessions')}
          style={{ 
            background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px',
            color: activeTab === 'sessions' ? 'var(--text-primary)' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'sessions' ? 'var(--card-bg)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Sessions
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          style={{ 
            background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px',
            color: activeTab === 'reports' ? 'var(--text-primary)' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'reports' ? 'var(--card-bg)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Reports
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          style={{ 
            background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px',
            color: activeTab === 'ai' ? 'var(--text-primary)' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'ai' ? 'var(--primary)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          ✨ AI Companion
        </button>
      </div>
    </>
  );
}
