import { customExercises } from "../data/customExercises.js";
import { initExerciseSelection } from "../settings/addExercisesPanel.js";
import { renderExercises } from "./addExercisesPanel.js";


export function showCreateExercisePanel() {
  const openBtn = document.querySelector('.js-add-exercises-panel__create-button');
  const overlay = document.querySelector('.js-overlay');
  const sheet = document.querySelector('.js-bottom-sheet');
  const cancelBtn = document.querySelector('.js-btn-cancel');
  const saveBtn = document.querySelector('.js-btn-save');
  const input = document.querySelector('.js-exercise-name-input');

  openBtn.addEventListener('click', () => openSheet(overlay, sheet, input));
  cancelBtn.addEventListener('click', () => closeSheet(overlay, sheet, input));
  overlay.addEventListener('click', () => closeSheet(overlay, sheet, input));

  saveBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) {
      const newExercise = { id: "c" + Date.now(), name };
      customExercises.push(newExercise);
      renderCustomExercises();
      renderExercises(); 
      initExerciseSelection();
      closeSheet(overlay, sheet, input);
    } else {
      alert('Please enter a name!');
    }
  });
}

function openSheet(overlay, sheet, input) {
  overlay.classList.add('active');
  sheet.classList.add('active');
  setTimeout(() => input.focus(), 300);
}

function closeSheet(overlay, sheet, input) {
  overlay.classList.remove('active');
  sheet.classList.remove('active');
  input.value = '';
}

export function renderCustomExercises() {
  const customElemPanel = document.querySelector('.js-custom-exercises');

  if (customExercises.length > 0) {
    customElemPanel.classList.add('is-active');
    customElemPanel.innerHTML = `
      <span class="panel__content-header">Custom Exercises</span>
      <div class="exercises exercises--add-exercises-panel">
        ${generateCustomExercises()}
      </div>
    `;
  } else {
    customElemPanel.classList.remove('is-active');   
    customElemPanel.innerHTML = '';
  }

  addDeleteListeners();
}

function generateCustomExercises() {
  let customHTML = '';

  customExercises.forEach((exercise) => {
    customHTML += `
      <div class="exercises-card js-exercises-card exercises-card--panel" exercise-id="${exercise.id}">
        <div class="exercises-card__info js-exercises-card__info">
          <img class="exercises-card__image" src="assets/images/icons/hevy.png" alt="${exercise.name}">
          <span class="exercises-card__title">${exercise.name}</span>
        </div>
        <button class="exercise-preview-btn js-exercise-delete-btn" data-exercise-id="${exercise.id}">
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
  const deleteButtons = document.querySelectorAll('.js-exercise-delete-btn');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.exerciseId;
      const index = customExercises.findIndex(ex => ex.id === id);
      if (index !== -1) {
        customExercises.splice(index, 1);
        renderCustomExercises();
      }
    });
  });
}
