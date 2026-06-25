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