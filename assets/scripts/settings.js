import { initSettingsPanelNavigation } from "./settings/panelNavigation.js";
import { showCreateRoutinePanel } from "./settings/createRoutinePanel.js";
import { showAddExercisesPanel, renderExercises } from "./settings/addExercisesPanel.js";
import { showCreateExercisePanel, renderCustomExercises } from "./settings/createCustomExercise.js";
import { showExercisePreviewPanel } from "./settings/exercisePreviewPanel.js";
import { initExerciseSearch } from "./settings/exerciseSearch.js";
import {initExerciseSelection} from "./settings/addExercisesPanel.js";


// initialize all panels
initSettingsPanelNavigation();
showCreateRoutinePanel();
showAddExercisesPanel();
renderExercises();
showCreateExercisePanel();
showExercisePreviewPanel();
renderCustomExercises();

// initialize search and selection after exercises are rendered
initExerciseSearch();
initExerciseSelection();