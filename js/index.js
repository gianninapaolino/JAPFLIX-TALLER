const URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

// Función para obtener los datos
const getJSONData = function(url) {
    return fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(Error(response.statusText)))
        .then(data => ({ status: 'ok', data: data }))
        .catch(error => ({ status: 'error', data: error }));
};

// Cargar los datos desde la URL
let peliculas = [];
getJSONData(URL)
    .then(result => {
        if (result.status === 'ok') {
            peliculas = result.data; // Asigna los datos a la variable `peliculas`
        } else {
            console.error('Error:', result.data);
        }
    });

// Funcionalidad del buscador
document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const resultados = document.getElementById('resultados');

    // Función para buscar una película
    function buscarPelicula(query) {
        return peliculas.filter(pelicula => 
            pelicula.title.toLowerCase().includes(query.toLowerCase()) ||
            pelicula.tagline.toLowerCase().includes(query.toLowerCase()) ||
            pelicula.overview.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Event listener para el botón de búsqueda
    btnBuscar.addEventListener('click', () => {
        const query = inputBuscar.value.trim();
        resultados.innerHTML = '';

        if (query) {
            const resultadosBusqueda = buscarPelicula(query);

            if (resultadosBusqueda.length > 0) {
                resultadosBusqueda.forEach(pelicula => {
                    const peliculaDiv = document.createElement('div');
                    peliculaDiv.innerHTML = `
                        <strong>${pelicula.title}</strong><br>
                        <em>${pelicula.tagline}</em><br>
                        <span>${'★'.repeat(Math.round(pelicula.vote_average))}</span> <!-- redondear el voto -->
                    `;
                    peliculaDiv.className = 'pelicula';
                    resultados.appendChild(peliculaDiv);

                    // Agregar un evento de clic a cada película
                    peliculaDiv.addEventListener('click', () => {
                        mostrarDetallesPelicula(pelicula);
                    });

                    // Agregar un separador
                    const separator = document.createElement('hr');
                    resultados.appendChild(separator);
                });
            } else {
                resultados.innerHTML = '<p>No se encontraron resultados.</p>';
            }
        }
    });

// Función para mostrar detalles de la película
function mostrarDetallesPelicula(pelicula) {
    const movieContainer = document.getElementById('movieContainer');
    const movieDetails = document.getElementById('movieDetails');
    const dropdownInfo = document.getElementById('dropdownInfo');

    // Actualizar el contenido de la información de la película
    movieDetails.innerHTML = `
        <strong>${pelicula.title}</strong><br>
        <p>${pelicula.overview}</p>
        <strong>Géneros:</strong> ${pelicula.genres.map(genre => genre.name).join(', ')}
    `;

    // Actualizar el contenido del dropdown
    dropdownInfo.innerHTML = `
        <li><a class="dropdown-item" href="#">Año de lanzamiento: ${new Date(pelicula.release_date).getFullYear()}</a></li>
        <li><a class="dropdown-item" href="#">Duración: ${pelicula.runtime} minutos</a></li>
        <li><a class="dropdown-item" href="#">Presupuesto: $${pelicula.budget}</a></li>
        <li><a class="dropdown-item" href="#">Ganancias: $${pelicula.revenue}</a></li>
    `;

    // Mostrar el contenedor de información
    movieContainer.style.display = 'block';
}
    
});

