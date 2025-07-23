const settingsItemElem = document.querySelectorAll('.js-settings__item');
settingsItemElem.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    const targetPanelElem = document.querySelector(`.js-settings-panel--${target}`);
    targetPanelElem.classList.add('settings-panel--active');
  });
});

const settingsBackBtnElem = document.querySelectorAll('.js-settings-panel__back');
settingsBackBtnElem.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.settings-panel').classList.remove('settings-panel--active');
  });
});