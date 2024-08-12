document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const pageSize = 5;

  setupDialog();
  setupReviewForm();
  setPagination(currentPage, pageSize);
});

function setupDialog() {
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
}

function setupReviewForm() {
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
}

function setPagination(currentPage, pageSize) {
  document
    .getElementById('load-more-reviews')
    ?.addEventListener('click', () => {
      currentPage++;
      fetch(
        `/films/<%= data.id %>/review?page=${currentPage}&pageSize=${pageSize}`,
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 'success') {
            console.log(response.data);
            const reviewsList = document.getElementById('reviews-list');
            response.data.forEach((review) => {
              const reviewItem = document.createElement('li');
              reviewItem.classList.add(
                'bg-[#141414]',
                'border',
                'border-[#262626]',
                'rounded-xl',
                'p-6',
                'flex',
                'flex-col',
                'gap-2',
              );
              reviewItem.innerHTML = `
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <h3 class="text-white text-sm">${review.User.username}</h3>
                <sl-relative-time date="${review.created_at}" class="text-[#999999] text-sm"></sl-relative-time>
              </div>
              <sl-rating label="Rating" readonly value="${review.star}" precision style="--symbol-size: 1rem"></sl-rating>
            </div>
            <p class="text-white text-sm">${review.comment}</p>
          `;
              reviewsList.appendChild(reviewItem);
            });

            if (response.data.length < pageSize) {
              document.getElementById('load-more-reviews').style.display =
                'none';
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    });
}
