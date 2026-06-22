import { exercises } from '../data/exercises.js';

export function showPanelExercisePreview() {
  const previewBtnElems = document.querySelectorAll('.js-exercise-preview-btn');
  const targetPanelElem = document.querySelector('.js-exercise-preview');

  targetPanelElem.addEventListener('click', (e) => {
    if (e.target.closest('.js-exercise-preview__cancel')) {
      targetPanelElem.classList.remove('panel--preview-active');
    }
  });

  previewBtnElems.forEach((btnElem) => {
    btnElem.addEventListener('click', () => {
      const exerciseId = btnElem.dataset.exerciseId;
      const exercise = exercises.find((ex) => ex.id === exerciseId);

      if (!exercise) return;

      targetPanelElem.classList.add('panel--preview-active');

      const instructionsHTML = exercise.instructions
        ? exercise.instructions.map((step) => `<li>${step}</li>`).join('')
        : '<li>No instructions available</li>';

      const formCuesHTML = exercise.formCues
        ? exercise.formCues.map((cue) => `<li>${cue}</li>`).join('')
        : '<li>No form cues available</li>';

      const videoHTML = exercise.videoUrl
        ? `<iframe width="100%" height="315"
            src="${exercise.videoUrl}"
            title="${exercise.name}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>`
        : '<p>No video available</p>';

      targetPanelElem.innerHTML = `
        <div class="panel__header--exercise-preview">
          <button class="js-exercise-preview__cancel panel__back">
            <svg class="panel__icon-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <polyline class="panel__icon-arrow-line" points="244 400 100 256 244 112" />
              <line class="panel__icon-arrow-line" x1="120" y1="256" x2="412" y2="256" />
            </svg>
          </button>
          <div class="panel__exercise-name">${exercise.name}</div>
        </div>
        <div class="panel__exercise-howto">
          <h3>How to</h3>
          <ul>${instructionsHTML}</ul>
        </div>
        <div class="panel__exercise-formcues">
          <h3>Form cues</h3>
          <ul>${formCuesHTML}</ul>
        </div>
        <div class="panel__exercise-video">${videoHTML}</div>
      `;
    });
  });
}