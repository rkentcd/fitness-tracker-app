import { renderRoutineExercises, initWarmupToggle } from './index/renderRoutine.js';
import { initWorkoutTimer } from './index/workoutTimer.js';
import { getThemePreference, applyTheme } from './settings/themeManager.js';

const savedTheme = getThemePreference();
applyTheme(savedTheme);


renderRoutineExercises();
initWarmupToggle();
initWorkoutTimer();