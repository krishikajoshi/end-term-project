import React, { useState } from 'react';

export default function AICompanion({ sessions, sessionsLoading }) {
  const [aiGoal, setAiGoal] = useState(null);
  const [motivationText, setMotivationText] = useState("Every great journey starts with a single step. Let's make today count!");
  const [fadeMotivation, setFadeMotivation] = useState(false);

  const MOTIVATION_MESSAGES = [
    "Every great journey starts with a single step. Let's make today count!",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Hard work beats talent when talent doesn't work hard.",
    "Focus on being productive instead of busy.",
    "Small progress is still progress.",
    "Your future is created by what you do today, not tomorrow.",
    "Believe you can and you're halfway there."
  ];

  const handleRefreshMotivation = () => {
    setFadeMotivation(true);
    setTimeout(() => {
      let nextMsg = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
      if (nextMsg === motivationText) {
        nextMsg = MOTIVATION_MESSAGES[(MOTIVATION_MESSAGES.indexOf(nextMsg) + 1) % MOTIVATION_MESSAGES.length];
      }
      setMotivationText(nextMsg);
      setFadeMotivation(false);
    }, 200); // 200ms fade duration
  };

  if (sessionsLoading) return <div className="state-message card">Loading AI Insights...</div>;
  if (sessions.length === 0) return <div className="state-message card">Complete some sessions first to unlock your AI Companion!</div>;

  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const avgFocus = totalSessions > 0 ? (sessions.reduce((acc, curr) => acc + curr.focus, 0) / totalSessions).toFixed(1) : 0;

  const countByCategoryObj = sessions.reduce((acc, session) => {
    acc[session.category] = (acc[session.category] || 0) + 1;
    return acc;
  }, {});
  
  const countByCategoryData = Object.keys(countByCategoryObj).map(key => ({
    name: key,
    value: countByCategoryObj[key]
  }));
  
  const mostUsedCategory = countByCategoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current, {name: 'None', value: 0});

  // Generate Suggestions
  const suggestions = [];
  if (avgFocus < 3) {
    suggestions.push("📉 Your focus is low. Try shorter sessions (25 mins) with strict breaks.");
  } else {
    suggestions.push("🔥 Your focus is excellent. Try pushing your session duration slightly longer.");
  }
  if (mostUsedCategory.name !== 'None') {
    suggestions.push(`📊 You dominate in '${mostUsedCategory.name}'. Schedule your hardest tasks in this category.`);
  }

  // Goal Generator Handler
  const handleGenerateGoal = () => {
    // Base calculations weighted by user performance
    let baseMinutes = 30;
    let maxMinutes = 90;
    let minSessions = 2;
    let maxSessions = 4;

    if (avgFocus > 3.5) {
      // High focus = challenge them
      baseMinutes = 45;
      maxMinutes = 120;
      minSessions = 3;
      maxSessions = 5;
    } else if (avgFocus < 2.5 && avgFocus > 0) {
      // Low focus = easier, shorter goals
      baseMinutes = 20;
      maxMinutes = 50;
      minSessions = 1;
      maxSessions = 3;
    }

    const randomMins = Math.floor(Math.random() * (maxMinutes - baseMinutes + 1)) + baseMinutes;
    // Round to nearest 5 mins for clean presentation
    const targetMins = Math.round(randomMins / 5) * 5;
    
    const targetSessions = Math.floor(Math.random() * (maxSessions - minSessions + 1)) + minSessions;

    const tipsPool = [
      "Focus intensely for the first 15 minutes to break the friction of starting.",
      "Put your phone in another room until you complete this session.",
      "Try the 50/10 rule: 50 minutes of deep work followed by a 10-minute walk.",
      "Before starting, write down the ONE most important thing you need to finish.",
      "Listen to instrumental or lo-fi music to help maintain a flow state.",
      "Reward yourself immediately after finishing this goal to reinforce the habit."
    ];
    
    // Select a random tip, avoiding the exact same consecutive tip
    let randomTip = tipsPool[Math.floor(Math.random() * tipsPool.length)];
    if (aiGoal && aiGoal.tip === randomTip) {
      randomTip = tipsPool[(tipsPool.indexOf(randomTip) + 1) % tipsPool.length];
    }

    setAiGoal({
      dailyTarget: `${targetMins} mins`,
      sessionsTarget: targetSessions,
      tip: randomTip
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
      
      {/* Motivation Section */}
      <div className="card" style={{ gridColumn: '1 / -1', background: 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(16,185,129,0.1))', border: '1px solid var(--success)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌟</span> Daily Motivation
          </h3>
          <button 
            onClick={handleRefreshMotivation} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--text-secondary)', transition: 'color 0.2s', padding: '5px' }}
            title="Refresh Motivation"
            onMouseOver={(e) => e.target.style.color = 'var(--success)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            🔄
          </button>
        </div>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--success)', 
          margin: 0, 
          fontWeight: '500',
          opacity: fadeMotivation ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}>
          "{motivationText}"
        </p>
      </div>

      {/* AI Insights Section */}
      <div className="card">
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <span style={{ fontSize: '20px' }}>🧠</span> Smart Analysis
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Most Productive Area</span>
            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{mostUsedCategory.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Average Focus Level</span>
            <span style={{ fontWeight: '600', color: '#fbbf24' }}>{avgFocus} / 5</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Tracked Time</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{totalDuration} mins</span>
          </div>
        </div>
      </div>

      {/* Personalized Suggestions */}
      <div className="card">
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <span style={{ fontSize: '20px' }}>🎯</span> Actionable Suggestions
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {suggestions.map((s, i) => (
            <li key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
              {s}
            </li>
          ))}
          <li style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
            💡 Hydration is key to cognitive function. Make sure to drink a glass of water before your next session!
          </li>
        </ul>
      </div>

      {/* Smart Goal Generator */}
      <div className="card" style={{ gridColumn: '1 / -1', border: '1px solid var(--primary)', background: 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(59,130,246,0.1))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '22px' }}>⚡</span> Smart Goal Generator
          </h3>
          <button onClick={handleGenerateGoal} className="btn btn-primary">Generate Study Goal</button>
        </div>
        
        {aiGoal ? (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Target</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{aiGoal.dailyTarget}</div>
            </div>
            <div style={{ flex: '1 1 200px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sessions Target</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{aiGoal.sessionsTarget} Sessions</div>
            </div>
            <div style={{ flex: '1 1 100%', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid #fbbf24' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Improvement Tip</div>
              <div style={{ fontSize: '16px', lineHeight: '1.5', color: 'var(--text-primary)' }}>{aiGoal.tip}</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            Click the button above to generate a data-driven goal for today.
          </div>
        )}
      </div>

    </div>
  );
}
