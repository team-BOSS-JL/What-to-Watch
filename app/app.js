// Define the movieApp object with its properties and methods
const movieApp = {
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

  // <============ MODAL ==============>
  // get movie cards elements
  movieCards: document.querySelectorAll(".movieCard"),
  modal: document.getElementById("myModal"),
  closeBtn: document.querySelector(".close"),
  modalTitle: document.querySelector(".modalContentContainer #modalTitle"),
  modalOverview: document.querySelector(
    ".modalContentContainer #modalOverview"
  ),
  modalRating: document.querySelector(".modalContentContainer #modalRating"),

  // <============ END MODAL ==============>

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

    // Check if first character of search term is a special character
    if (!searchTerm.match(/^[a-zA-Z0-9]/)) {
      // Display message if first character is a special character
      this.moviesGrid.innerHTML =
        "Search term cannot begin with a special character or space.";
      return;
    }

    // Check if search term contains any characters other than letters, numbers, spaces, or valid special characters
    if (
      !searchTerm.match(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/)
    ) {
      // Display message if search term contains invalid characters
      this.moviesGrid.innerHTML =
        "Please enter letters, numbers, spaces, or valid special characters only.";
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
        // Extract list of movies from returned data
        const movies = data.results;

        // Filter out movies that don't have a poster, description, or title
        const validMovies = movies.filter((movie) => {
          return movie.poster_path && movie.overview && movie.title;
        });

        // Pass validMovies to displayMovies() method for rendering
        this.displayMovies(validMovies);
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
    movieTitle.classList.add("movieTitle");
    movieTitle.textContent = `${movie.title}`;
    movieCard.appendChild(movieTitle);
    const movieOverview = document.createElement("p");
    movieOverview.classList.add("movieOverview");
    movieOverview.textContent = movie.overview;
    movieCard.appendChild(movieOverview);
    const movieRating = document.createElement("p");
    movieRating.classList.add("movieRating");
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
      resetSearchBar();
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
        updateH2WithSearchTerm(searchTerm); // Call the updateH2WithSearchTerm function
      } else {
        this.moviesGrid.innerHTML =
          "The search is empty, please type a movie name to be searched. Thanks!";
        return;
        
      }
    });

    // write a function to update the h2 on the page with the value the user inputs in the search bar
    function updateH2WithSearchTerm(searchTerm) {
      const h2Element = document.querySelector("h2.genreTitle");
      h2Element.textContent = `Search results for "${searchTerm}"`;
    }

    // write a function to reset the search bar when another button is clicked or page is refreshed
    function resetSearchBar() {
      searchInput.value = "";
      searchInput.placeholder = "Enter a movie name...";
    }

    // Set up an event listener for when the user clicks the popular button
    this.popularBtn.addEventListener("click", () => {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US`; // Construct a URL for popular movies
      this.fetchMovies(url); // Call the fetchMovies() method with the URL
      displayText("Popular");
      //Resets the select element when the button it's been clicked
      resetSelect();
      resetSearchBar();
    });

    // Set up an event listener for when the user clicks the top rated button
    this.topRatedBtn.addEventListener("click", () => {
      const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}&language=en-US`; // Construct a URL for top rated movies
      this.fetchMovies(url); // Call the fetchMovies() method with the URL
      displayText("Top Rated");
      //Resets the select element when the button it's been clicked
      resetSelect();
      resetSearchBar();
    });

    // Set up an event listener for when the user clicks the upcoming button
    this.upcomingBtn.addEventListener("click", () => {
      const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.apiKey}&language=en-US`; // Construct a URL for upcoming movies
      this.fetchMovies(url); // Call the fetchMovies() method with the URL
      displayText("Upcoming");
      //Resets the select element when the button it's been clicked
      resetSelect();
      resetSearchBar();
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
      resetSearchBar();
    });

    // Set up an event listener for when the user scrolls
    window.addEventListener("scroll", () => {
      this.scrollFunction(); // Call the scrollFunction() method
    });

    // <============ MODAL ==============>

    moviesGrid.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("movieImg") ||
        event.target.classList.contains("movieTitle") ||
        event.target.classList.contains("movieOverview") ||
        event.target.classList.contains("movieRating") ||
        event.target.classList.contains("movieCard")
      ) {
        const movie = event.target.closest(".movieCard");
        const movieTitle = movie.children[1].textContent;
        const movieOverview = movie.children[2].textContent;
        const movieRating = movie.children[3].textContent;

        this.modalTitle.textContent = movieTitle;
        this.modalOverview.textContent = movieOverview;
        this.modalRating.textContent = `${movieRating}`;
        this.modal.style.display = "flex";
      }
    });

    // When the user clicks on the close button, close the modal
    this.closeBtn.addEventListener("click", () => {
      this.modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = "none";
      }
    });

    // <============ END MODAL ==============>
  },
};

// Call the init() method of the movieApp object
movieApp.init();
