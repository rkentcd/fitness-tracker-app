import { exercises } from '../data/exercises.js';
import { renderExercises, initExerciseSelection } from './panelAddExercises.js';

export function initExerciseSearch() {
  const searchInputElem = document.querySelector('.js-panel__search-exercises');
  const exercisesContainerElem = document.querySelector('.js-exercises');

  searchInputElem.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();

    if (query === '') {
      renderExercises(exercises);
      initExerciseSelection();
      return;
    }

    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query)
    );

    if (filteredExercises.length === 0) {
      exercisesContainerElem.innerHTML = `
        <div class="exercises__no-results">
          <h3>Can't find <strong>${query}</strong></h3>
          <span>We don't have that exercise in our database yet.</span>
        </div>
      `;
    } else {
      exercisesContainerElem.innerHTML = '';
      renderExercises(filteredExercises);
      initExerciseSelection();
    }
  });
}