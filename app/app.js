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

  // Define an init function to set up the app and bind event listeners
  init() {
    // Call the fetchGenres() and addGenreChangeListener() methods
    this.fetchGenres();
  },
};

// Call the init() method of the movieApp object
movieApp.init();
