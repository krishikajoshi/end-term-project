import React from 'react';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function SessionSection({
  sessionTitle, setSessionTitle,
  category, setCategory,
  duration, setDuration,
  focus, setFocus,
  sessions, sessionsLoading,
  handleAddSession,
  renderFocus
}) {

  const handleDeleteSession = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this session?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "sessions", id));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
      
      {/* LEFT: FORM */}
      <div className="card">
        <h3 className="section-title">Log a Session</h3>

        <form onSubmit={handleAddSession} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Session Title
            </label>
            <input
              type="text"
              className="habit-input"
              style={{ width: '100%' }}
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Category
              </label>
              <select
                className="habit-input"
                style={{ width: '100%', cursor: 'pointer' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Study">Study</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Duration (mins)
              </label>
              <input
                type="number"
                min="1"
                className="habit-input"
                style={{ width: '100%' }}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Focus Level: {focus}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              style={{ width: '100%', cursor: 'pointer' }}
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Log Session
          </button>

        </form>
      </div>

      {/* RIGHT: RECENT SESSIONS */}
      <div className="card">
        <h3 className="section-title">Recent Sessions</h3>

        <ul className="habit-list">
          {sessionsLoading ? (
            <li className="state-message">Loading sessions...</li>

          ) : sessions.length === 0 ? (
            <li className="state-message">No sessions logged yet.</li>

          ) : (
            sessions.map((session) => (
              <li
                key={session.id}
                className="habit-item"
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >

                {/* TOP ROW */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: '600' }}>
                    {session.title}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                      {session.duration} min
                    </span>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      style={{
                        color: '#ff4d4d',
                        border: '1px solid #ff4d4d',
                        background: 'transparent',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>

                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: 'var(--text-secondary)',
                  fontSize: '13px'
                }}>
                  
                  <span style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {session.category}
                  </span>

                  <span style={{ color: '#fbbf24', letterSpacing: '2px' }}>
                    {renderFocus(session.focus)}
                  </span>

                </div>

              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  );
}