import { getLoadedRoutineId, getSavedRoutines } from '../storage.js';

export function renderRoutineExercises() {
  const titleElem = document.querySelector('.js-routine-title');
  const exercisesElem = document.querySelector('.js-routine-exercises');

  if (!titleElem || !exercisesElem) return;

  const loadedId = getLoadedRoutineId();
  const routines = getSavedRoutines();
  const routine = routines.find(r => r.id === loadedId);

  if (!routine || routine.exercises.length === 0) {
    exercisesElem.innerHTML = `
      <div class="routine__empty-message">
        No exercises to display. Load a routine from Settings.
      </div>
    `;
    return;
  }

  titleElem.textContent = routine.title;

  let exercisesHTML = '';
  routine.exercises.forEach((exercise) => {
    exercisesHTML += `
      <div class="exercises-card">
        <div class="exercises-card__info">
          <img class="exercises-card__image" src="${exercise.image || 'assets/images/icons/hevy.png'}" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
      </div>
    `;
  });

  exercisesElem.innerHTML = exercisesHTML;
}