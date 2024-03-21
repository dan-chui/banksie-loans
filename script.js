const navlist = document.getElementById('navbar');
const sticky = navlist.offsetTop;

/* Function to stick the nav bar */
function myFunction() {
  if (window.scrollY >= sticky) {
    navlist.classList.add('sticky');
  } else {
    navlist.classList.remove('sticky');
  }
}

window.onscroll = function () {
  myFunction();
};

// Toggle Menu - Show or Hide
const navLinks = document.getElementById('navLinks');

// Open the sidenav
function showMenu() {
  document.getElementById('navLinks').style.width = '70%';
}

// Close/hide the sidenav
function hideMenu() {
  document.getElementById('navLinks').style.width = '0';
}
