import { getCurrentRoutineExercises, saveCurrentRoutineExercises } from '../storage.js';

export function initSheetExerciseOptions() {
  const overlayElem = document.querySelector('.js-exercise-options-overlay');
  const sheetElem = document.querySelector('.js-exercise-options-sheet');
  const dragHandleElem = sheetElem.querySelector('.js-sheet__drag-handle');
  const exerciseNameElem = sheetElem.querySelector('.js-sheet-exercise-name');
  const removeBtnElem = sheetElem.querySelector('.js-sheet-remove-btn');
  const replaceBtnElem = sheetElem.querySelector('.js-sheet-replace-btn');

  let currentExerciseId = null;
  let currentExerciseName = null;
  let currentExerciseElement = null;
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let sheetHeight = 0;

  let removeListener = null;
  let replaceListener = null;

  // drag handling
  function handleDragStart(e) {
    const touch = e.touches ? e.touches[0] : e;
    startY = touch.clientY;
    currentY = startY;
    isDragging = true;
    sheetElem.style.transition = 'none';
    dragHandleElem.style.cursor = 'grabbing';
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    currentY = touch.clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      sheetElem.style.transform = `translateY(${deltaY}px)`;
    }
  }

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    sheetElem.style.transition = 'transform 0.3s ease-out';
    dragHandleElem.style.cursor = 'grab';

    const deltaY = currentY - startY;
    const threshold = sheetHeight * 0.25;

    if (deltaY > threshold) {
      sheetElem.style.transform = 'translateY(100%)';
      setTimeout(() => {
        sheetElem.style.transform = '';
        closeSheet();
      }, 300);
    } else {
      sheetElem.style.transform = '';
    }
  }

  function attachDragEvents() {
    dragHandleElem.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    dragHandleElem.addEventListener('touchstart', handleDragStart, { passive: true });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd, { passive: true });
  }

  function removeDragEvents() {
    dragHandleElem.removeEventListener('mousedown', handleDragStart);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    dragHandleElem.removeEventListener('touchstart', handleDragStart);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  }

  // close sheet
  function closeSheet() {
    sheetElem.classList.remove('active');
    overlayElem.classList.remove('active');
    document.body.style.overflow = '';
    currentExerciseId = null;
    currentExerciseElement = null;

    cleanupListeners();
    removeDragEvents();
  }

  function cleanupListeners() {
    if (removeListener) {
      removeBtnElem.removeEventListener('click', removeListener);
      removeListener = null;
    }
    if (replaceListener) {
      replaceBtnElem.removeEventListener('click', replaceListener);
      replaceListener = null;
    }
  }

  // remove exercise
  function handleRemoveClick() {
    if (currentExerciseId) {
      let exercises = getCurrentRoutineExercises();

      const index = exercises.findIndex((ex) => ex.id === currentExerciseId);

      if (index !== -1) {
        exercises.splice(index, 1);

        saveCurrentRoutineExercises(exercises);

        import('./panelCreateRoutine.js').then(({ renderRoutineExercises }) => {
          renderRoutineExercises();
        });

        closeSheet();
      }
    }
  }

  // replace exercise
  function handleReplaceClick() {
    if (currentExerciseId && currentExerciseElement) {
      window.__exerciseToReplace = currentExerciseId;
      window.__exerciseElementToReplace = currentExerciseElement;

      closeSheet();

      setTimeout(() => {
        let addBtnElem = document.querySelector('.js-panel__add-exercises-button');
        if (!addBtnElem) {
          addBtnElem = document.querySelector('.panel__add-exercises-button');
        }
        if (!addBtnElem) {
          const allBtnElems = document.querySelectorAll('.panel__add-exercises-button, .js-panel__add-exercises-button');
          if (allBtnElems.length > 0) {
            addBtnElem = allBtnElems[0];
          }
        }

        if (addBtnElem) {
          addBtnElem.click();
        }
      }, 300);
    }
  }

  function attachListeners() {
    cleanupListeners();

    removeListener = handleRemoveClick;
    replaceListener = handleReplaceClick;

    removeBtnElem.addEventListener('click', removeListener);
    replaceBtnElem.addEventListener('click', replaceListener);
  }

  // open sheet
  function openSheet(exerciseId, exerciseName, exerciseElement) {
    currentExerciseId = exerciseId;
    currentExerciseName = exerciseName;
    currentExerciseElement = exerciseElement;
    exerciseNameElem.textContent = exerciseName;
    sheetElem.classList.add('active');
    overlayElem.classList.add('active');
    document.body.style.overflow = 'hidden';

    sheetHeight = sheetElem.offsetHeight;

    attachListeners();
    attachDragEvents();
  }

  overlayElem.addEventListener('click', closeSheet);

  return {
    openSheet,
    closeSheet
  };
}