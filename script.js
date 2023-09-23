window.onscroll = function () {
  myFunction();
};

var navlist = document.getElementById("navbar");
var sticky = navlist.offsetTop;

/* Function to stick the nav bar */
function myFunction() {
  if (window.scrollY >= sticky) {
    navlist.classList.add("sticky");
  } else {
    navlist.classList.remove("sticky");
  }
}

// Toggle Menu - Show or Hide
var navLinks = document.getElementById("navLinks");

// Open the sidenav
function showMenu() {
  document.getElementById("navLinks").style.width = "100%";
}

// Close/hide the sidenav
function hideMenu() {
  document.getElementById("navLinks").style.width = "0";
}
