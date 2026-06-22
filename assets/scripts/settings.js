import { initSettingsNavigation } from './settingsNavigation.js';
import { showPanelCreateRoutine, renderRoutineExercises } from './panelCreateRoutine.js';
import { showPanelAddExercises, renderExercises } from './panelAddExercises.js';
import { showPanelCreateCustomExercise, renderCustomExercises } from './panelCreateCustomExercise.js';
import { showPanelExercisePreview } from './panelExercisePreview.js';
import { initExerciseSearch } from './exerciseSearch.js';
import { initExerciseSelection } from './panelAddExercises.js';
import { initSheetExerciseOptions } from './sheetExerciseOptions.js';

initSettingsNavigation();
showPanelCreateRoutine();
showPanelAddExercises();
renderExercises();
showPanelCreateCustomExercise();
showPanelExercisePreview();
renderCustomExercises();

renderRoutineExercises();

initExerciseSearch();
initExerciseSelection();
initSheetExerciseOptions();