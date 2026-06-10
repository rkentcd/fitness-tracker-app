export function showExercisePreviewPanel() {
  const exercisePrevBtnElem = document.querySelectorAll('.js-exercise-preview-btn');
  const cancelBtnElem = document.querySelector('.js-exercise-preview__cancel');

  exercisePrevBtnElem.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPanel = document.querySelector('.js-exercise-preview');
      targetPanel.classList.add('panel--preview-active');
    });
  });

  cancelBtnElem.addEventListener('click', () => {
    const targetPanel = document.querySelector('.js-exercise-preview');
    targetPanel.classList.remove('panel--preview-active');
  });
}