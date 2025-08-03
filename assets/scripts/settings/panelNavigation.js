export function initSettingsPanelNavigation() {
  const settingsItemElems = document.querySelectorAll('.js-settings__item');
  const backBtnElems = document.querySelectorAll('.js-panel__back');

  settingsItemElems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      const targetPanelElem = document.querySelector(`.js-panel--${target}`);
      targetPanelElem.classList.add('panel--active');
    });
  });

  backBtnElems.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentPanelElem = btn.closest('.panel');
      parentPanelElem.classList.remove('panel--active');
    });
  });
}
