import { getSavedRoutines } from '../storage.js';
import { initSheetRoutineOptions } from './sheetRoutineOptions.js';


export function renderSelectRoutine() {
  const container = document.querySelector('.js-routine-list-container');

  if (!container) return;

  const routines = getSavedRoutines();

  if (routines.length === 0) {
    container.innerHTML = `
    <div class="panel__add-exercises-text">No saved routines yet.</div>
    <p style="color: #8e8e8e; text-align: center; margin-top: 10px;">
        Create your first routine using the + button above.
    </p>
    `;
    return;
  }
  
  let routinesHTML = '';

  routines.forEach((routine) => {
    const exerciseNames = routine.exercises.map((ex) => ex.name);

    const preview = exerciseNames.slice(0, 3).join(', ');
    const moreCount = exerciseNames.length - 3;

    const previewText = moreCount > 0
      ? `${preview} +${moreCount} more`
      : preview;

    routinesHTML += `
      <div class="panel__routine-card routine-card  data-routine-id="${routine.id}">
        <div class="routine-card__header">
          <span>${routine.title}</span>
          <button class="button button--dots js-routine-options-btn"  data-routine-id="${routine.id} aria-label="More options">
            <span class="button__dot"></span>
            <span class="button__dot"></span>
            <span class="button__dot"></span>
          </button>
        </div>
        <div class="routine-card__preview">
          ${previewText}
        </div>
      </div>
    `;
  });

  container.innerHTML = routinesHTML;

  attachRoutineOptionsListeners();
}

function attachRoutineOptionsListeners() {
  const optionsBtnElems = document.querySelectorAll('.js-routine-options-btn');

  optionsBtnElems.forEach((btnElem) => {
    btnElem.addEventListener('click', (e) => {
      e.stopPropagation();

      const routineId = btnElem.dataset.routineId;
      const routineName = btnElem.dataset.routineName;
      const routineCard = btnElem.closest('.panel__routine-card');

      const sheet = initSheetRoutineOptions();
      sheet.openSheet(routineId, routineName, routineCard);
    });
  });
}