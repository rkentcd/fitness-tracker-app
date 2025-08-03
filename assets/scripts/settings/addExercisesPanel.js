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