import { exercises } from '../data/exercises.js';
import { renderExercises, initExerciseSelection } from './panelAddExercises.js';
import { addCustomExercise, deleteCustomExercise, getCustomExercises } from '../storage.js';

export function showPanelCreateCustomExercise() {
  const openBtnElem = document.querySelector('.js-add-exercises-panel__create-button');
  const overlayElem = document.querySelector('.js-overlay');
  const sheetElem = document.querySelector('.js-bottom-sheet');
  const cancelBtnElem = document.querySelector('.js-btn-cancel');
  const saveBtnElem = document.querySelector('.js-btn-save');
  const inputElem = document.querySelector('.js-exercise-name-input');

  openBtnElem.addEventListener('click', () => openSheet(overlayElem, sheetElem, inputElem));
  cancelBtnElem.addEventListener('click', () => closeSheet(overlayElem, sheetElem, inputElem));
  overlayElem.addEventListener('click', () => closeSheet(overlayElem, sheetElem, inputElem));

  saveBtnElem.addEventListener('click', () => {
    const name = inputElem.value.trim();
    if (name) {
      const newExercise = {
        id: 'c' + Date.now(),
        name: name,
        image: 'assets/images/icons/hevy.png'
      };

      addCustomExercise(newExercise);

      renderCustomExercises();
      renderExercises();
      initExerciseSelection();
      closeSheet(overlayElem, sheetElem, inputElem);
    } else {
      alert('Please enter a name!');
    }
  });
}

function openSheet(overlayElem, sheetElem, inputElem) {
  overlayElem.classList.add('active');
  sheetElem.classList.add('active');
  setTimeout(() => inputElem.focus(), 300);
}

function closeSheet(overlayElem, sheetElem, inputElem) {
  overlayElem.classList.remove('active');
  sheetElem.classList.remove('active');
  inputElem.value = '';
}

export function renderCustomExercises() {
  const customExercises = getCustomExercises();
  const customElemPanel = document.querySelector('.js-custom-exercises');

  if (customExercises.length > 0) {
    customElemPanel.classList.add('is-active');
    customElemPanel.innerHTML = `
      <span class="panel__content-header">Custom Exercises</span>
      <div class="exercises exercises--add-exercises-panel">
        ${generateCustomExercises(customExercises)}
      </div>
    `;
  } else {
    customElemPanel.classList.remove('is-active');
    customElemPanel.innerHTML = '';
  }

  addDeleteListeners();
}

function generateCustomExercises(customExercises) {
  let customHTML = '';

  customExercises.forEach((exercise) => {
    customHTML += `
      <div class="js-exercises-card exercises-card exercises-card--panel" exercise-id="${exercise.id}">
        <div class="exercises-card__info js-exercises-card__info">
          <img class="exercises-card__image" src="${exercise.image || 'assets/images/icons/hevy.png'}" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
        <button class="js-exercise-delete-btn exercise-preview-btn" data-exercise-id="${exercise.id}">
          <svg class="exercise-preview-btn-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon points="221.258,239.94 318.582,336.766 458.482,197.578 490.42,229.354 512,100.514 382.504,121.99 414.44,153.76 318.582,249.131 221.258,152.305 72.06,300.732 116.102,344.553"/>
            </g>
          </svg>
        </button>
      </div>
    `;
  });

  return customHTML;
}

function addDeleteListeners() {
  const deleteBtnElems = document.querySelectorAll('.js-exercise-delete-btn');

  deleteBtnElems.forEach((btnElem) => {
    btnElem.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.exerciseId;
      deleteCustomExercise(id);
      renderCustomExercises();
      renderExercises();
      initExerciseSelection();
    });
  });
}