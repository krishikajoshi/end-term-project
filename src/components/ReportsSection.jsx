import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, 
  LineChart, Line
} from 'recharts';

export default function ReportsSection({ sessions, sessionsLoading, renderFocus }) {
  if (sessionsLoading) return <div className="state-message card">Loading reports...</div>;
  if (sessions.length === 0) return <div className="state-message card">No data available for reports yet. Complete some sessions!</div>;

  // --- CALCULATIONS ---
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const avgFocus = totalSessions > 0 ? (sessions.reduce((acc, curr) => acc + curr.focus, 0) / totalSessions).toFixed(1) : 0;

  // Pre-fill categories with 0 to ensure they always show up
  const initialCategories = { Work: 0, Health: 0, Study: 0, Entertainment: 0 };

  // Chart Data: Total duration per category
  const durationByCategoryObj = sessions.reduce((acc, session) => {
    acc[session.category] += session.duration;
    return acc;
  }, { ...initialCategories });
  
  const durationByCategoryData = Object.keys(durationByCategoryObj).map(key => ({
    name: key,
    value: durationByCategoryObj[key]
  }));

  // Chart Data: Distribution of sessions by category (count)
  const countByCategoryObj = sessions.reduce((acc, session) => {
    acc[session.category] += 1;
    return acc;
  }, { ...initialCategories });
  
  const countByCategoryData = Object.keys(countByCategoryObj).map(key => ({
    name: key,
    value: countByCategoryObj[key]
  }));

  // Chart Data: Sessions over time (by date)
  const sessionsByDateObj = sessions.reduce((acc, session) => {
    if (!session.createdAt) return acc;
    const date = session.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  let sessionsByDateData = Object.keys(sessionsByDateObj).map(key => ({
    date: key,
    sessions: sessionsByDateObj[key]
  })).reverse(); 

  // Pad single data point for better line chart rendering
  if (sessionsByDateData.length === 1 && sessions[0]?.createdAt) {
    const singleDate = sessions[0].createdAt.toDate();
    const prevDate = new Date(singleDate);
    prevDate.setDate(prevDate.getDate() - 1);
    sessionsByDateData.unshift({
      date: prevDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      sessions: 0
    });
  }

  const COLORS = ['#3b82f6', '#10b981', '#fbbf24', '#ef4444'];

  // Calculate Best Session
  let bestSession = null;
  if (sessions.length > 0) {
    bestSession = [...sessions].sort((a, b) => {
      if (b.focus !== a.focus) return b.focus - a.focus;
      return b.duration - a.duration;
    })[0];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Overview Stats (Grid) */}
      <div>
        <h3 className="section-title" style={{ paddingLeft: '5px' }}>Performance Overview</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Total Sessions</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalSessions}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Total Minutes</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>{totalDuration}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Avg Focus</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fbbf24' }}>{avgFocus}</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '30px' 
      }}>
        
        {/* Bar Chart */}
        <div className="card" style={{ padding: '25px' }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Duration per Category (mins)</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={durationByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card" style={{ padding: '25px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'center' }}>Sessions Distribution</h4>
          <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={countByCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {countByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
              {countByCategoryData.map((entry, index) => (
                <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Session Card */}
        {bestSession && (
          <div className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'center' }}>Top Focus Session</h4>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '20px', border: '1px dashed var(--success)' }}>
              <span style={{ fontSize: '32px', marginBottom: '10px' }}>🏆</span>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'var(--text-primary)' }}>{bestSession.title}</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <span style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '4px 10px', borderRadius: '12px' }}>{bestSession.category}</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{bestSession.duration} mins</span>
              </div>
              <div style={{ color: '#fbbf24', letterSpacing: '3px', fontSize: '18px', marginBottom: '15px' }}>
                {renderFocus(bestSession.focus)}
              </div>
              <p style={{ margin: 0, color: 'var(--success)', fontSize: '14px', fontWeight: '500' }}>
                This was your most productive session!
              </p>
            </div>
          </div>
        )}

        {/* Line Chart */}
        <div className="card" style={{ padding: '25px', gridColumn: '1 / -1' }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Session Activity Over Time</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={sessionsByDateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="sessions" stroke="var(--success)" strokeWidth={3} dot={{ r: 5, fill: 'var(--success)' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
