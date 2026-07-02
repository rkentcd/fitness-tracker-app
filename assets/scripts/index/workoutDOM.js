import { CONFIG, state, formatTime, formatDuration } from './workoutState.js';

export const elements = {};


export function cacheWorkoutElements() {
  elements.overlay = document.querySelector('.js-workout-overlay');
  elements.phase = document.querySelector('.js-workout-phase');
  elements.progress = document.querySelector('.js-workout-progress');
  elements.timer = document.querySelector('.js-workout-timer');
  elements.timerCircle = document.querySelector('.js-workout-timer-circle');
  elements.timerContainer = document.querySelector('.js-workout-timer-container');
  elements.exercise = document.querySelector('.js-workout-exercise');
  elements.exerciseImage = document.querySelector('.js-workout-exercise-image');
  elements.exerciseName = document.querySelector('.js-workout-exercise-name');
  elements.exerciseDetails = document.querySelector('.js-workout-exercise-details');
  elements.progressBar = document.querySelector('.js-workout-progress-bar');
  elements.controls = document.querySelector('.js-workout-controls');
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
}


export function renderWarmupExercise(exercise) {
  elements.phase.textContent = 'Warm Up';
  elements.exerciseImage.src = exercise.image;
  elements.exerciseImage.alt = exercise.name;
  elements.exerciseName.textContent = exercise.name;
  elements.exerciseDetails.textContent = exercise.details || '';

  elements.skipBtn.style.display = 'flex';
  elements.nextBtn.style.display = 'flex';
  elements.nextBtn.classList.add('is-disabled');
  elements.nextBtn.textContent = `Next ${CONFIG.WARMUP_DURATION}s`;
}

export function updateWarmupTimerDisplay() {
  elements.timer.textContent = Math.max(0, state.timeRemaining);

  const circumference = 339.292;
  const progress = state.timeRemaining / CONFIG.WARMUP_DURATION;
  const offset = circumference * (1 - progress);
  elements.timerCircle.style.strokeDashoffset = offset;
}

export function updateWarmupProgressBar() {
  const progress = ((CONFIG.WARMUP_DURATION - state.timeRemaining) / CONFIG.WARMUP_DURATION) * 100;
  elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
}

export function updateWarmupNextButton() {
  if (state.timeRemaining <= CONFIG.GRACE_PERIOD) {
    elements.nextBtn.classList.remove('is-disabled');
    elements.nextBtn.textContent = 'Next \u279c';
  } else {
    elements.nextBtn.classList.add('is-disabled');
    elements.nextBtn.textContent = `Next ${state.timeRemaining - CONFIG.GRACE_PERIOD}s`;
  }
}

export function updateWorkoutProgress() {
  const current = state.currentIndex + 1;
  const total = state.totalExercises;
  elements.progress.textContent = `${Math.min(current, total)}/${total}`;
}

// ===== Routine rendering =====

export function showRoutinePhase() {
  elements.routinePhase.style.display = 'flex';
  elements.skipBtn.style.display = 'none';
  elements.nextBtn.style.display = 'none';
  elements.timerContainer.style.display = 'none';
  elements.progressBar.style.display = 'none';
  elements.phase.textContent = 'Routine';
}

export function renderExerciseIntro(exercise, history) {
  elements.exerciseImage.src = exercise.image;
  elements.exerciseImage.alt = exercise.name;
  elements.exerciseName.textContent = exercise.name;
  elements.exerciseDetails.textContent =
    `${exercise.sets} \u00d7 ${exercise.reps} reps${exercise.kg ? ` \u00b7 ${exercise.kg}kg` : ''}`;

  elements.historyValue.textContent = history.length > 0 ? history.join('/') : '0/0/0';
  elements.repsInput.value = '0';
}

export function renderSetInfo(currentSet, totalSets) {
  elements.setInfo.textContent = `Set ${currentSet} of ${totalSets}`;
  elements.logSetBtn.disabled = false;
  elements.logSetBtn.style.opacity = '1';
  elements.repsInput.disabled = false;
}

export function renderRestTime(seconds) {
  elements.restTime.textContent = formatTime(seconds);
}

export function renderRestScreen(upcomingSet, totalSets) {
  elements.logSetBtn.disabled = true;
  elements.logSetBtn.style.opacity = '0.5';
  elements.repsInput.disabled = true;
  elements.setInfo.textContent = `Rest (${upcomingSet} of ${totalSets})`;
  renderRestTime(state.timeRemaining);
}

export function setPauseButtonState(isPaused) {
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

export function showCompleteScreen(totalExercises, totalSeconds) {
  elements.exercise.style.display = 'none';
  elements.routinePhase.style.display = 'none';
  elements.controls.style.display = 'none';
  elements.progressBar.style.display = 'none';
  elements.timerContainer.style.display = 'none';

  elements.complete.classList.add('is-active');
  elements.complete.style.display = 'flex';

  elements.completeExercises.textContent = totalExercises;
  elements.completeTime.textContent = formatDuration(totalSeconds);
}

export function resetWorkoutOverlay() {
  elements.overlay.classList.remove('is-active');

  elements.exercise.style.display = 'flex';
  elements.routinePhase.style.display = 'none';
  elements.complete.classList.remove('is-active');
  elements.complete.style.display = 'none';
  elements.progressBar.style.display = 'block';
  elements.timerContainer.style.display = 'flex';
  elements.controls.style.display = 'flex';

  elements.skipBtn.style.display = 'none';
  elements.nextBtn.style.display = 'flex';
  elements.nextBtn.classList.add('is-disabled');

  elements.timer.textContent = '0';
  elements.progressBar.style.width = '0%';
  renderRestTime(CONFIG.REST_DURATION);
}
