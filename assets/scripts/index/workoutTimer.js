import { getLoadedRoutineId, getSavedRoutines } from '../storage.js';
import { getExerciseHistory, saveExerciseHistory } from '../storage.js';


const CONFIG = {
  WARMUP_DURATION: 30,
  GRACE_PERIOD: 5,
  REST_DURATION: 60,
  ROUTINE_DURATION: 45,
};

const WARMUP_EXERCISES = [
  { id: 'warmup-1', name: 'Jumping Jacks', image: './assets/images/exercises/jumping-jacks.png', details: '20-30 reps' },
  { id: 'warmup-2', name: 'Arm Circles', image: './assets/images/exercises/arm-circles.png', details: '10-15 reps' },
  { id: 'warmup-3', name: 'Leg Swings', image: './assets/images/exercises/leg-swings.png', details: '10-15 reps' },
  { id: 'warmup-4', name: 'Bodyweight Squats', image: './assets/images/exercises/bodyweight-squats.png', details: '10-15 reps' },
];

const state = {
  isActive: false,
  isPaused: false,
  phase: 'idle', // idle, warmup, grace, routine, rest, complete
  currentIndex: 0,
  currentSet: 0,
  totalExercises: 0,
  timer: null,
  timeRemaining: 0,
  restTime: CONFIG.REST_DURATION,
  exercises: [],
  routineExercises: [],
  completedSets: [],
  completedExercises: [],
  currentReps: 0,
};

// dom references
const elements = {};

export function initWorkoutTimer() {
  elements.overlay = document.querySelector('.js-workout-overlay');
  elements.phase = document.querySelector('.js-workout-phase');
  elements.progress = document.querySelector('.js-workout-progress');
  elements.timer = document.querySelector('.js-workout-timer');
  elements.timerCircle = document.querySelector('.js-workout-timer-circle');
  elements.exercise = document.querySelector('.js-workout-exercise');
  elements.exerciseImage = document.querySelector('.js-workout-exercise-image');
  elements.exerciseName = document.querySelector('.js-workout-exercise-name');
  elements.exerciseDetails = document.querySelector('.js-workout-exercise-details');
  elements.progressBar = document.querySelector('.js-workout-progress-bar');
  elements.pauseBtn = document.querySelector('.js-workout-pause');
  elements.skipBtn = document.querySelector('.js-workout-skip');
  elements.nextBtn = document.querySelector('.js-workout-next');
  elements.routinePhase = document.querySelector('.js-workout-routine-phase');
  elements.restTime = document.querySelector('.js-workout-rest-time');
  elements.restDecrease = document.querySelector('.js-rest-decrease');
  elements.restIncrease = document.querySelector('.js-rest-increase');
  elements.setInfo = document.querySelector('.js-workout-set-info');
  elements.repsInput = document.querySelector('.js-workout-reps-input');
  elements.repsDecrease = document.querySelector('.js-reps-decrease');
  elements.repsIncrease = document.querySelector('.js-reps-increase');
  elements.logSetBtn = document.querySelector('.js-workout-log-set');
  elements.historyValue = document.querySelector('.js-workout-history');
  elements.complete = document.querySelector('.js-workout-complete');
  elements.completeExercises = document.querySelector('.js-complete-exercises');
  elements.completeTime = document.querySelector('.js-complete-time');
  elements.completeBtn = document.querySelector('.js-workout-complete-btn');
  elements.closeBtn = document.querySelector('.js-workout-close');
  elements.timerContainer = document.querySelector('.js-workout-timer-container');
  elements.workoutProgressBar = document.querySelector('.js-workout-progress-bar');

  setupEventListeners();

  //start routine btn
  const startBtn = document.querySelector('.start-routine');
  if (startBtn) {
    startBtn.addEventListener('click', startWorkout);
  }
}


function setupEventListeners() {
  //pause and resume
  elements.pauseBtn.addEventListener('click', togglePause);

  //skip for wamup
  elements.skipBtn.addEventListener('click', skipWarmup);

  //next for warmup
  elements.nextBtn.addEventListener('click', handleNext);

  //rest timer
  elements.restDecrease.addEventListener('click', () => adjustRestTime(-15));
  elements.restIncrease.addEventListener('click', () => adjustRestTime(15));

  //reps
  elements.repsDecrease.addEventListener('click', () => adjustReps(-1));
  elements.repsIncrease.addEventListener('click', () => adjustReps(1));
  elements.repsInput.addEventListener('change', handleRepsInputChange);

  //log set
  elements.logSetBtn.addEventListener('click', logSet);

  //close/complete
  elements.closeBtn.addEventListener('click', closeWorkout);
  elements.completeBtn.addEventListener('click', closeWorkout);
}


function startWorkout() {
  //get loaded routine
  const loadedId = getLoadedRoutineId();
  const routines = getSavedRoutines();
  const routine = routines.find(r => r.id === loadedId);

  if (!routine || routine.exercises.length === 0) {
    alert('Please load a routine first!');
    return;
  }

  //build list warmup + routine
  const routineExercises = routine.exercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    image: ex.image || 'assets/images/icons/hevy.png',
    kg: ex.kg || 0,
    reps: ex.reps || 12,
    sets: ex.sets || 3,
    isWarmup: false,
  }));

  state.exercises = [
    ...WARMUP_EXERCISES.map(ex => ({ ...ex, isWarmup: true })),
    ...routineExercises,
  ];

  state.totalExercises = state.exercises.length;
  state.currentIndex = 0;
  state.currentSet = 0;
  state.completedSets = [];
  state.completedExercises = [];
  state.phase = 'warmup';
  state.restTime = CONFIG.REST_DURATION;

  //show the overalay
  elements.overlay.classList.add('is-active');
  state.isActive = true;

  //hide routine phase show warmup phase
  elements.routinePhase.style.display = 'none';
  elements.exercise.style.display = 'flex';

  startWarmup();
}

// warmup phase
function startWarmup() {
  const exercise = state.exercises[state.currentIndex];
  
  if (!exercise) {
    startRoutine();
    return;
  }

  state.timeRemaining = CONFIG.WARMUP_DURATION;
  state.isPaused = false;
  state.phase = 'warmup';

  //update ui
  elements.phase.textContent = 'Warm Up';
  elements.exerciseImage.src = exercise.image;
  elements.exerciseImage.alt = exercise.name;
  elements.exerciseName.textContent = exercise.name;
  elements.exerciseDetails.textContent = exercise.details || '';

  //show skip button hide next button initially
  elements.skipBtn.style.display = 'flex';
  elements.nextBtn.style.display = 'flex';
  elements.nextBtn.classList.add('is-disabled');
  elements.nextBtn.textContent = `Next ${CONFIG.WARMUP_DURATION}s`;

  updateProgress();
  updateTimerDisplay();

  //rest pause button
  setPauseButtonState(false);

  // start timer
  clearInterval(state.timer);
  state.timer = setInterval(tickWarmup, 1000);
}

function tickWarmup() {
  if (state.isPaused) return;

  state.timeRemaining--;
  updateTimerDisplay();

  // update progress bar
  const progress = ((CONFIG.WARMUP_DURATION - state.timeRemaining) / CONFIG.WARMUP_DURATION) * 100;
  elements.progressBar.style.width = `${Math.min(progress, 100)}%`;

  // enable next button when on grace perood
  if (state.timeRemaining <= CONFIG.GRACE_PERIOD) {
    elements.nextBtn.classList.remove('is-disabled');
    elements.nextBtn.textContent = 'Next ➜';
  } else {
    elements.nextBtn.classList.add('is-disabled');
    elements.nextBtn.textContent = `Next ${state.timeRemaining - CONFIG.GRACE_PERIOD}s`;
  }

  // timer hit 0
  if (state.timeRemaining <= 0) {
    clearInterval(state.timer);
    advanceWarmup();
  }
}

function advanceWarmup() {
  //mark warmup as completed
  state.completedExercises.push(state.exercises[state.currentIndex]);
  state.currentIndex++;

  //check if all warmup done
  if (state.currentIndex >= WARMUP_EXERCISES.length) {
    //move to routine
    elements.skipBtn.style.display = 'none';
    startRoutine();
    return;
  }

  //start next warmup
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

// routine phase
function startRoutine() {
  state.phase = 'routine';
  state.currentSet = 0;
  state.completedSets = [];
  
  // show routine phase and hide warmup controls
  elements.routinePhase.style.display = 'flex';
  elements.skipBtn.style.display = 'none';
  elements.nextBtn.style.display = 'none';
  elements.timerContainer.style.display = 'none';
  elements.workoutProgressBar.style.display = 'none';
  
  elements.phase.textContent = 'Routine';

  // start first exercise
  startExercise();
}

function startExercise() {
  const exercise = state.exercises[state.currentIndex];

  if (!exercise || exercise.isWarmup) {
    completeWorkout();
    return;
  }

  //reset for this exercise
  state.currentSet = 0;
  state.completedSets = [];
  state.currentReps = 0;
  state.phase = 'routine';

  //update exercise display
  elements.exerciseImage.src = exercise.image;
  elements.exerciseImage.alt = exercise.name;
  elements.exerciseName.textContent = exercise.name;
  elements.exerciseDetails.textContent = `${exercise.sets} × ${exercise.reps} reps${exercise.kg ? ` · ${exercise.kg}kg` : ''}`;

  //load history
  const history = getExerciseHistory(exercise.id);
  elements.historyValue.textContent = history.length > 0 ? history.join('/') : '0/0/0';

  //reset resp
  elements.repsInput.value = '0';
  state.currentReps = 0;

  //start first set
  startSet();
}

function startSet() {
  const exercise = state.exercises[state.currentIndex];
  state.currentSet++;
  state.phase = 'set';

  //update set info
  elements.setInfo.textContent = `Set ${state.currentSet} of ${exercise.sets}`;

  //enable logging
  elements.logSetBtn.disabled = false;
  elements.logSetBtn.style.opacity = '1';
  elements.repsInput.disabled = false;

  //hide rest controls
  elements.restTime.textContent = formatTime(state.restTime);
}

function logSet() {
  const reps = parseInt(elements.repsInput.value) || 0;
  const exercise = state.exercises[state.currentIndex];

  //save reps for set
  state.completedSets.push(reps);

  //check if all sets are done
  if (state.completedSets.length >= exercise.sets) {
    finishExercise();
    return;
  }

  startRest();
}

function startRest() {
  state.phase = 'rest';
  state.timeRemaining = state.restTime;
  state.isPaused = false;

  //disable logging during rets
  elements.logSetBtn.disabled = true;
  elements.logSetBtn.style.opacity = '0.5';
  elements.repsInput.disabled = true;

  //update ui
  elements.setInfo.textContent = `Rest (${state.currentSet + 1} of ${state.exercises[state.currentIndex].sets})`;
  elements.restTime.textContent = formatTime(state.timeRemaining);

  //show rest timer
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    if (state.isPaused) return;

    state.timeRemaining--;
    elements.restTime.textContent = formatTime(state.timeRemaining);

    if (state.timeRemaining <= 0) {
      clearInterval(state.timer);
      startSet();
    }
  }, 1000);
}

function finishExercise() {
  const exercise = state.exercises[state.currentIndex];

  saveExerciseHistory(exercise.id, state.completedSets);

  state.completedExercises.push(exercise);
  state.currentIndex++;

  // check if all exercises are done
  if (state.currentIndex >= state.exercises.length) {
    completeWorkout();
    return;
  }
  // Start next exercise
  startExercise();
}

// rest timer
function adjustRestTime(seconds) {
  const newTime = state.restTime + seconds;
  if (newTime >= 15) { // Minimum 15 seconds
    state.restTime = newTime;
    elements.restTime.textContent = formatTime(state.restTime);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// reps input
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

// pause and resume
function togglePause() {
  state.isPaused = !state.isPaused;
  setPauseButtonState(state.isPaused);
}

function setPauseButtonState(isPaused) {
  if (isPaused) {
    elements.pauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
      Resume
    `;
    elements.pauseBtn.classList.add('is-paused');
  } else {
    elements.pauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
      Pause
    `;
    elements.pauseBtn.classList.remove('is-paused');
  }
}


function completeWorkout() {
  clearInterval(state.timer);
  state.phase = 'complete';
  state.isActive = false;

  // hide all ui and show complete screen
  elements.exercise.style.display = 'none';
  elements.routinePhase.style.display = 'none';
  elements.controls = document.querySelector('.workout__controls');
  if (elements.controls) elements.controls.style.display = 'none';
  elements.progressBar.style.display = 'none';
  document.querySelector('.workout__timer').style.display = 'none';
  elements.timerContainer.style.display = 'none';

  //show complete screen
  elements.complete.classList.add('is-active');
  elements.complete.style.display = 'flex';

  //calculate stats
  const totalExercises = state.completedExercises.length;
  const totalWarmupTime = WARMUP_EXERCISES.length * CONFIG.WARMUP_DURATION;
  const totalRoutineTime = (state.completedExercises.length - WARMUP_EXERCISES.length) * CONFIG.ROUTINE_DURATION;
  const totalTime = totalWarmupTime + totalRoutineTime;

  elements.completeExercises.textContent = totalExercises;
  elements.completeTime.textContent = `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`;
}

// close workout
function closeWorkout() {
  clearInterval(state.timer);
  state.isActive = false;
  state.isPaused = false;
  state.phase = 'idle';

  elements.overlay.classList.remove('is-active');

  //reset ui
  elements.exercise.style.display = 'flex';
  elements.routinePhase.style.display = 'none';
  elements.complete.classList.remove('is-active');
  elements.complete.style.display = 'none';
  elements.progressBar.style.display = 'block';
  document.querySelector('.workout__timer').style.display = 'flex';
  
  const controls = document.querySelector('.workout__controls');
  if (controls) controls.style.display = 'flex';

  elements.skipBtn.style.display = 'none';
  elements.nextBtn.style.display = 'flex';
  elements.nextBtn.classList.add('is-disabled');

  //reset timer
  state.timeRemaining = 0;
  elements.timer.textContent = '0';
  elements.progressBar.style.width = '0%';
  elements.restTime.textContent = formatTime(CONFIG.REST_DURATION);
}

// utility
function updateTimerDisplay() {
  elements.timer.textContent = Math.max(0, state.timeRemaining);

  const circumference = 339.292;
  const totalDuration = CONFIG.WARMUP_DURATION;
  const progress = state.timeRemaining / totalDuration;
  const offset = circumference * (1 - progress);
  elements.timerCircle.style.strokeDashoffset = offset;
}

function updateProgress() {
  const current = state.currentIndex + 1;
  const total = state.totalExercises;
  elements.progress.textContent = `${Math.min(current, total)}/${total}`;
}

// cleanup
export function cleanupWorkoutTimer() {
  clearInterval(state.timer);
}