import {
  getLoadedRoutineId,
  getSavedRoutines,
  getExerciseHistory,
  saveExerciseHistory,
  saveWorkoutToHistory,
} from '../storage.js';
import {
  CONFIG,
  WARMUP_EXERCISES,
  state,
  resetWorkoutState,
  calculateWorkoutDuration,
  formatTime,
} from './workoutState.js';
import {
  elements,
  cacheWorkoutElements,
  renderWarmupExercise,
  updateWarmupTimerDisplay,
  updateWarmupProgressBar,
  updateWarmupNextButton,
  updateWorkoutProgress,
  showRoutinePhase,
  renderExerciseIntro,
  renderSetInfo,
  renderRestTime,
  renderRestScreen,
  setPauseButtonState,
  showCompleteScreen,
  resetWorkoutOverlay,
} from './workoutDOM.js';


export function initWorkoutTimer() {
  cacheWorkoutElements();
  setupEventListeners();

  const startBtn = document.querySelector('.js-start-routine');
  if (startBtn) {
    startBtn.addEventListener('click', startWorkout);
  }
}

function setupEventListeners() {
  elements.pauseBtn.addEventListener('click', togglePause);
  elements.skipBtn.addEventListener('click', skipWarmup);
  elements.nextBtn.addEventListener('click', handleNext);

  elements.restDecrease.addEventListener('click', () => adjustRestTime(-15));
  elements.restIncrease.addEventListener('click', () => adjustRestTime(15));

  elements.repsDecrease.addEventListener('click', () => adjustReps(-1));
  elements.repsIncrease.addEventListener('click', () => adjustReps(1));
  elements.repsInput.addEventListener('change', handleRepsInputChange);

  elements.logSetBtn.addEventListener('click', logSet);

  elements.closeBtn.addEventListener('click', closeWorkout);
  elements.completeBtn.addEventListener('click', closeWorkout);
}

// ===== Workout start =====

function startWorkout() {
  const loadedId = getLoadedRoutineId();
  const routines = getSavedRoutines();
  const routine = routines.find((savedRoutine) => savedRoutine.id === loadedId);

  if (!routine || routine.exercises.length === 0) {
    alert('Please load a routine first!');
    return;
  }

  resetWorkoutState(routine.exercises);

  elements.overlay.classList.add('is-active');
  elements.routinePhase.style.display = 'none';
  elements.exercise.style.display = 'flex';

  startWarmup();
}

// ===== Warm-up phase =====

function startWarmup() {
  const exercise = state.exercises[state.currentIndex];

  if (!exercise) {
    startRoutine();
    return;
  }

  state.timeRemaining = CONFIG.WARMUP_DURATION;
  state.isPaused = false;
  state.phase = 'warmup';

  renderWarmupExercise(exercise);
  updateWorkoutProgress();
  updateWarmupTimerDisplay();
  setPauseButtonState(false);

  clearInterval(state.timer);
  state.timer = setInterval(tickWarmup, 1000);
}

function tickWarmup() {
  if (state.isPaused) return;

  state.timeRemaining--;
  updateWarmupTimerDisplay();
  updateWarmupProgressBar();
  updateWarmupNextButton();

  if (state.timeRemaining <= 0) {
    clearInterval(state.timer);
    advanceWarmup();
  }
}

function advanceWarmup() {
  state.completedExercises.push(state.exercises[state.currentIndex]);
  state.currentIndex++;

  if (state.currentIndex >= WARMUP_EXERCISES.length) {
    elements.skipBtn.style.display = 'none';
    startRoutine();
    return;
  }

  startWarmup();
}

function skipWarmup() {
  clearInterval(state.timer);
  advanceWarmup();
}

function handleNext() {
  if (elements.nextBtn.classList.contains('is-disabled')) return;
  clearInterval(state.timer);
  advanceWarmup();
}

// ===== Routine phase =====

function startRoutine() {
  state.phase = 'routine';
  state.currentSet = 0;
  state.completedSets = [];

  showRoutinePhase();
  startExercise();
}

function startExercise() {
  const exercise = state.exercises[state.currentIndex];

  if (!exercise || exercise.isWarmup) {
    completeWorkout();
    return;
  }

  state.currentSet = 0;
  state.completedSets = [];
  state.currentReps = 0;
  state.phase = 'routine';

  const history = getExerciseHistory(exercise.id);
  renderExerciseIntro(exercise, history);

  startSet();
}

function startSet() {
  const exercise = state.exercises[state.currentIndex];
  state.currentSet++;
  state.phase = 'set';

  renderSetInfo(state.currentSet, exercise.sets);
  renderRestTime(state.restTime);
}

function logSet() {
  const reps = parseInt(elements.repsInput.value) || 0;
  const exercise = state.exercises[state.currentIndex];

  state.completedSets.push(reps);

  // Check if ALL sets for this exercise are complete
  if (state.completedSets.length >= exercise.sets) {
    // All sets done - check if this is the last exercise
    const isLastExercise = state.currentIndex >= state.exercises.length - 1;
    
    if (isLastExercise) {
      // Last exercise: Complete workout (no rest)
      finishExercise();
    } else {
      // Not last exercise: Start rest before next exercise
      startRestBeforeNextExercise();
    }
    return;
  }

  // Not all sets complete - start rest between sets
  startRest();
}

function startRestBeforeNextExercise() {
  state.phase = 'rest';
  state.timeRemaining = state.restTime;
  state.isPaused = false;

  const nextExercise = state.exercises[state.currentIndex + 1];

  // Show rest screen with next exercise name
  elements.logSetBtn.disabled = true;
  elements.logSetBtn.style.opacity = '0.5';
  elements.repsInput.disabled = true;
  elements.setInfo.textContent = `Next: ${nextExercise.name}`;
  elements.restTime.textContent = formatTime(state.timeRemaining);

  // Hide circle (matches main routine behavior)
  elements.timerContainer.style.display = 'none';

  clearInterval(state.timer);
  state.timer = setInterval(tickRestBeforeNextExercise, 1000);
}

function tickRestBeforeNextExercise() {
  if (state.isPaused) return;

  state.timeRemaining--;
  elements.restTime.textContent = formatTime(state.timeRemaining);

  if (state.timeRemaining <= 0) {
    clearInterval(state.timer);
    finishExercise();
  }
}

function startRest() {
  state.phase = 'rest';
  state.timeRemaining = state.restTime;
  state.isPaused = false;

  const exercise = state.exercises[state.currentIndex];
  renderRestScreen(state.currentSet + 1, exercise.sets);

  clearInterval(state.timer);
  state.timer = setInterval(tickRest, 1000);
}

function tickRest() {
  if (state.isPaused) return;

  state.timeRemaining--;
  renderRestTime(state.timeRemaining);

  if (state.timeRemaining <= 0) {
    clearInterval(state.timer);
    startSet();
  }
}

function finishExercise() {
  const exercise = state.exercises[state.currentIndex];

  saveExerciseHistory(exercise.id, state.completedSets);

  state.exerciseResults.push({
    id: exercise.id,
    name: exercise.name,
    image: exercise.image,
    sets: exercise.sets || 3,
    reps: exercise.reps || 12,
    kg: exercise.kg || 0,
    completedSets: [...state.completedSets],
    isWarmup: false,
  });

  state.completedExercises.push(exercise);
  state.currentIndex++;

  if (state.currentIndex >= state.exercises.length) {
    completeWorkout();
    return;
  }

  startExercise();
}

// ===== Rest timer controls =====

function adjustRestTime(seconds) {
  const newTime = state.restTime + seconds;
  if (newTime >= 15) { // Minimum 15 seconds
    state.restTime = newTime;
    renderRestTime(state.restTime);
  }
}

// ===== Reps input =====

function adjustReps(amount) {
  const current = parseInt(elements.repsInput.value) || 0;
  const newValue = Math.max(0, current + amount);
  elements.repsInput.value = newValue;
  state.currentReps = newValue;
}

function handleRepsInputChange() {
  const value = parseInt(elements.repsInput.value) || 0;
  state.currentReps = Math.max(0, value);
  elements.repsInput.value = state.currentReps;
}

function togglePause() {
  state.isPaused = !state.isPaused;
  setPauseButtonState(state.isPaused);
}

function completeWorkout() {
  clearInterval(state.timer);
  state.phase = 'complete';
  state.isActive = false;

  const workoutData = {
    startTime: state.startTime || new Date().toISOString(),
    endTime: new Date().toISOString(),
    exercises: state.exerciseResults,
    duration: calculateWorkoutDuration(),
  };
  saveWorkoutToHistory(workoutData);

  showCompleteScreen(state.exerciseResults.length, calculateWorkoutDuration());
}


function closeWorkout() {
  clearInterval(state.timer);
  state.isActive = false;
  state.isPaused = false;
  state.phase = 'idle';
  state.timeRemaining = 0;

  resetWorkoutOverlay();
}

export function cleanupWorkoutTimer() {
  clearInterval(state.timer);
}
