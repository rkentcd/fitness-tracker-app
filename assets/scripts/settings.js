import { initSettingsPanelNavigation } from "./settings/panelNavigation.js";
import { showCreateRoutinePanel, renderSelectedRoutineExercises } from "./settings/createRoutinePanel.js";
import { showAddExercisesPanel, renderExercises } from "./settings/addExercisesPanel.js";
import { showCreateExercisePanel, renderCustomExercises } from "./settings/createCustomExercise.js";
import { showExercisePreviewPanel } from "./settings/exercisePreviewPanel.js";
import { initExerciseSearch } from "./settings/exerciseSearch.js";
import {initExerciseSelection} from "./settings/addExercisesPanel.js";



initSettingsPanelNavigation();
showCreateRoutinePanel();
showAddExercisesPanel();
renderExercises();
showCreateExercisePanel();
showExercisePreviewPanel();
renderCustomExercises();

renderSelectedRoutineExercises();

initExerciseSearch();
initExerciseSelection();