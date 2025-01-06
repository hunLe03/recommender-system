// New API details
const newOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '3fc82de1bbmsh08a8176d826f4edp1ba8cbjsn485b6890060a',
      'X-RapidAPI-Host': 'moviedatabase8.p.rapidapi.com'
    }
  };
  
  // Data to be accessed and rendered
  let data_mov = [
    {
      "movie_name": document.querySelector(".mov1").textContent,
      "image": document.querySelector(".img1"),
      "cast": document.querySelector(".cast1")
    },
    {
      "movie_name": document.querySelector(".mov2").textContent,
      "image": document.querySelector(".img2"),
      "cast": document.querySelector(".cast2")
    },
    {
      "movie_name": document.querySelector(".mov3").textContent,
      "image": document.querySelector(".img3"),
      "cast": document.querySelector(".cast3")
    },
    {
      "movie_name": document.querySelector(".mov4").textContent,
      "image": document.querySelector(".img4"),
      "cast": document.querySelector(".cast4")
    },
    {
      "movie_name": document.querySelector(".mov5").textContent,
      "image": document.querySelector(".img5"),
      "cast": document.querySelector(".cast5")
    }
  ];
  
  // API Request using fetch for new API
  async function getData(movie) {
    console.log('Fetching data for movie:', movie.movie_name);
  
    const url = `https://moviedatabase8.p.rapidapi.com/Search/${encodeURIComponent(movie.movie_name)}`;
  
    try {
      const response = await fetch(url, newOptions);
      const result = await response.json();
      console.log('API Response:', result);
  
      if (result && result.Search && result.Search.length > 0) {
        // Update movie image and cast based on the API response
        const movieData = result.Search[0];
        movie.image.setAttribute("src", movieData.Poster || 'default_poster.jpg'); // Fallback for missing poster
        movie.cast.innerHTML = "Cast: " + (movieData.Actors || 'No information available'); // Fallback for missing cast
      } else {
        console.error("No data found for movie:", movie.movie_name);
        movie.cast.innerHTML = "No information available";
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      movie.cast.innerHTML = "Error fetching data";
    }
  }
  
  // API calls for every recommended movie
  data_mov.forEach(element => {
    getData(element);
  });
  