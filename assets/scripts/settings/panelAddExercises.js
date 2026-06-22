import { exercises } from '../data/exercises.js';
import { showPanelExercisePreview } from './panelExercisePreview.js';
import { renderRoutineExercises } from './panelCreateRoutine.js';
import { getCustomExercises, getCurrentRoutineExercises, saveCurrentRoutineExercises } from '../storage.js';

export function renderExercises(filteredExercises = exercises) {
  let exercisesHTML = '';

  filteredExercises.forEach((exercise) => {
    exercisesHTML += `
      <div class="js-exercises-card exercises-card exercises-card--panel" exercise-id="${exercise.id}">
        <div class="js-exercises-card__info">
          <img class="exercises-card__image" src="${exercise.image}" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
        <button class="js-exercise-preview-btn exercise-preview-btn" data-exercise-id="${exercise.id}">
          <svg class="exercise-preview-btn-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon points="221.258,239.94 318.582,336.766 458.482,197.578 490.42,229.354 512,100.514 382.504,121.99 414.44,153.76 318.582,249.131 221.258,152.305 72.06,300.732 116.102,344.553"/>
            </g>
          </svg>
        </button>
      </div>
    `;
  });

  const exercisesContainerElem = document.querySelector('.js-exercises');
  exercisesContainerElem.innerHTML = exercisesHTML;

  showPanelExercisePreview();
}

export function showPanelAddExercises() {
  document.addEventListener('click', (event) => {
    const addBtnElem = event.target.closest('.js-panel__add-exercises-button');
    if (addBtnElem) {
      const targetPanelElem = document.querySelector('.js-add-exercises-panel--add');
      if (targetPanelElem) {
        targetPanelElem.classList.add('panel--active-from-top');
      }
    }

    const cancelBtnElem = event.target.closest('.js-add-exercises-panel__cancel-button');
    if (cancelBtnElem) {
      const parentPanelElem = cancelBtnElem.closest('.panel');
      if (parentPanelElem) {
        parentPanelElem.classList.remove('panel--active-from-top');
      }

      window.__exerciseToReplace = null;
      window.__exerciseElementToReplace = null;
    }
  });
}

let selectedExercises = [];

export function initExerciseSelection() {
  const exerciseInfoElems = document.querySelectorAll('.js-exercises-card__info');

  exerciseInfoElems.forEach((infoElem) => {
    infoElem.addEventListener('click', () => {
      const parentCardElem = infoElem.closest('.js-exercises-card');
      const exerciseId = parentCardElem.getAttribute('exercise-id');

      if (parentCardElem.classList.contains('is-selected')) {
        parentCardElem.classList.remove('is-selected');
        selectedExercises = selectedExercises.filter((id) => id !== exerciseId);
      } else {
        parentCardElem.classList.add('is-selected');
        selectedExercises.push(exerciseId);
      }

      updateAddBtn();
    });
  });

  handleAddBtnClick();
}

function updateAddBtn() {
  const addBtnElem = document.querySelector('.js-btn-add-exercises');

  if (selectedExercises.length > 0) {
    addBtnElem.style.display = 'block';
    addBtnElem.textContent = `Add ${selectedExercises.length} exercise${selectedExercises.length > 1 ? 's' : ''}`;
  } else {
    addBtnElem.style.display = 'none';
  }
}

function getSelectedExerciseObjects() {
  const baseExercises = exercises;
  const userCustomExercises = getCustomExercises();
  const allExercises = [...baseExercises, ...userCustomExercises];

  return selectedExercises
    .map((id) => {
      return allExercises.find((ex) => ex.id === id);
    })
    .filter(Boolean);
}

function handleAddBtnClick() {
  const addBtnElem = document.querySelector('.js-btn-add-exercises');

  addBtnElem.addEventListener('click', () => {
    const selectedObjects = getSelectedExerciseObjects();

    let currentExercises = getCurrentRoutineExercises();

    if (window.__exerciseToReplace) {
      let index = -1;

      if (window.__exerciseElementToReplace) {
        const allExerciseItems = document.querySelectorAll('.routine-exercise__item');

        allExerciseItems.forEach((item, i) => {
          if (item === window.__exerciseElementToReplace) {
            index = i;
          }
        });

        if (index !== -1 && selectedObjects.length > 0) {
          currentExercises[index] = selectedObjects[0];
        }
      }

      if (index === -1) {
        const idIndex = currentExercises.findIndex((ex) => ex.id === window.__exerciseToReplace);
        if (idIndex !== -1 && selectedObjects.length > 0) {
          currentExercises[idIndex] = selectedObjects[0];
        }
      }

      window.__exerciseToReplace = null;
      window.__exerciseElementToReplace = null;
    } else {
      currentExercises = [...currentExercises, ...selectedObjects];
    }

    saveCurrentRoutineExercises(currentExercises);

    renderRoutineExercises();

    const parentPanelElem = addBtnElem.closest('.panel');
    parentPanelElem.classList.remove('panel--active-from-top');

    selectedExercises = [];
    document.querySelectorAll('.js-exercises-card.is-selected').forEach((cardElem) => {
      cardElem.classList.remove('is-selected');
    });

    addBtnElem.style.display = 'none';
  });
}