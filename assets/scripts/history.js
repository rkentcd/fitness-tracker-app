import { initCalendarStrip } from './history/calendarStrip.js';
import { initWorkoutSummary } from './history/workoutSummary.js';
import { initExerciseList } from './history/exerciseList.js';
import { getThemePreference, applyTheme } from './settings/themeManager.js';


const savedTheme = getThemePreference();
applyTheme(savedTheme);

initCalendarStrip();
initWorkoutSummary();
initExerciseList();