const KEYS = {
  CUSTOM_EXERCISES: 'fitness_custom_exercises',
  CURRENT_ROUTINE: 'fitness_current_routine'
};

function getData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
}

function setData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
}

// for custom exercises
export function getCustomExercises() {
  return getData(KEYS.CUSTOM_EXERCISES, []);
}

export function saveCustomExercises(exercises) {
  return setData(KEYS.CUSTOM_EXERCISES, exercises);
}

export function addCustomExercise(exercise) {
  const exercises = getCustomExercises();
  exercises.push(exercise);
  saveCustomExercises(exercises);
  return exercises;
}

export function deleteCustomExercise(exerciseId) {
  const exercises = getCustomExercises();
  const filtered = exercises.filter((ex) => ex.id !== exerciseId);
  saveCustomExercises(filtered);
  return filtered;
}

// for routine exercises
export function getCurrentRoutineExercises() {
  return getData(KEYS.CURRENT_ROUTINE, []);
}

export function saveCurrentRoutineExercises(exercises) {
  return setData(KEYS.CURRENT_ROUTINE, exercises);
}

// clear all data
export function clearAllData() {
  const allKeys = Object.values(KEYS);
  allKeys.push('fitness_saved_routines');
  allKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}

// saved routines
export function getSavedRoutines() {
  return getData('fitness_saved_routines', []);
}

export function saveSavedRoutines(routines) {
  return setData('fitness_saved_routines', routines);
}

export function addSavedRoutine(routine) {
  const routines = getSavedRoutines();
  routines.push(routine);
  saveSavedRoutines(routines);
  return routines;
}

export function getLoadedRoutineId() {
  return getData('fitness_loaded_routine_id', null);
}

export function saveLoadedRoutineId(id) {
  return setData('fitness_loaded_routine_id', id);
}

export function clearLoadedRoutineId() {
  return setData('fitness_loaded_routine_id', null);
}

//exercis history
const HISTORY_KEY = 'fitness_exercise_history';

export function getExerciseHistory(exerciseId) {
  const history = getData(HISTORY_KEY, {});
  return history[exerciseId] || [];
}

export function saveExerciseHistory(exerciseId, repsArray) {
  const history = getData(HISTORY_KEY, {});
  history[exerciseId] = repsArray;
  return setData(HISTORY_KEY, history);
}

//workout histroy
const WORKOUT_HISTORY_KEY = 'fitness_workout_history';

/**
 * Get all saved workouts
 * @returns {Array} Array of workout objects
 */
export function getWorkoutHistory() {
  return getData(WORKOUT_HISTORY_KEY, []);
}

/**
 * Save a completed workout to history
 * @param {Object} workout - Workout data with exercises, startTime, endTime
 */
export function saveWorkoutToHistory(workout) {
  const history = getWorkoutHistory();
  history.push({
    id: 'workout_' + Date.now(),
    ...workout,
    date: workout.startTime || new Date().toISOString(),
  });
  return setData(WORKOUT_HISTORY_KEY, history);
}

/**
 * Get workouts for a specific date
 * @param {string} dateStr - Date string in 'YYYY-MM-DD' format
 * @returns {Array} Array of workouts on that date
 */
export function getWorkoutsByDate(dateStr) {
  const history = getWorkoutHistory();
  return history.filter(workout => {
    const workoutDate = new Date(workout.date);
    const formattedDate = workoutDate.toISOString().split('T')[0];
    return formattedDate === dateStr;
  });
}

/**
 * Get all dates that have workouts
 * @returns {Array} Array of date strings in 'YYYY-MM-DD' format
 */
export function getWorkoutDates() {
  const history = getWorkoutHistory();
  const dates = history.map(workout => {
    return new Date(workout.date).toISOString().split('T')[0];
  });
  return [...new Set(dates)]; // Remove duplicates
}