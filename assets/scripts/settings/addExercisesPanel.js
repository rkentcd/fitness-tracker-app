import { customExercises } from "../data/customExercises.js";
import { exercises } from "../data/exercises.js";
import { showExercisePreviewPanel } from "./exercisePreviewPanel.js";
import { renderSelectedRoutineExercises } from "./createRoutinePanel.js";
import { routines } from "../data/routines.js";

export function renderExercises(filteredExercises = exercises) {
  let exercisesHTML = '';

  filteredExercises.forEach((exercise) => {
    
    exercisesHTML+= `
      <div class="exercises-card js-exercises-card exercises-card--panel" exercise-id="${exercise.id}">
        <div class="exercises-card__info js-exercises-card__info">
          <img class="exercises-card__image" src="${exercise.image}" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
        <button class="exercise-preview-btn js-exercise-preview-btn" data-exercise-id="${exercise.id}">
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
}

export function showAddExercisesPanel() {
  document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('.js-panel__add-exercises-button');
    if (addBtn) {
      const targetPanelElem = document.querySelector('.js-add-exercises-panel--add');
      if (targetPanelElem) {
        targetPanelElem.classList.add('panel--active-from-top');
      }
    }

    const cancelBtn = event.target.closest('.js-add-exercises-panel__cancel-button');
    if (cancelBtn) {
      const parentPanelElem = cancelBtn.closest('.panel');
      if (parentPanelElem) {
        parentPanelElem.classList.remove('panel--active-from-top');
      }
    }
  });
}

let selectedExercises = [];
export let currentRoutineExercises = [];


export function initExerciseSelection() {
  const exerciseInfos = document.querySelectorAll('.js-exercises-card__info');

  exerciseInfos.forEach((info) => {
    info.addEventListener('click', () => {
      const parentCard = info.closest('.js-exercises-card');
      const exerciseId = parentCard.getAttribute('exercise-id');

      if (parentCard.classList.contains('is-selected')) {
        parentCard.classList.remove('is-selected');
        selectedExercises = selectedExercises.filter(id => id !== exerciseId);
      } else {
        parentCard.classList.add('is-selected');
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


function handleAddBtnClick() {
  const addBtnElem = document.querySelector('.js-btn-add-exercises');

  addBtnElem.addEventListener('click', () => {
   const selectedObjects = getSelectedExerciseObjects();

    currentRoutineExercises = [...currentRoutineExercises, ...selectedObjects];
    renderSelectedRoutineExercises();

    const parentPanelElem = addBtnElem.closest('.panel');
    parentPanelElem.classList.remove('panel--active-from-top');

    selectedExercises = [];
    document.querySelectorAll('.js-exercises-card.is-selected')
      .forEach(card => card.classList.remove('is-selected'));
    addBtnElem.style.display = 'none';      
  });
}

function getSelectedExerciseObjects() {
  return selectedExercises.map(id => {
    return exercises.find(ex => ex.id === id) 
        || customExercises.find(ex => ex.id === id);
  }).filter(Boolean);
}

function initExercisePreview() {

}


