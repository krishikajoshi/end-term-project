import React from 'react';

export default function HabitSection({
  habitTitle, setHabitTitle, habits, habitsLoading, handleAddHabit, handleToggleHabit, handleDeleteHabit
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
      <div className="card">
        <h3 className="section-title">Create New Habit</h3>
        <form className="habit-form" onSubmit={handleAddHabit}>
          <input
            type="text"
            className="habit-input"
            value={habitTitle}
            onChange={(e) => setHabitTitle(e.target.value)}
            placeholder="Enter a new habit..."
          />
          <button type="submit" className="btn btn-primary">Add Habit</button>
        </form>
      </div>
      <div className="card">
        <h3 className="section-title">Your Habits</h3>
        <ul className="habit-list">
          {habitsLoading ? (
            <li className="state-message">Loading habits...</li>
          ) : habits.length === 0 ? (
            <li className="state-message">No habits yet. Start tracking!</li>
          ) : (
            habits.map((habit) => (
              <li key={habit.id} className="habit-item">
                <div className="habit-content">
                  <input 
                    type="checkbox" 
                    className="habit-checkbox"
                    checked={habit.completed || false} 
                    onChange={() => handleToggleHabit(habit)}
                  />
                  <span className={`habit-text ${habit.completed ? 'completed' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                <button className="btn-delete" onClick={() => handleDeleteHabit(habit.id)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
