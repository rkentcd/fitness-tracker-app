import { getWorkoutsByDate } from '../storage.js';
import { escapeHtml } from '../utils/escape.js';
import { getLocalDateString } from '../utils/date.js';

const elements = {};

const WARMUP_IDS = ['warmup-1', 'warmup-2', 'warmup-3', 'warmup-4'];

// check if warmup
function isWarmupExercise(exercise) {
  if (WARMUP_IDS.includes(exercise.id)) return true;
  if (exercise.isWarmup === true) return true;
  const warmupNames = ['Jumping Jacks', 'Arm Circles', 'Leg Swings', 'Bodyweight Squats'];
  if (warmupNames.includes(exercise.name)) return true;
  return false;
}


export function initExerciseList() {
  elements.list = document.querySelector('.js-exercise-list');

  if (!elements.list) return;

  document.addEventListener('dateSelected', (event) => {
    updateExerciseList(event.detail.date);
  });

  // load todays date
  const today = getLocalDateString(new Date());
  updateExerciseList(today);
}


function updateExerciseList(dateStr) {
  const workouts = getWorkoutsByDate(dateStr);

  if (workouts.length === 0) {
    elements.list.innerHTML = `
      <div class="history__empty">
        <div class="history__empty-icon">💪</div>
        <div class="history__empty-title">No workouts yet</div>
        <div class="history__empty-subtitle">Complete a workout to see your history here</div>
      </div>
    `;
    return;
  }

  // get most recent workout on this date
  const workout = workouts[workouts.length - 1];

  // filter warmup exercises
  const routineExercises = workout.exercises.filter(ex => !isWarmupExercise(ex));

  if (!routineExercises || routineExercises.length === 0) {
    elements.list.innerHTML = `
      <div class="history__empty">
        <div class="history__empty-icon">📋</div>
        <div class="history__empty-title">No routine exercises</div>
        <div class="history__empty-subtitle">This workout only had warm-up exercises</div>
      </div>
    `;
    return;
  }

  let exercisesHTML = '';
  routineExercises.forEach((exercise) => {
    const sets = exercise.sets || 1;
    const reps = exercise.reps || 0;
    const kg = exercise.kg || 0;
    
    let setsDisplay = '';
    if (exercise.completedSets && exercise.completedSets.length > 0) {
      const setReps = exercise.completedSets.join(' / ');
      setsDisplay = `${exercise.sets} sets · ${setReps} reps`;
    } else {
      setsDisplay = `${sets} set${sets > 1 ? 's' : ''} · ${reps} reps${kg ? ` · ${kg}kg` : ''}`;
    }

    const escapedName = escapeHtml(exercise.name);
    const escapedImage = escapeHtml(exercise.image || 'assets/images/icons/hevy.png');

    exercisesHTML += `
      <div class="exercise-history-item">
        <img class="exercise-history-item__image" 
             src="${escapedImage}" 
             alt="${escapedName}">
        <div class="exercise-history-item__info">
          <div class="exercise-history-item__name">${escapedName}</div>
          <div class="exercise-history-item__sets">${setsDisplay}</div>
        </div>
      </div>
    `;
  });

  elements.list.innerHTML = exercisesHTML;
}
