import { initSettingsNavigation } from './settings/settingsNavigation.js';
import { showPanelCreateRoutine, renderRoutineExercises } from './settings/panelCreateRoutine.js';
import { showPanelAddExercises, renderExercises } from './settings/panelAddExercises.js';
import { showPanelCreateCustomExercise, renderCustomExercises } from './settings/panelCreateCustomExercise.js';
import { showPanelExercisePreview } from './settings/panelExercisePreview.js';
import { initExerciseSearch } from './settings/exerciseSearch.js';
import { initExerciseSelection } from './settings/panelAddExercises.js';
import { initSheetExerciseOptions } from './settings/sheetExerciseOptions.js';
import { renderSelectRoutine } from './settings/panelSelectRoutine.js';
import { initSheetRoutineOptions } from './settings/sheetRoutineOptions.js';

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
initSheetRoutineOptions();

renderSelectRoutine();