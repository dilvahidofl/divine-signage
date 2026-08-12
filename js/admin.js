// TRIAL USER MANAGEMENT
// Uses browser localStorage for this trial.
// Later this will be replaced with Firebase Firestore.

if (sessionStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

const defaultUsers = [
  { name: "Administrator", username: "admin", password: "admin" }
];

let users = JSON.parse(localStorage.getItem("divineUsers"));

if (!Array.isArray(users) || users.length === 0) {
  users = defaultUsers;
  saveUsers();
}

const tableBody = document.getElementById("userTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const modal = document.getElementById("userModal");
const modalTitle = document.getElementById("modalTitle");
const userForm = document.getElementById("userForm");
const formMessage = document.getElementById("formMessage");

function saveUsers() {
  localStorage.setItem("divineUsers", JSON.stringify(users));
}

function renderUsers() {
  tableBody.innerHTML = "";

  if (users.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.username)}</td>
      <td>${escapeHtml(user.password)}</td>
      <td>
        <button class="action-button edit-button" onclick="editUser(${index})">Edit</button>
        <button class="action-button delete-button" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openAddUserModal() {
  modalTitle.textContent = "Add User";
  userForm.reset();
  document.getElementById("editIndex").value = "";
  formMessage.textContent = "";
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  userForm.reset();
  formMessage.textContent = "";
}

function editUser(index) {
  const user = users[index];

  modalTitle.textContent = "Edit User";
  document.getElementById("editIndex").value = index;
  document.getElementById("name").value = user.name;
  document.getElementById("newUsername").value = user.username;
  document.getElementById("newPassword").value = user.password;
  formMessage.textContent = "";

  modal.classList.remove("hidden");
}

function deleteUser(index) {
  const user = users[index];

  if (user.username === "admin") {
    alert("The default admin account cannot be deleted in this trial.");
    return;
  }

  if (confirm(`Delete user "${user.name}"?`)) {
    users.splice(index, 1);
    saveUsers();
    renderUsers();
  }
}

userForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value;
  const editIndex = document.getElementById("editIndex").value;

  if (!name || !username || !password) {
    formMessage.textContent = "Please fill in all fields.";
    return;
  }

  const duplicate = users.some((user, index) =>
    user.username.toLowerCase() === username.toLowerCase() &&
    String(index) !== editIndex
  );

  if (duplicate) {
    formMessage.textContent = "That username already exists.";
    return;
  }

  const newUser = { name, username, password };

  if (editIndex === "") {
    users.push(newUser);
  } else {
    users[Number(editIndex)] = newUser;
  }

  saveUsers();
  renderUsers();
  closeModal();
});

document.getElementById("addUserButton").addEventListener("click", openAddUserModal);
document.getElementById("closeModalButton").addEventListener("click", closeModal);
document.getElementById("cancelButton").addEventListener("click", closeModal);

document.getElementById("logoutButton").addEventListener("click", function () {
  sessionStorage.removeItem("loggedIn");
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

renderUsers();
