// Define the movieApp object with its properties and methods
const movieApp = {
  // This variable stores the API key needed to access The Movie Database API.
  apiKey: "33bee90148c2091232a05dfb02573f40",

  // This variable stores the URL of the API endpoint that returns a list of movie genres.
  genreUrl: "https://api.themoviedb.org/3/genre/movie/list",

  // This variable stores the URL of the API endpoint that returns a list of movies.
  movieUrl: "https://api.themoviedb.org/3/discover/movie",

  // This variable is used to store a reference to the <select> element with an ID of "genreSelect" in the HTML document.
  genreSelect: document.getElementById("genreSelect"),

  // This variable is used to store a reference to the <ul> element with an ID of "moviesGrid" in the HTML document.
  moviesGrid: document.getElementById("moviesGrid"),

  // Define a function to fetch the movie genres and add them to the genre select dropdown
  // This function fetches a list of movie genres from an API using the provided URL and API key.
  fetchGenres() {
    // Use fetch() to make a GET request to the provided URL with the API key appended as a query parameter
    fetch(`${this.genreUrl}?api_key=${this.apiKey}&language=en-US`)
      // If the response is successful, convert the response body to JSON
      .then((response) => response.json())
      // If the response body was successfully converted to JSON, retrieve the list of genres and add each one as an option to a select element in the DOM.
      .then((data) => {
        const genres = data.genres;
        genres.forEach((genre) => {
          // Create a new option element for each genre
          const option = document.createElement("option");
          // Set the option's value property to the genre's ID and its text property to the genre's name
          option.value = genre.id;
          option.text = genre.name;
          // Add the option element to the select element in the DOM
          this.genreSelect.appendChild(option);
        });
      })
      // If there's an error during the fetch or parsing of the response, log the error to the console
      .catch((error) => console.error(error));
  },

  // Define a function to handle the change event on the genre select dropdown and fetch movies based on the selected genre
  // This function adds a change event listener to the genre select dropdown menu.
  addGenreChangeListener() {
    // When the user changes the selected genre, the function inside the arrow function will be executed.
    this.genreSelect.addEventListener("change", () => {
      // Gets the value of the selected genre.
      const genreId = this.genreSelect.value;
      // Constructs a URL to fetch movies based on the selected genre.
      const url = `${this.movieUrl}?api_key=${this.apiKey}&language=en-US&with_genres=${genreId}`;
      // Fetches the movies based on the constructed URL.
      this.fetchMovies(url);
    });
  },

  // Define a function to fetch movies from a given URL and render them in the movies grid
  // The fetchMovies function takes a URL as its argument and uses the fetch API to make a GET request to that URL
  fetchMovies(url) {
    fetch(url)
      // Once the response is returned, we parse the response body as JSON
      .then((response) => response.json())
      // The data now contains the JSON data we requested. We extract the movies from the data and store them in a variable
      .then((data) => {
        const movies = data.results;
        let moviesHtml = "";
        // We use the forEach method to iterate over each movie in the movies array
        movies.forEach((movie) => {
          // For each movie, we create a string of HTML markup using template literals and append it to the moviesHtml variable
          moviesHtml += `
          <li class="movieCard">
            <img src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${movie.title} poster">
            <h3>${movie.title} (${movie.release_date.substring(0, 4)})</h3>
            <p>${movie.overview}</p>
            <p>Rating: ${movie.vote_average}/10</p>
          </li>
        `;
        });
        // We set the innerHTML property of the moviesGrid element to the moviesHtml string, which renders the movies on the page
        this.moviesGrid.innerHTML = moviesHtml;
      })
      // If there is an error during any part of this process, we log the error to the console
      .catch((error) => console.error(error));
  },

  // Define an init function to set up the app and bind event listeners
  init() {
    // Call the fetchGenres() and addGenreChangeListener() methods
    this.fetchGenres();
    this.addGenreChangeListener();
  },
};

// Call the init() method of the movieApp object
movieApp.init();
