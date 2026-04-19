import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import Navbar from './components/Navbar';
import HabitSection from './components/HabitSection';
import SessionSection from './components/SessionSection';
import ReportsSection from './components/ReportsSection';
import AICompanion from './components/AICompanion';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('habits');

  // --- HABITS STATE ---
  const [habitTitle, setHabitTitle] = useState('');
  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(true);

  // --- SESSIONS STATE ---
  const [sessionTitle, setSessionTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [duration, setDuration] = useState(30);
  const [focus, setFocus] = useState(3);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // --- THEME STATE ---
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!auth.currentUser) return;

    // Habits Listener
    const qHabits = query(collection(db, 'habits'), where('userId', '==', auth.currentUser.uid));
    const unsubHabits = onSnapshot(qHabits, (snapshot) => {
      const arr = [];
      snapshot.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setHabits(arr);
      setHabitsLoading(false);
    });

    // Sessions Listener
    const qSessions = query(collection(db, 'sessions'), where('userId', '==', auth.currentUser.uid));
    const unsubSessions = onSnapshot(qSessions, (snapshot) => {
      const arr = [];
      snapshot.forEach(d => arr.push({ id: d.id, ...d.data() }));
      arr.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setSessions(arr);
      setSessionsLoading(false);
    });

    return () => {
      unsubHabits();
      unsubSessions();
    };
  }, []);

  // --- HANDLERS ---
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    try {
      await addDoc(collection(db, 'habits'), {
        title: habitTitle,
        userId: auth.currentUser.uid,
        completed: false,
        createdAt: serverTimestamp()
      });
      setHabitTitle(''); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleHabit = async (habit) => {
    try {
      await updateDoc(doc(db, 'habits', habit.id), { completed: !habit.completed });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm("Delete this habit?")) {
      await deleteDoc(doc(db, 'habits', habitId));
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!sessionTitle.trim() || !duration) return;
    try {
      await addDoc(collection(db, 'sessions'), {
        title: sessionTitle,
        category,
        duration: Number(duration),
        focus: Number(focus),
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setSessionTitle('');
      setCategory('Work');
      setDuration(30);
      setFocus(3);
    } catch (error) {
      console.error(error);
    }
  };

  const renderFocus = (level) => "★".repeat(level) + "☆".repeat(5 - level);

  return (
    <div className="dashboard-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLightMode={isLightMode} 
        setIsLightMode={setIsLightMode} 
        handleLogout={handleLogout} 
      />

      {/* ACTIVE TAB CONTENT */}
      <div style={{ width: '100%' }}>
        {activeTab === 'habits' && (
          <HabitSection 
            habitTitle={habitTitle}
            setHabitTitle={setHabitTitle}
            habits={habits}
            habitsLoading={habitsLoading}
            handleAddHabit={handleAddHabit}
            handleToggleHabit={handleToggleHabit}
            handleDeleteHabit={handleDeleteHabit}
          />
        )}
        {activeTab === 'sessions' && (
          <SessionSection 
            sessionTitle={sessionTitle}
            setSessionTitle={setSessionTitle}
            category={category}
            setCategory={setCategory}
            duration={duration}
            setDuration={setDuration}
            focus={focus}
            setFocus={setFocus}
            sessions={sessions}
            sessionsLoading={sessionsLoading}
            handleAddSession={handleAddSession}
            renderFocus={renderFocus}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsSection 
            sessions={sessions}
            sessionsLoading={sessionsLoading}
            renderFocus={renderFocus}
          />
        )}
        {activeTab === 'ai' && (
          <AICompanion 
            sessions={sessions}
            sessionsLoading={sessionsLoading}
          />
        )}
      </div>
    </div>
  );
}
