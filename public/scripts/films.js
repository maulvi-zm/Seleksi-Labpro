function fetchFilms() {
  const url = window.location.href;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newFilmsContainer = doc.querySelector('#films-container').innerHTML;

      document.getElementById('films-container').innerHTML = newFilmsContainer;
    })
    .catch((error) => console.error('Error fetching films:', error));
}

setInterval(fetchFilms, 60000);
