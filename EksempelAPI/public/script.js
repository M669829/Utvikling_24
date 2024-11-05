document.addEventListener('DOMContentLoaded', () => {
    const filmList = document.getElementById('film-list');
    const titleInput = document.getElementById('title');
    const directorInput = document.getElementById('director');
    const addFilmButton = document.getElementById('add-film');

    // Hent alle filmer og vis dem
    const fetchMovies = async () => {
        const res = await fetch('/api/movies');
        const movies = await res.json();

        filmList.innerHTML = '';
        movies.forEach(movie => {
            const filmDiv = document.createElement('div');
            filmDiv.innerHTML = `
                <h3>${movie.title} (${movie.director})</h3>
                <button onclick="deleteMovie(${movie.id})">Slett</button>
                <hr>
            `;
            filmList.appendChild(filmDiv);
        });
    };

    // Legg til en ny film
    addFilmButton.addEventListener('click', async () => {
        const title = titleInput.value;
        const director = directorInput.value;

        if (title && director) {
            await fetch('/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, director })
            });
            titleInput.value = '';
            directorInput.value = '';
            fetchMovies(); // Oppdater filmoversikten
        }
    });

    // Slett en film
    window.deleteMovie = async (id) => {
        await fetch(`/api/movies/${id}`, { method: 'DELETE' });
        fetchMovies(); // Oppdater filmoversikten
    };

    // Hent filmene ved lasting av siden
    fetchMovies();
});
