// TRIAL LOGIN
// For this first trial, admin/admin is used.
// This will be replaced with Firebase Authentication later.

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("loggedInUser", "admin");
    window.location.href = "admin.html";
  } else {
    loginMessage.textContent = "Invalid username or password.";
  }
});
