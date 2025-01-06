// Load PapaParse library from CDN (if you haven't included it already)
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js';
document.head.appendChild(script);

// New API details for movie types (movies-and-tv-shows-api.p.rapidapi.com)
const options = {
  method: 'POST',
  headers: {
    'x-rapidapi-key': '3fc82de1bbmsh08a8176d826f4edp1ba8cbjsn485b6890060a',
    'x-rapidapi-host': 'movies-and-tv-shows-api.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ tmdbId: '141' }) // Body should be a JSON string
};

// Data to be accessed and rendered (initially empty, will be populated by CSV)
let data_mov = [];

// Function to load and parse the CSV files
function loadCSV() {
  // Parse movies.csv (assuming it's served from the server or URL)
  Papa.parse('movies.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      console.log("Movies CSV data loaded", results);
      // Process the CSV results and fill `data_mov`
      results.data.forEach((row, index) => {
        if (index < 5) { // Limit to first 5 movies for now
          data_mov.push({
            movie_name: row.movie_name, // Adjust column name based on your CSV structure
            image: document.querySelector(`.img${index + 1}`),
            cast: document.querySelector(`.cast${index + 1}`)
          });
        }
      });
      // Fetch data for each movie after CSV is loaded
      data_mov.forEach(element => {
        getData(element);
      });
    }
  });

  // Parse ratings.csv if needed
  Papa.parse('ratings.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      console.log("Ratings CSV data loaded", results);
      // Process and use ratings if necessary
    }
  });
}

// Fetch movie data from API using the movie name
async function getData(movie) {
  console.log('Fetching data for movie:', movie.movie_name);

  const url = `https://movies-and-tv-shows-api.p.rapidapi.com/movies?search=${encodeURIComponent(movie.movie_name)}`;

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log('API Response:', result);

    if (result && result.Search && result.Search.length > 0) {
      const movieData = result.Search[0];

      // Set the movie poster or a fallback image if the poster is missing
      const posterUrl = movieData.Poster || 'https://via.placeholder.com/150'; // Default placeholder if no poster is available
      movie.image.setAttribute("src", posterUrl);

      // Update cast information or show fallback text
      movie.cast.innerHTML = "Cast: " + (movieData.Actors || 'No information available');

      // Fetch detailed movie information using the IMDb ID
      await getDetailedMovieInfo(movieData.imdbID, movie);
    } else {
      console.error("No data found for movie:", movie.movie_name);
      movie.cast.innerHTML = "No information available";
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    movie.cast.innerHTML = "Error fetching data";
  }
}

// Fetch detailed movie information using IMDb ID and update UI
async function getDetailedMovieInfo(imdbID, movie) {
  const url = `https://imdb236.p.rapidapi.com/imdb/tt${imdbID}`;

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log('Detailed Movie Info:', result);

    // Example: If the result contains specific details, display them
    if (result && result.title) {
      movie.cast.innerHTML += "<br>Title: " + result.title;
    }
    // You can add more details to display from the result here (e.g., genres, release date, etc.)
  } catch (error) {
    console.error('Error fetching detailed movie info:', error);
  }
}

// Load the CSV data when the page is loaded
window.onload = function() {
  loadCSV();
};
