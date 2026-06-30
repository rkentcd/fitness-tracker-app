import { getWorkoutsByDate } from '../storage.js';

const elements = {};

export function initWorkoutSummary() {
  elements.summary = document.querySelector('.js-workout-summary');
  elements.date = document.querySelector('.js-summary-date');
  elements.start = document.querySelector('.js-summary-start');
  elements.end = document.querySelector('.js-summary-end');
  elements.duration = document.querySelector('.js-summary-duration');

  if (!elements.summary) return;

  document.addEventListener('dateSelected', (event) => {
    updateSummary(event.detail.date);
  });

  // load with todays date
  const today = new Date().toISOString().split('T')[0];
  updateSummary(today);
}


function updateSummary(dateStr) {
  const workouts = getWorkoutsByDate(dateStr);

  if (workouts.length === 0) {
    elements.date.textContent = 'No workouts on this day';
    elements.start.textContent = '--:--';
    elements.end.textContent = '--:--';
    elements.duration.textContent = '--m --s';
    return;
  }

  // Get most recent workout on this date
  const workout = workouts[workouts.length - 1];

  const date = new Date(workout.date);
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  elements.date.textContent = date.toLocaleDateString('en-US', options);

  if (workout.startTime) {
    const start = new Date(workout.startTime);
    elements.start.textContent = start.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  if (workout.endTime) {
    const end = new Date(workout.endTime);
    elements.end.textContent = end.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  if (workout.duration) {
    const mins = Math.floor(workout.duration / 60);
    const secs = workout.duration % 60;
    elements.duration.textContent = `${mins}m ${secs}s`;
  }
}