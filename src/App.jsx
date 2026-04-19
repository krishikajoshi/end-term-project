import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Auth from './Auth';
import Dashboard from './Dashboard';git add .
git commit -m "fix: removed old pages imports"
git push
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Auth />} 
        />

        {/* HABITS */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/" />} 
        />

        {/* SESSIONS */}
        <Route 
          path="/sessions" 
          element={user ? <Sessions /> : <Navigate to="/" />} 
        />

        {/* REPORTS */}
        <Route 
          path="/reports" 
          element={user ? <Reports /> : <Navigate to="/" />} 
        />

      </Routes>
    </Router>
  );
}

export default App;