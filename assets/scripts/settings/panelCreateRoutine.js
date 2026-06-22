import { initSheetExerciseOptions } from './sheetExerciseOptions.js';
import { getCurrentRoutineExercises } from '../storage.js';

export function showPanelCreateRoutine() {
  const createRoutineBtnElem = document.querySelector('.js-panel__add-routine');
  const cancelBtnElem = document.querySelector('.js-routine-panel__cancel-button');

  createRoutineBtnElem.addEventListener('click', () => {
    const targetPanelElem = document.querySelector('.js-routine-panel--create');
    targetPanelElem.classList.add('panel--active-from-top');
  });

  cancelBtnElem.addEventListener('click', () => {
    const parentPanelElem = cancelBtnElem.closest('.panel');
    parentPanelElem.classList.remove('panel--active-from-top');
  });
}

export function renderRoutineExercises() {
  const selectedExercisesElem = document.querySelector('.js-panel__added-exercises');
  const exercises = getCurrentRoutineExercises();

  if (exercises.length === 0) {
    selectedExercisesElem.innerHTML = `
      <div class="panel__add-exercises-text">Get started by adding an exercise to your routine.</div>
      <button class="js-panel__add-exercises-button panel__add-exercises-button">+ Add exercise</button>
    `;
  } else {
    let addedExercisesHTML = '';

    exercises.forEach((exercise) => {
      addedExercisesHTML += `
        <div class="routine-exercise__item" data-exercise-id="${exercise.id}">
          <img src="${exercise.image ? exercise.image : 'assets/images/icons/hevy.png'}" alt="icon" class="exercises-card__image">
          <div class="routine-exercise__info">
            <div class="routine-exercise__details">
              <span class="routine-exercise__name">${exercise.name}</span>
              <button class="js-exercise-options-btn routine-exercise__options-btn" data-exercise-id="${exercise.id}" data-exercise-name="${exercise.name}">⋮</button>
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
      <button class="js-panel__add-exercises-button panel__add-exercises-button">+ Add exercise</button>
    `;

    selectedExercisesElem.innerHTML = addedExercisesHTML;
  }

  attachOptionsButtonListeners();
}

function attachOptionsButtonListeners() {
  const optionsBtnElems = document.querySelectorAll('.js-exercise-options-btn');

  optionsBtnElems.forEach((btnElem) => {
    btnElem.addEventListener('click', (e) => {
      e.stopPropagation();

      const exerciseId = btnElem.dataset.exerciseId;
      const exerciseName = btnElem.dataset.exerciseName;
      const exerciseItem = btnElem.closest('.routine-exercise__item');

      const sheet = initSheetExerciseOptions();
      sheet.openSheet(exerciseId, exerciseName, exerciseItem);
    });
  });
}