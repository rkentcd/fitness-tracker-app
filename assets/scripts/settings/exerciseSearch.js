import { exercises } from "../data/exercises.js";
import { renderExercises } from "./addExercisesPanel.js";

export function initExerciseSearch() {
  const searchInput = document.querySelector('.js-panel__search-exercises');
  const exerciseElemPanel = document.querySelector('.js-exercises');

  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();

    // If the search bar is empty, show all exercises
    if (query === '') {
      renderExercises(exercises);
      return;
    }

    const filteredExercises = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(query)
    );

    if (filteredExercises.length === 0) {
      exerciseElemPanel.innerHTML = `
      <div class="exercises__no-results"> 
        <h3>Can't find <strong>${query}</strong></h3>
        <span>We don't have that exercise in our database yet.</span>
      </div>
      `;
    } else {
      exerciseElemPanel.innerHTML = '';
      console.log(filteredExercises);
      renderExercises(filteredExercises);
    }
  });
}
