// Define the movieApp object with its properties and methods
const movieApp = {
  genreTitles: "Trending Movies",
  // This variable stores the API key needed to access The Movie Database API.
  apiKey: "33bee90148c2091232a05dfb02573f40",

  // This variable stores the URL of the API endpoint that returns a list of movie genres.
  genreUrl: "https://api.themoviedb.org/3/genre/movie/list",

  // This variable stores the URL of the API endpoint that returns a list of movies.
  movieUrl: "https://api.themoviedb.org/3/discover/movie",

  // This variable stores the URL of the API endpoint that returns a list of movies.
  movieUrl: "https://api.themoviedb.org/3/discover/movie",

  // This variable is used to store a reference to the <select> element with an ID of "genreSelect" in the HTML document.
  genreSelect: document.getElementById("genreSelect"),

  // This variable is used to store a reference to the <ul> element with an ID of "moviesGrid" in the HTML document.
  moviesGrid: document.getElementById("moviesGrid"),
  genreTitle: document.getElementById("genreTitle"),

  // These variables are used to store references to the <button> elements with IDs of "popularBtn", "topRatedBtn", and "upcomingBtn" in the HTML document.
  popularBtn: document.getElementById("popularBtn"),
  topRatedBtn: document.getElementById("topRatedBtn"),
  upcomingBtn: document.getElementById("upcomingBtn"),

  // This variable is used to store a reference to the <form> element with a class of "searchForm" in the HTML document.
  searchForm: document.querySelector(".searchForm"),

  // This variable is used to store a reference to the <input> element with a class of "searchInput" in the HTML document.
  searchInput: document.querySelector(".searchInput"),

  genreTitles: "Trending Movies",

  // This method searches for movies by calling an external API with the provided search term
  // It also defines a displayMovies() method that takes a list of movies and generates HTML to display them on the page
  searchMovies(searchTerm) {
    // Check if search term is empty
    if (!searchTerm) {
      // Display message if search term is empty
      this.moviesGrid.innerHTML =
        "The search is empty, please type a movie name to be searched.";
      return;
    }

    // Check if search term contains any characters other than letters or numbers
    if (!searchTerm.match(/^[a-zA-Z0-9]+$/)) {
      // Display message if search term contains characters other than letters or numbers
      this.moviesGrid.innerHTML = "Please enter letters or numbers only.";
      return;
    }

    // Construct URL for API call using provided API key and search term
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${searchTerm}`;

    // Make API call using fetch() function and return a promise
    fetch(apiUrl)
      .then((response) => {
        // Throw error if response is not ok
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Convert response to JSON and return as a promise
        return response.json();
      })
      .then((data) => {
        // Extract list of movies from returned data and pass to displayMovies() method for rendering
        const movies = data.results;
        this.displayMovies(movies);
      })
      .catch((error) => {
        // Display error message if promise is rejected
        console.error("Error fetching search results:", error);
        this.moviesGrid.innerHTML = "Error fetching search results.";
      });
  },

  // Generate HTML code for each movie returned by the API and concatenate them into a single string
  // This function takes an array of movie objects and displays them on the page in a specific format
  createMovieCard(movie) {
    const movieCard = document.createElement("li");
    movieCard.classList.add("movieCard");
    const moviePoster = document.createElement("img");
    moviePoster.classList.add("movieImg");

    moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    moviePoster.alt = `${movie.title} poster`;
    movieCard.appendChild(moviePoster);
    const movieTitle = document.createElement("h3");
    movieTitle.textContent = `${movie.title} (${movie.release_date.substring(
      0,
      4
    )})`;
    movieCard.appendChild(movieTitle);
    const movieOverview = document.createElement("p");
    movieOverview.textContent = movie.overview;
    movieCard.appendChild(movieOverview);
    const movieRating = document.createElement("p");
    movieRating.textContent = `Rating: ${movie.vote_average}/10`;
    movieCard.appendChild(movieRating);
    return movieCard;
  },

  displayMovies(movies) {
    const movieFragment = document.createDocumentFragment();
    movies.forEach((movie) => {
      const movieCard = this.createMovieCard(movie);
      movieFragment.appendChild(movieCard);
    });
    this.moviesGrid.innerHTML = "";
    this.moviesGrid.appendChild(movieFragment);
  },

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
          option.value = genre.name;
          option.dataset.name = genre.id;
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
      const genreId =
        this.genreSelect.options[genreSelect.selectedIndex].dataset.name;
      this.genreTitles = this.genreSelect.value;
      this.genreTitle.innerHTML = this.genreTitles;
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
      .then((response) => response.json())
      .then((data) => {
        const movies = data.results;
        const moviesFragment = document.createDocumentFragment();
        movies.forEach((movie) => {
          const movieCard = this.createMovieCard(movie);
          moviesFragment.appendChild(movieCard);
        });
        this.moviesGrid.innerHTML = "";
        this.moviesGrid.appendChild(moviesFragment);
      })
      .catch((error) => console.error(error));
  },

  // Define a function to handle scrolling and display a "go to top" button
  // This function is responsible for showing and hiding a "go to top" button based on the user's scroll position on the page.
  scrollFunction() {
    // Get the button element with the ID "goTopBtn" from the DOM.
    const goTopBtn = document.getElementById("goTopBtn");

    // Check if the user has scrolled down more than 20 pixels using three different methods.
    if (
      window.scrollY > 20 || // Check scroll position on window object
      document.body.scrollTop > 20 || // Check scroll position on body element
      document.documentElement.scrollTop > 20 // Check scroll position on root element (HTML)
    ) {
      // If the user has scrolled down more than 20 pixels, display the "go to top" button by setting its CSS display property to "block".
      goTopBtn.style.display = "block";
    } else {
      // Otherwise, hide the "go to top" button by setting its display property to "none".
      goTopBtn.style.display = "none";
    }

    // Add an event listener to the button so that when it is clicked, the window will scroll smoothly to the top of the page.
    goTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  },

  // Define an init function to set up the app and bind event listeners
  init() {
    // Set up an event listener for when the user submits a search form
    this.searchForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the default behavior of submitting a form
      const searchTerm = this.searchInput.value; // Get the value of the search input
      if (searchTerm) {
        // If the search term is not empty
        this.searchMovies(searchTerm); // Call the searchMovies() method with the search term
      }
    });

    // Set up an event listener for when the user clicks the popular button
    this.popularBtn.addEventListener("click", () => {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US`; // Construct a URL for popular movies
      this.fetchMovies(url); // Call the fetchMovies() method with the URL
      displayText("Popular Movies");
      //Resets the select element when the button it's been clicked
      resetSelect();
    });

    // Set up an event listener for when the user clicks the top rated button
    this.topRatedBtn.addEventListener("click", () => {
      const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}&language=en-US`; // Construct a URL for top rated movies
      this.fetchMovies(url); // Call the fetchMovies() method with the URL
      displayText("Top Rated Movies");
      //Resets the select element when the button it's been clicked
      resetSelect();
    });

    // Set up an event listener for when the user clicks the upcoming button
    this.upcomingBtn.addEventListener("click", () => {
      const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.apiKey}&language=en-US`; // Construct a URL for upcoming movies
      this.fetchMovies(url); // Call the fetchMovies() method with the URL
      displayText("Upcoming Movies");
      //Resets the select element when the button it's been clicked
      resetSelect();
    });

    // Created function to display the text of the button to the page
    function displayText(text) {
      const h2 = document.createElement("h2");
      const textNode = document.createTextNode(text);
      h2.appendChild(textNode);
      const existingH2 = document.getElementById("genreTitle");
      if (existingH2) {
        existingH2.textContent = text;
      } else {
        h2.id = "genreTitle";
        document.body.appendChild(h2);
      }
    }

    // Create a function that resets the select element with an id of genreSelect
    function resetSelect() {
      const select = document.getElementById("genreSelect");
      select.selectedIndex = 0;
    }

    // Fetch trending movies and render them on page load
    const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.apiKey}&language=en-US`;
    this.fetchMovies(trendingUrl);

    // Call the fetchMovies() method with the default movieUrl URL
    this.fetchMovies(`${this.movieUrl}?api_key=${this.apiKey}&language=en-US`);

    // Call the fetchGenres() and addGenreChangeListener() methods
    this.fetchGenres();
    this.addGenreChangeListener();

    window.addEventListener("load", () => {
      const genreSelect = document.getElementById("genreSelect");
      genreSelect.selectedIndex = 0;
    });

    // Set up an event listener for when the user scrolls
    window.addEventListener("scroll", () => {
      this.scrollFunction(); // Call the scrollFunction() method
    });
  },
};

// Call the init() method of the movieApp object
movieApp.init();
