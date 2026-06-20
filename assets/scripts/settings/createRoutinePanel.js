import { currentRoutineExercises } from './addExercisesPanel.js';
import { initExerciseOptionsSheet } from './exerciseOptionsSheet.js';


export function showCreateRoutinePanel () {
  const createRoutinePanelElem = document.querySelector('.js-panel__add-routine');
  const cancelBtnElem = document.querySelector('.js-routine-panel__cancel-button');

  createRoutinePanelElem.addEventListener('click', () => {
    const targetPanelElem = document.querySelector('.js-routine-panel--create');
    targetPanelElem.classList.add('panel--active-from-top');
  });
  cancelBtnElem.addEventListener('click', () => {
    const parentPanelElem = cancelBtnElem.closest('.panel');
    parentPanelElem.classList.remove('panel--active-from-top');
  })
}

export function renderSelectedRoutineExercises() {
  const selectedExercisesElem = document.querySelector('.js-panel__added-exercises');

  if (currentRoutineExercises.length === 0) {
    selectedExercisesElem.innerHTML = `
      <div class="panel__add-exercises-text">Get started by adding an exercise to your routine.</div>
      <button class="panel__add-exercises-button js-panel__add-exercises-button">+ Add exercise</button>
    `;
  } else {
    let addedExercisesHTML = '';
    
    currentRoutineExercises.forEach(exercise => {
      addedExercisesHTML += `
        <div class="routine-exercise__item" data-exercise-id="${exercise.id}">
          <img src="${exercise.image ? exercise.image : 'assets/images/icons/hevy.png'}" alt="icon" class="exercises-card__image">
          <div class="routine-exercise__info">
            <div class="routine-exercise__details">
              <span class="routine-exercise__name">${exercise.name}</span>
              <button class="routine-exercise__options-btn js-exercise-options-btn" data-exercise-id="${exercise.id}" data-exercise-name="${exercise.name}">⋮</button>
            </div>
            <div class="routine-exercise__inputs">
              <label>kg</label><input type="number" placeholder="60">
              <label>reps</label><input type="number" placeholder="8">
              <label>sets</label><input type="number" placeholder="3">
            </div>
          </div>
        </div>
      `;
    });

    addedExercisesHTML += `
      <button class="panel__add-exercises-button js-panel__add-exercises-button">+ Add exercise</button>
    `;

    selectedExercisesElem.innerHTML = addedExercisesHTML;
  }

  attachOptionsButtonListeners();
}

function attachOptionsButtonListeners() {
  const optionsBtns = document.querySelectorAll('.js-exercise-options-btn');

  optionsBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const exerciseId = btn.dataset.exerciseId;
      const exerciseName = btn.dataset.exerciseName;
      const exerciseItem = btn.closest('.routine-exercise__item');

      const sheet = initExerciseOptionsSheet();
      sheet.openSheet(exerciseId, exerciseName, exerciseItem);
    });
  });
}
