const THEME_KEY = 'fitness_theme_preference';

/**
 * Get the current theme preference
 * @returns {string} 'dark' or 'light'
 */
export function getThemePreference() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch (error) {
    console.error('Error reading theme preference:', error);
    return 'dark';
  }
}

/**
 * Save theme preference
 * @param {string} theme - 'dark' or 'light'
 */
export function saveThemePreference(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
    return true;
  } catch (error) {
    console.error('Error saving theme preference:', error);
    return false;
  }
}

/**
 * Apply theme to the page
 * @param {string} theme - 'dark' or 'light'
 */
export function applyTheme(theme) {
  const body = document.body;
  
  // Remove both theme classes first
  body.classList.remove('light-theme', 'dark-theme');
  
  // Add the selected theme class
  if (theme === 'light') {
    body.classList.add('light-theme');
  } else {
    // Default to dark theme
    body.classList.add('dark-theme');
  }
  
  // Update checkmarks in the theme panel
  updateThemeCheckmarks(theme);
}

/**
 * Update the checkmark icons in the theme panel
 * @param {string} selectedTheme - 'dark' or 'light'
 */
function updateThemeCheckmarks(selectedTheme) {
  const themeOptions = document.querySelectorAll('.js-theme-option');
  
  themeOptions.forEach((option) => {
    const theme = option.dataset.theme;
    const checkmark = option.querySelector('.js-theme-check');
    
    if (checkmark) {
      if (theme === selectedTheme) {
        checkmark.style.display = 'inline-block';
        checkmark.style.opacity = '1';
      } else {
        checkmark.style.display = 'inline-block';
        checkmark.style.opacity = '0.2';
      }
    }
  });
}

/**
 * Initialize theme manager
 */
export function initThemeManager() {
  // Load saved theme or default to dark
  const savedTheme = getThemePreference();
  applyTheme(savedTheme);
  
  // Set up theme toggle listeners
  const themeOptions = document.querySelectorAll('.js-theme-option');
  
  themeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      saveThemePreference(theme);
      applyTheme(theme);
    });
  });
}