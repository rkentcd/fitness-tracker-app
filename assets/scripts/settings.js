import { initSettingsPanelNavigation } from "./settings/panelNavigation.js";
import { showCreateRoutinePanel } from "./settings/createRoutinePanel.js";
import { showAddExercisesPanel, renderExercises } from "./settings/addExercisesPanel.js";
import { showCreateExercisePanel } from "./settings/createCustomExercise.js";
import { showExercisePreviewPanel } from "./settings/exercisePreviewPanel.js";
import { initExerciseSearch } from "./settings/exerciseSearch.js";


// initialize all panels
initSettingsPanelNavigation();
showCreateRoutinePanel();
showAddExercisesPanel();
renderExercises();
showCreateExercisePanel();
showExercisePreviewPanel();


// initialize search after exercises are rendered
initExerciseSearch();