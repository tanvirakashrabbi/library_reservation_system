// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

// Reservation form validation
const form = document.getElementById("reservationForm");

if (form) {
  const dateInput = document.getElementById("date");

  // Prevent selecting a past date
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  // Read selected book from Page 1
  const params = new URLSearchParams(window.location.search);
  const bookFromHome = params.get("book");
  if (bookFromHome) {
    document.getElementById("book").value = bookFromHome;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const book = document.getElementById("book").value;
    const date = document.getElementById("date").value;
    const password = document.getElementById("password").value;
    const membership = document.querySelector('input[name="membership"]:checked');
    const terms = document.getElementById("terms").checked;

    let valid = true;

    if (name === "") {
      showError("nameError", "Full name is required.");
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      showError("emailError", "Email is required.");
      valid = false;
    } else if (!emailPattern.test(email)) {
      showError("emailError", "Enter a valid email address.");
      valid = false;
    }

    // Bangladesh mobile number: 01 followed by 9 digits
    const phonePattern = /^01[3-9]\d{8}$/;
    if (phone === "") {
      showError("phoneError", "Phone number is required.");
      valid = false;
    } else if (!phonePattern.test(phone)) {
      showError("phoneError", "Use a valid 11-digit number, e.g. 01712345678.");
      valid = false;
    }

    if (book === "") {
      showError("bookError", "Please select a book.");
      valid = false;
    }

    if (date === "") {
      showError("dateError", "Reservation date is required.");
      valid = false;
    }

    if (password === "") {
      showError("passwordError", "Password is required.");
      valid = false;
    } else if (password.length < 6) {
      showError("passwordError", "Password must be at least 6 characters.");
      valid = false;
    }

    if (!membership) {
      showError("membershipError", "Please select a membership type.");
      valid = false;
    }

    if (!terms) {
      showError("termsError", "You must agree to the reservation rules.");
      valid = false;
    }

    if (!valid) return;

    // Cross-field rule: reservation date cannot be in the past
    if (date < today) {
      showError("dateError", "Reservation date cannot be in the past.");
      return;
    }

    const successBox = document.getElementById("successBox");
    successBox.hidden = false;
    successBox.innerHTML = `
      <h3>Reservation Submitted Successfully!</h3>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Book:</strong> ${escapeHtml(book)}</p>
      <p><strong>Date:</strong> ${escapeHtml(date)}</p>
      <p><strong>Membership:</strong> ${escapeHtml(membership.value)}</p>
    `;

    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  form.addEventListener("reset", function () {
    setTimeout(() => {
      clearErrors();
      document.getElementById("successBox").hidden = true;
    }, 0);
  });
}

function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((element) => {
    element.textContent = "";
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
