import { getLoadedRoutineId, getSavedRoutines } from '../storage.js';
import { escapeHtml } from '../utils/escape.js';

export function renderRoutineExercises() {
  const titleElem = document.querySelector('.js-routine-title');
  const exercisesElem = document.querySelector('.js-routine-exercises');
  const startRoutineBtn = document.querySelector('.js-start-routine');

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

    startRoutineBtn.classList.add('is-hidden');
    return;
  }

  titleElem.textContent = routine.title;

  let exercisesHTML = '';
  routine.exercises.forEach((exercise) => {
    const name = escapeHtml(exercise.name);
    const image = escapeHtml(exercise.image || 'assets/images/icons/hevy.png');

    exercisesHTML += `
        <div class="exercises-card">
          <div class="exercises-card__info">
            <img class="exercises-card__image" src="${image}" alt="${name}">
            <span class="exercises-card__title">${name}</span>
          </div>
        </div>
      `;
  });


  exercisesElem.innerHTML = exercisesHTML;
}

export function initWarmupToggle() {
  const toggle = document.querySelector('.js-warmup-toggle');
  const exercises = document.querySelector('.js-warmup-exercises');
  
  if (!toggle || !exercises) return;
  
  const count = exercises.querySelectorAll('.exercises-card').length;
  let isHidden = false;
  
  toggle.addEventListener('click', () => {
    isHidden = !isHidden;
    exercises.classList.toggle('is-hidden', isHidden);
    toggle.textContent = `${isHidden ? 'Show' : 'Hide'} ${count} exercises`;
  });
}