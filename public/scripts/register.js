document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registerForm');
  const registerButton = document.getElementById('registerButton');

  form.addEventListener('input', function () {
    const isValid = form.checkValidity();
    registerButton.disabled = !isValid;
    registerButton.style.cursor = isValid ? 'pointer' : 'not-allowed';

    if (isValid) {
      registerButton.classList.remove('bg-gray-600');
      registerButton.classList.add('bg-red-700');
    } else {
      registerButton.classList.remove('bg-red-700');
      registerButton.classList.add('bg-gray-600');
    }
  });

  form.addEventListener('submit', function (event) {
    const password = form.querySelector('sl-input[name="password"]').value;
    const passwordConfirmation = form.querySelector(
      'sl-input[name="password_confirmation"]',
    ).value;

    if (password !== passwordConfirmation) {
      alert('Passwords do not match.');
      event.preventDefault();
    }
  });
});
