import { initSheetExerciseOptions } from './sheetExerciseOptions.js';
import { getCurrentRoutineExercises, saveCurrentRoutineExercises } from '../storage.js';

let sortableInstance = null;

function updateSaveButton() {
  const saveBtnElem = document.querySelector('.js-routine-panel__save-button');
  const exercises = getCurrentRoutineExercises();
  
  if (exercises.length > 0) {
    saveBtnElem.style.backgroundColor = '#b5ff22';
    saveBtnElem.style.color = '#000000';
    saveBtnElem.disabled = false;
    saveBtnElem.style.cursor = 'pointer';
  } else {
    saveBtnElem.style.backgroundColor = '#8e8e8e';
    saveBtnElem.style.color = '#ffffff';
    saveBtnElem.disabled = true;
    saveBtnElem.style.cursor = 'default';
  }
}

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

  // destroy old instance if it exists
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }

  if (exercises.length === 0) {
    selectedExercisesElem.innerHTML = `
      <div class="panel__add-exercises-text">Get started by adding an exercise to your routine.</div>
      <button class="js-panel__add-exercises-button panel__add-exercises-button">+ Add exercise</button>
    `;
  } else {
    let addedExercisesHTML = '';

    exercises.forEach((exercise) => {
      addedExercisesHTML += `
        <div class="routine-exercise__item js-exercise-item" data-exercise-id="${exercise.id}">
          <div class="routine-exercise__drag-handle js-drag-handle">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8e8e8e" stroke-width="2">
              <circle cx="8" cy="6" r="1.5" fill="#8e8e8e" stroke="none"/>
              <circle cx="16" cy="6" r="1.5" fill="#8e8e8e" stroke="none"/>
              <circle cx="8" cy="12" r="1.5" fill="#8e8e8e" stroke="none"/>
              <circle cx="16" cy="12" r="1.5" fill="#8e8e8e" stroke="none"/>
              <circle cx="8" cy="18" r="1.5" fill="#8e8e8e" stroke="none"/>
              <circle cx="16" cy="18" r="1.5" fill="#8e8e8e" stroke="none"/>
            </svg>
          </div>
          <img src="${exercise.image ? exercise.image : 'assets/images/icons/hevy.png'}" alt="icon" class="exercises-card__image exercises-card__image--routine">
          <div class="routine-exercise__info">
            <div class="routine-exercise__details">
              <span class="routine-exercise__name">${exercise.name}</span>
              <button class="js-exercise-options-btn routine-exercise__options-btn" data-exercise-id="${exercise.id}" data-exercise-name="${exercise.name}">⋮</button>
            </div>
            <div class="routine-exercise__inputs">
              <input type="number" placeholder="kg">
              <input type="number" placeholder="reps">
              <input type="number" placeholder="sets">
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
  initDragAndDrop();
  updateSaveButton();
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

export function initDragAndDrop() {
  const container = document.querySelector('.js-panel__added-exercises');
  
  if (!container) return;
  
  if (typeof Sortable === 'undefined') {
    console.warn('SortableJS not loaded. Drag and drop disabled.');
    return;
  }

  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }

  // create new sortable instance
  sortableInstance = new Sortable(container, {
    handle: '.js-drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag',

    onEnd: function(evt) {
      const items = container.querySelectorAll('.js-exercise-item');
      const newOrder = [];
      
      items.forEach((item) => {
        const id = item.dataset.exerciseId;
        const exercises = getCurrentRoutineExercises();
        const exercise = exercises.find((ex) => ex.id === id);
        if (exercise) {
          newOrder.push(exercise);
        }
      });
      
      if (newOrder.length > 0) {
        saveCurrentRoutineExercises(newOrder);
      }
    }
  });
}