// Timing configuration for each phase of a workout (all values in seconds)
export const CONFIG = {
  WARMUP_DURATION: 30,
  GRACE_PERIOD: 5,
  REST_DURATION: 60,
  ROUTINE_DURATION: 45,
};

// Fixed warm-up exercises shown before every routine
export const WARMUP_EXERCISES = [
  { id: 'warmup-1', name: 'Jumping Jacks', image: './assets/images/exercises/jumping-jacks.png', details: '20-30 reps' },
  { id: 'warmup-2', name: 'Arm Circles', image: './assets/images/exercises/arm-circles.png', details: '10-15 reps' },
  { id: 'warmup-3', name: 'Leg Swings', image: './assets/images/exercises/leg-swings.png', details: '10-15 reps' },
  { id: 'warmup-4', name: 'Bodyweight Squats', image: './assets/images/exercises/bodyweight-squats.png', details: '10-15 reps' },
];

export const state = {
  isActive: false,
  isPaused: false,
  phase: 'idle', // idle, warmup, routine, set, rest, complete
  currentIndex: 0,
  currentSet: 0,
  totalExercises: 0,
  timer: null,
  timeRemaining: 0,
  restTime: CONFIG.REST_DURATION,
  exercises: [],
  completedSets: [],
  completedExercises: [],
  exerciseResults: [],
  currentReps: 0,
  startTime: null,
};

export function resetWorkoutState(routineExercises) {
  const normalizedRoutineExercises = routineExercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    image: exercise.image || 'assets/images/icons/hevy.png',
    kg: exercise.kg || 0,
    reps: exercise.reps || 12,
    sets: exercise.sets || 3,
    isWarmup: false,
  }));

  state.exercises = [
    ...WARMUP_EXERCISES.map((exercise) => ({ ...exercise, isWarmup: true })),
    ...normalizedRoutineExercises,
  ];

  state.totalExercises = state.exercises.length;
  state.currentIndex = 0;
  state.currentSet = 0;
  state.completedSets = [];
  state.completedExercises = [];
  state.exerciseResults = [];
  state.phase = 'warmup';
  state.restTime = CONFIG.REST_DURATION;
  state.startTime = new Date().toISOString();
  state.isActive = true;
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function calculateWorkoutDuration() {
  if (!state.startTime) return 0;
  const start = new Date(state.startTime);
  const end = new Date();
  return Math.floor((end - start) / 1000);
}
