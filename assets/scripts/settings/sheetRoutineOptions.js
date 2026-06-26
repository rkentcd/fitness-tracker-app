import { getSavedRoutines, saveSavedRoutines, getLoadedRoutineId, saveLoadedRoutineId, clearLoadedRoutineId } from '../storage.js';
import { renderSelectRoutine } from './panelSelectRoutine.js';
import { renderRoutineExercises as renderMainRoutine } from '../index/renderRoutine.js';


export function initSheetRoutineOptions() {
  const overlayElem = document.querySelector('.js-routine-options-overlay');
  const sheetElem = document.querySelector('.js-routine-options-sheet');
  const dragHandleElem = sheetElem.querySelector('.js-routine-options-drag-handle');
  const routineNameElem = sheetElem.querySelector('.js-routine-options-name');
  const loadBtnElem = sheetElem.querySelector('.js-routine-load-btn');
  const deleteBtnElem = sheetElem.querySelector('.js-routine-delete-btn');

  let currentRoutineId = null;
  let currentRoutineElement = null;
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let sheetHeight = 0;

  let loadListener = null;
  let deleteListener = null;

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

  function closeSheet() {
    sheetElem.classList.remove('active');
    overlayElem.classList.remove('active');
    document.body.style.overflow = '';
    currentRoutineId = null;
    currentRoutineElement = null;

    cleanupListeners();
    removeDragEvents();
  }

  function cleanupListeners() {
    if (loadListener) {
      loadBtnElem.removeEventListener('click', loadListener);
      loadListener = null;
    }
    if (deleteListener) {
      deleteBtnElem.removeEventListener('click', deleteListener);
      deleteListener = null;
    }
  }

  function handleLoadClick() {
    if (currentRoutineId && currentRoutineElement) {
      // Remove highlight from all routine cards
      document.querySelectorAll('.panel__routine-card').forEach((card) => {
        card.classList.remove('routine-card--selected');
      });

      currentRoutineElement.classList.add('routine-card--selected');

      saveLoadedRoutineId(currentRoutineId);
      
      // update the main page routine display
      renderMainRoutine();

      closeSheet();
    }
  }

  function handleDeleteClick() {
    if (currentRoutineId) {
      const routines = getSavedRoutines();
      const routine = routines.find(r => r.id === currentRoutineId);

      if (routine) {
        const filtered = routines.filter(r => r.id !== currentRoutineId);
        saveSavedRoutines(filtered);

        const loadedId = getLoadedRoutineId();
        if (loadedId === currentRoutineId) {
          clearLoadedRoutineId();
          
          // re-render the main page routine
          renderMainRoutine();
        }
        
        renderSelectRoutine();
        
        closeSheet();
      }
    }
  }

  function attachListeners() {
    cleanupListeners();

    loadListener = handleLoadClick;
    deleteListener = handleDeleteClick;

    loadBtnElem.addEventListener('click', loadListener);
    deleteBtnElem.addEventListener('click', deleteListener);
  }

  function openSheet(routineId, routineName, routineElement) {
    currentRoutineId = routineId;
    currentRoutineElement = routineElement;
    routineNameElem.textContent = routineName;
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