import { renderSelectRoutine } from './panelSelectRoutine.js';

export function initSettingsNavigation() {
  const settingsItemElems = document.querySelectorAll('.js-settings__item');
  const backBtnElems = document.querySelectorAll('.js-panel__back');

  settingsItemElems.forEach((itemElem) => {
    itemElem.addEventListener('click', () => {
      const target = itemElem.dataset.target;
      const targetPanelElem = document.querySelector(`.js-panel--${target}`);
      targetPanelElem.classList.add('panel--active');

      if (target === 'routine') {
        renderSelectRoutine();
      }
    });
  });

  backBtnElems.forEach((btnElem) => {
    btnElem.addEventListener('click', () => {
      const parentPanelElem = btnElem.closest('.panel');
      parentPanelElem.classList.remove('panel--active');
    });
  });
}