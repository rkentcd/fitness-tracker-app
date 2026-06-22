import { getCurrentRoutineExercises, saveCurrentRoutineExercises} from '../storage.js';

export function initExerciseOptionsSheet() {
  const overlay = document.querySelector('.js-exercise-options-overlay');
  const sheet = document.querySelector('.js-exercise-options-sheet');
  const dragHandle = sheet.querySelector('.js-sheet__drag-handle');
  const exerciseNameElem = sheet.querySelector('.js-sheet-exercise-name');
  const removeBtn = sheet.querySelector('.js-sheet-remove-btn');
  const replaceBtn = sheet.querySelector('.js-sheet-replace-btn');


  let currentExerciseId = null;
  let currentExerciseName = null;
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let sheetHeight = 0;
  let currentExerciseElement = null;

  let removeListener = null;
  let replaceListener = null;

 
  function handleDragStart(e) {
    const touch = e.touches ? e.touches[0] : e;
    startY = touch.clientY;
    currentY = startY;
    isDragging = true;
    sheet.style.transition = 'none';
    dragHandle.style.cursor = 'grabbing';
  }
  
  function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    currentY = touch.clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      sheet.style.transform = `translateY(${deltaY}px)`;
    }
  }

  function handleDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    sheet.style.transition = 'transform 0.3s ease-out';
    dragHandle.style.cursor = 'grab';

    const deltaY = currentY - startY;
    const threshold = sheetHeight * 0.25;

    if (deltaY > threshold) {
      sheet.style.transform = 'translateY(100%)';
      setTimeout(() => {
        sheet.style.transform = '';
        closeSheet();
      }, 300);
    } else {
      sheet.style.transform ='';
    }
  }

  function attachDragEvents() {
    dragHandle.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    dragHandle.addEventListener('touchstart', handleDragStart, { passive: true });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd, { passive: true });
  }

  function removeDragEvents() {
    dragHandle.removeEventListener('mousedown', handleDragStart);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    dragHandle.removeEventListener('touchstart', handleDragStart);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  }
 
  function closeSheet() {
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    currentExerciseId = null;
    currentExerciseElement = null;

    cleanupListeners();
    removeDragEvents();
  }

  function cleanupListeners() {
    if (removeListener) {
      removeBtn.removeEventListener('click', removeListener);
      removeListener = null;
    }
    if (replaceListener) {
      replaceBtn.removeEventListener('click', replaceListener);
      replaceListener = null;
    }
  }

  function handleRemoveClick() {
    if (currentExerciseId) {
      let exercises = getCurrentRoutineExercises();

      const index = exercises.findIndex(ex => ex.id === currentExerciseId);

      if (index !== -1) {
        exercises.splice(index, 1);

        saveCurrentRoutineExercises(exercises);

        import('./createRoutinePanel.js').then(({ renderSelectedRoutineExercises }) => {
          renderSelectedRoutineExercises();
        });

        closeSheet();
      }
    }
  }

  function handleReplaceClick() {
    if (currentExerciseId && currentExerciseElement) {
      window.__exerciseToReplace = currentExerciseId;
      window.__exerciseElementToReplace = currentExerciseElement;
      
      closeSheet();

      setTimeout(() => {
        let addBtn = document.querySelector('.js-panel__add-exercises-button');
        if (!addBtn) {
          addBtn = document.querySelector('.panel__add-exercises-button');
        }
        if (!addBtn) {
          const allButtons = document.querySelectorAll('.panel__add-exercises-button, .js-panel__add-exercises-button');
          if (allButtons.length > 0) {
            addBtn = allButtons[0];
          }
        }

        if (addBtn) {
          addBtn.click();
        }
      }, 300);
    }
  }

  function attachListeners() {
    cleanupListeners();

    removeListener = handleRemoveClick;
    replaceListener = handleReplaceClick;

    removeBtn.addEventListener('click', removeListener);
    replaceBtn.addEventListener('click', replaceListener);
  }

  function openSheet(exerciseId, exerciseName, exerciseElement) {
    currentExerciseId = exerciseId;
    currentExerciseName = exerciseName;
    currentExerciseElement = exerciseElement;
    exerciseNameElem.textContent = exerciseName;
    sheet.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    sheetHeight = sheet.offsetHeight;

    attachListeners();
    attachDragEvents();
  }

  overlay.addEventListener('click', closeSheet);

  return {
    openSheet,
    closeSheet
  };
}