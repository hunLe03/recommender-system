// Load PapaParse library from CDN (if you haven't included it already)
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js';
document.head.appendChild(script);

// API configuration
const moviesApiOptions = {
  method: 'POST',
  headers: {
    'x-rapidapi-key': '3fc82de1bbmsh08a8176d826f4edp1ba8cbjsn485b6890060a',
    'x-rapidapi-host': 'movies-and-tv-shows-api.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
};

const imdbOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '3fc82de1bbmsh08a8176d826f4edp1ba8cbjsn485b6890060a',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com',
  },
};

const movieInfoOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '3fc82de1bbmsh08a8176d826f4edp1ba8cbjsn485b6890060a',
    'x-rapidapi-host': 'movie-info-api.p.rapidapi.com',
  },
};

// Data to be accessed and rendered
let data_mov = [];

// Function to load and parse the CSV files
function loadCSV() {
  // Parse movies.csv
  Papa.parse('/movies.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      console.log('Movies CSV data loaded', results);

      results.data.forEach((row, index) => {
        if (index < 5 && row.movie_name) { // Limit to first 5 movies and check for valid data
          data_mov.push({
            movie_name: row.movie_name.trim(),
            image: document.querySelector(`.img${index + 1}`),
            cast: document.querySelector(`.cast${index + 1}`),
          });
        }
      });

      // Fetch data for each movie
      data_mov.forEach((movie) => {
        getData(movie);
      });
    },
  });

  // Parse ratings.csv if needed
  Papa.parse('/ratings.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      console.log('Ratings CSV data loaded', results);
    },
  });
}

// Fetch movie data from API using the movie name
async function getData(movie) {
  console.log('Fetching data for movie:', movie.movie_name);

  if (!movie.image || !movie.cast) {
    console.error('Missing UI elements for movie:', movie.movie_name);
    return;
  }

  const url = `https://movies-and-tv-shows-api.p.rapidapi.com/movies?search=${encodeURIComponent(movie.movie_name)}`;

  try {
    const response = await fetch(url, moviesApiOptions);
    const result = await response.json();
    console.log('Movies API Response:', result);

    if (result && result.Search && result.Search.length > 0) {
      const movieData = result.Search[0];

      // Set movie poster
      const posterUrl = movieData.Poster || 'https://via.placeholder.com/150';
      movie.image.setAttribute('src', posterUrl);

      // Set cast info
      movie.cast.innerHTML = `Cast: ${movieData.Actors || 'No information available'}`;

      // Fetch detailed movie info
      await getDetailedMovieInfo(movieData.imdbID, movie);

      // Fetch additional movie info
      await getMovieInfo(movie.movie_name, movie);
    } else {
      console.error('No data found for movie:', movie.movie_name);
      movie.cast.innerHTML = 'No information available';
    }
  } catch (error) {
    console.error('Error fetching movie data:', error);
    movie.cast.innerHTML = 'Error fetching data';
  }
}

// Fetch detailed movie information using IMDb ID
async function getDetailedMovieInfo(imdbID, movie) {
  const url = `https://imdb236.p.rapidapi.com/imdb/tt${imdbID}`;

  try {
    const response = await fetch(url, imdbOptions);
    const result = await response.json();
    console.log('IMDb API Response:', result);

    if (result && result.title) {
      movie.cast.innerHTML += `<br>Title: ${result.title}`;
    }
  } catch (error) {
    console.error('Error fetching detailed movie info:', error);
  }
}

// Fetch additional movie information using movie-info-api
async function getMovieInfo(movieTitle, movie) {
  const url = `https://movie-info-api.p.rapidapi.com/movie-info?title=${encodeURIComponent(movieTitle)}&lang=en-US&max_results=10`;

  try {
    const response = await fetch(url, movieInfoOptions);
    const result = await response.json();
    console.log('Movie Info API Response:', result);

    if (result && result.length > 0) {
      const additionalInfo = result[0];
      const director = additionalInfo.director || 'N/A';
      const genres = additionalInfo.genres?.join(', ') || 'N/A';
      const rating = additionalInfo.rating || 'N/A';

      movie.cast.innerHTML += `<br>Director: ${director}`;
      movie.cast.innerHTML += `<br>Genres: ${genres}`;
      movie.cast.innerHTML += `<br>Rating: ${rating}`;
    } else {
      console.error('No additional info found for movie:', movieTitle);
    }
  } catch (error) {
    console.error('Error fetching additional movie info:', error);
  }
}

// Load CSV data on page load
window.onload = function () {
  loadCSV();
};
