import { exercises } from "../data/exercises.js";
import { showExercisePreviewPanel } from "./exercisePreviewPanel.js";

export function renderExercises() {
  let exercisesHTML = '';

  exercises.forEach((exercise) => {
    
    exercisesHTML+= `
      <div class="exercises-card js-exercises-card exercises-card--panel" exercise-id="${exercise.id}">
        <div class="exercises-card__info">
          <img class="exercises-card__image" src="${exercise.image}" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
        <button class="exercise-preview-btn js-exercise-preview-btn">
          <svg class="exercise-preview-btn-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon points="221.258,239.94 318.582,336.766 458.482,197.578 490.42,229.354 512,100.514 382.504,121.99 414.44,153.76 318.582,249.131 221.258,152.305 72.06,300.732 116.102,344.553"/>
            </g>
          </svg>
        </button>
      </div>
    `
  });

  const exerciseElemPanel = document.querySelector('.js-exercises');
  exerciseElemPanel.innerHTML = exercisesHTML;

  showExercisePreviewPanel(); //func for previewing exercises

  addEventListeners();
}

export function showAddExercisesPanel() {
  const addExercisesBtnElem = document.querySelector('.js-panel__add-exercises-button');
  const cancelBtnElem = document.querySelector('.js-add-exercises-panel__cancel-button');

  addExercisesBtnElem.addEventListener('click', () => {
    const targetPanelElem = document.querySelector('.js-add-exercises-panel--add');
    targetPanelElem.classList.add('panel--active-from-top');
  });

  cancelBtnElem.addEventListener('click', () => {
    const parentPanelElem = cancelBtnElem.closest('.panel');
    parentPanelElem.classList.remove('panel--active-from-top');
  })
}

function addEventListeners() {

}

function initExercisePreview() {

}


