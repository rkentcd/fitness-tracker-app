import { getWorkoutDates } from '../storage.js';
import { getLocalDateString } from '../utils/date.js';

const elements = {};

let state = {
  selectedDate: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  workoutDates: [],
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


export function initCalendarStrip() {
  elements.strip = document.querySelector('.js-calendar-strip');
  elements.month = document.querySelector('.js-calendar-month');
  elements.scrollLeft = document.querySelector('.js-calendar-scroll-left');
  elements.scrollRight = document.querySelector('.js-calendar-scroll-right');

  if (!elements.strip) return;

  // load workout dates
  state.workoutDates = getWorkoutDates();

  // set today as selected
  const today = new Date();
  state.selectedDate = getLocalDateString(today);

  renderCalendar();

  // setup scroll buttons
  if (elements.scrollLeft) {
    elements.scrollLeft.addEventListener('click', () => scrollCalendar(-1));
  }
  if (elements.scrollRight) {
    elements.scrollRight.addEventListener('click', () => scrollCalendar(1));
  }
}


function renderCalendar() {
  const today = new Date();
  const todayStr = getLocalDateString(today);

  //get first day of the month
  const firstDay = new Date(state.currentYear, state.currentMonth, 1);
  const lastDay = new Date(state.currentYear, state.currentMonth + 1, 0);

  // get the Monday of the week containing the first day
  const startDate = new Date(firstDay);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  // get the Sunday of the week containing the last day
  const endDate = new Date(lastDay);
  const lastDayOfWeek = endDate.getDay();
  endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek));

  // update month display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  elements.month.textContent = `${monthNames[state.currentMonth]} ${state.currentYear}`;

  // generate days
  let daysHTML = '';
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = getLocalDateString(currentDate);
    const dayNumber = currentDate.getDate();
    const weekday = WEEKDAYS[currentDate.getDay()];
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === state.selectedDate;
    const hasWorkout = state.workoutDates.includes(dateStr);
    const isCurrentMonth = currentDate.getMonth() === state.currentMonth;

    daysHTML += `
      <button class="calendar-day js-calendar-day 
        ${isSelected ? 'is-selected' : ''} 
        ${isToday ? 'is-today' : ''}
        ${!isCurrentMonth ? 'is-other-month' : ''}"
        data-date="${dateStr}"
        aria-label="${weekday} ${dayNumber}"
      >
        <span class="calendar-day__weekday">${weekday}</span>
        <span class="calendar-day__number">${dayNumber}</span>
        <span class="calendar-day__dot ${hasWorkout ? 'has-workout' : ''}"></span>
      </button>
    `;

    currentDate.setDate(currentDate.getDate() + 1);
  }

  elements.strip.innerHTML = daysHTML;

  // add listeners to days
  document.querySelectorAll('.js-calendar-day').forEach(day => {
    day.addEventListener('click', () => {
      const date = day.dataset.date;
      selectDate(date);
    });
  });

  scrollToSelected();
}


function selectDate(dateStr) {
  state.selectedDate = dateStr;

  // Update UI
  document.querySelectorAll('.js-calendar-day').forEach(day => {
    day.classList.toggle('is-selected', day.dataset.date === dateStr);
  });

  // Dispatch event for other components
  const event = new CustomEvent('dateSelected', { detail: { date: dateStr } });
  document.dispatchEvent(event);

  scrollToSelected();
}


function scrollCalendar(direction) {
  const scrollAmount = 200 * direction;
  elements.strip.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}


function scrollToSelected() {
  const selectedDay = document.querySelector('.js-calendar-day.is-selected');
  if (selectedDay) {
    const stripRect = elements.strip.getBoundingClientRect();
    const dayRect = selectedDay.getBoundingClientRect();
    const scrollOffset = dayRect.left - stripRect.left - (stripRect.width / 2) + (dayRect.width / 2);
    elements.strip.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  }
}


export function prevMonth() {
  if (state.currentMonth === 0) {
    state.currentMonth = 11;
    state.currentYear--;
  } else {
    state.currentMonth--;
  }
  renderCalendar();
}


export function nextMonth() {
  if (state.currentMonth === 11) {
    state.currentMonth = 0;
    state.currentYear++;
  } else {
    state.currentMonth++;
  }
  renderCalendar();
}
