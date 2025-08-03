export function showCreateExercisePanel () {
  const openBtn = document.querySelector('.js-add-exercises-panel__create-button');
  const overlay = document.querySelector('.js-overlay');
  const sheet = document.querySelector('.js-bottom-sheet');
  const cancelBtn = document.querySelector('.js-btn-cancel');
  const saveBtn = document.querySelector('.js-btn-save');
  const input = document.querySelector('.js-exercise-name-input');

  openBtn.addEventListener('click', () => openSheet(overlay, sheet, input));
  cancelBtn.addEventListener('click', () => closeSheet(overlay, sheet, input));
  overlay.addEventListener('click', () => closeSheet(overlay, sheet, input));
  saveBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) {
      console.log('Saved:', name); // Replace with your logic
      closeSheet();
    } else {
      alert('Please enter a name!');
    }
  });
}

function openSheet(overlay, sheet, input) {
  overlay.classList.add('active');
  sheet.classList.add('active');
  setTimeout(() => input.focus(), 300);
}

function closeSheet(overlay, sheet, input) {
  overlay.classList.remove('active');
  sheet.classList.remove('active');
  input.value = '';
}
