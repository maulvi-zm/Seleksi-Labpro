document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('.dialog-overview');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());

  dialog.addEventListener('sl-request-close', (event) => {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('review-form');
  const ratingComponent = document.getElementById('rating');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const ratingValue = ratingComponent.shadowRoot
      .querySelector('div[role="slider"]')
      .getAttribute('aria-valuenow');

    const formData = new FormData(form);
    formData.append('rating', ratingValue);

    fetch(form.action, {
      method: form.method,
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('Form submitted successfully');
        } else {
          console.error('Form submission failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const wishlistButton = document
    .getElementById('wishListButton')
    .addEventListener('click', () => {
      fetch('films/', {
        method: 'POST',
      })
        .then((response) => {
          if (response.ok) {
            console.log('Wishlist updated successfully');
            wishlistButton.classList.toggle('selected');
          } else {
            console.error('Wishlist update failed');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
});
