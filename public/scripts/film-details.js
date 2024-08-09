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

document.getElementById('playButton').addEventListener('click', () => {
  window.location.href = '/films/<%= data.id %>/watch';
});

document.getElementById('buyButton').addEventListener('click', async () => {
  try {
    const response = await fetch('/films/<%= data.id %>/buy', {
      method: 'POST',
    });
    const data = await response.json();
    if (data.status === 'success') {
      alert('Purchase successful!');
      location.reload();
    } else {
      alert('Purchase failed.');
    }
  } catch (error) {
    console.error('Error purchasing video:', error);
    alert('An error occurred.');
  }
});

document
  .getElementById('wishlistButton')
  .addEventListener('click', async () => {
    try {
      const response = await fetch('<%= data.id %>/wishlist', {
        method: 'POST',
      });

      const result = await response.json();

      const icon = document.getElementById('wishlistIcon');
      const button = document.getElementById('wishlistButton');

      if (result.data) {
        icon.name = 'check';
        button.classList.add('bg-red-700');
        button.classList.remove('bg-black');
      } else {
        icon.name = 'plus';
        button.classList.remove('bg-red-700');
        button.classList.add('bg-black');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('An error occurred.');
    }
  });
