const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');
const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color');
const colors = [primaryColor, secondaryColor];
let primaryMode = new Map(window.location.search.slice(1).split('&').map(param => param.split('=')))
let currentMode = null;
function switchMode() {
  if (currentMode !== "light"){
    root.style.setProperty('--primary-color', colors[0]);
    root.style.setProperty('--secondary-color', colors[1]);
  } else {
    root.style.setProperty('--primary-color', colors[1]);
    root.style.setProperty('--secondary-color', colors[0]);
  }
}

function setMode(aPrimaryColor) {
  let primaryModeString;

  if (primaryMode){
    primaryModeString = primaryMode.get("mode");
    primaryMode = null;
    if (primaryModeString === 'light'){
      currentMode = 'light';
      newMode = 'Dark Mode';
    } else if (primaryModeString === 'dark') {
      currentMode = 'dark';
      newMode = 'Light Mode';
    } else {
      currentMode = 'dark';
      newMode = 'Light Mode';
    }
  } else {

  }
  if (currentMode === 'light'){
    newMode = 'Dark Mode';
  } else if (currentMode === 'dark') {
    newMode = 'Light Mode';
  } else {
    currentMode = 'dark';
    newMode = 'Light Mode';  
  }
  return newMode;
}

if (document.getElementById('nav-right')) {
  const navRight = document.getElementById('nav-right');
  const darkMode = document.createElement('a');
  darkMode.classList.add('top-nav-item');
  darkMode.href = '#';
  darkMode.innerHTML = setMode(primaryColor,primaryMode);  
  navRight.appendChild(darkMode);
  darkMode.addEventListener('click', function (e) {
    e.preventDefault();
    darkMode.innerHTML = darkMode.innerHTML === 'Light Mode' ? 'Dark Mode' : 'Light Mode';
    currentMode = currentMode === 'light' ? 'dark' : 'light';    
    switchMode();
  });
};

if (document.getElementById('mobile-nav-right')) {
  const mobileNavRight = document.getElementById('mobile-nav-right');
  const darkMode = document.createElement('a');
  darkMode.classList.add('nav-item');
  darkMode.href = '#';
  darkMode.innerHTML = setMode(primaryColor,primaryMode);  
  mobileNavRight.appendChild(darkMode);
  darkMode.addEventListener('click', function (e) {
    e.preventDefault();
    darkMode.innerHTML = darkMode.innerHTML === 'Light Mode' ? 'Dark Mode' : 'Light Mode';
    currentMode = currentMode === 'light' ? 'dark' : 'light';    
    switchMode();
  });
}

switchMode();