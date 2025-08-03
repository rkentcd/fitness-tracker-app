export function showCreateRoutinePanel () {
  const createRoutinePanelElem = document.querySelector('.js-panel__add-routine');
  const cancelBtnElem = document.querySelector('.js-routine-panel__cancel-button');

  createRoutinePanelElem.addEventListener('click', () => {
    const targetPanelElem = document.querySelector('.js-routine-panel--create');
    targetPanelElem.classList.add('panel--active-from-top');
  });
  cancelBtnElem.addEventListener('click', () => {
    const parentPanelElem = cancelBtnElem.closest('.panel');
    parentPanelElem.classList.remove('panel--active-from-top');
  })
}

