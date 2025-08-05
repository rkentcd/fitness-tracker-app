import { exercises } from "../data/exercises.js";

export function renderExercises() {
  let exercisesHTML = '';

  exercises.forEach((exercise) => {
    
    exercisesHTML+= `
      <div class="exercises-card js-exercises-card exercises-card--panel" exercise-id="${exercise.id}">
        <div class="exercises-card__info">
          <img class="exercises-card__image" src="${exercise.image}" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
      </div>
    `
  });

  const exerciseElemPanel = document.querySelector('.js-exercises');
  exerciseElemPanel.innerHTML = exercisesHTML;
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

