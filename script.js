// Recipe data structure
let recipes = [];
let currentPage = 1;
const itemsPerPage = 3;

// Function to add a new recipe
function addRecipe(title, ingredients, instructions, image) {
  const recipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    image,
  };
  recipes.push(recipe);
  saveRecipes();
  displayRecipes();
}

// Function to delete a recipe
function deleteRecipe(id) {
  recipes = recipes.filter((recipe) => recipe.id !== id);
  saveRecipes();
  displayRecipes();
}

// Function to save recipes to local storage
function saveRecipes() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

// Function to load recipes from local storage
function loadRecipes() {
  const storedRecipes = localStorage.getItem("recipes");
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
    displayRecipes();
  } else {
    // Default "Cookies" recipe
    addRecipe(
      "Biryani",
      "Basmati rice, Chicken, Yogurt, Onions, Tomatoes, Ginger-garlic paste, Biryani masala, Saffron, Ghee, Mint leaves, Coriander leaves, Spices (Cinnamon, Cloves, Cardamom), Salt",
      "1. Rinse the rice and soak it in water for 30 minutes. \n2. Heat ghee in a pan and sauté the onions until golden brown. Remove half of the onions and set aside for garnishing. \n3. In the same pan, add the ginger-garlic paste and sauté until fragrant. \n4. Add the chicken pieces and cook until they turn white. \n5. Add the tomatoes, yogurt, biryani masala, and spices. Cook until the chicken is tender. \n6. Drain the soaked rice and add it to a pot of boiling water. Cook until the rice is 70% cooked. \n7. Layer the partially cooked rice over the chicken in the pan. Sprinkle saffron, mint leaves, and coriander leaves on top. \n8. Cover the pan with a tight-fitting lid and cook on low heat for 15-20 minutes. \n9. Garnish with the reserved fried onions. Serve hot.",
      "biryani.jpg"
    );
  }
}

// Function to display recipes on the page
function displayRecipes() {
  const recipesList = document.getElementById("recipes");
  recipesList.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  currentRecipes.forEach((recipe) => {
    const item = document.createElement("li");
    item.classList.add("recipe-item");

    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = recipe.title;
    item.appendChild(recipeTitle);

    const recipeDetails = document.createElement("div");
    recipeDetails.classList.add("recipe-details");

    const recipeImage = document.createElement("img");
    recipeImage.src = recipe.image;
    recipeImage.alt = recipe.title;
    recipeDetails.appendChild(recipeImage);

    const recipeIngredients = document.createElement("p");
    recipeIngredients.textContent = recipe.ingredients;
    recipeDetails.appendChild(recipeIngredients);

    const recipeInstructions = document.createElement("p");
    recipeInstructions.textContent = recipe.instructions;
    recipeDetails.appendChild(recipeInstructions);

    item.appendChild(recipeDetails);

    const recipeActions = document.createElement("div");
    recipeActions.classList.add("recipe-actions");

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.addEventListener("click", () => viewRecipe(recipe.id));
    recipeActions.appendChild(viewButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editRecipe(recipe.id));
    recipeActions.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteRecipe(recipe.id));
    recipeActions.appendChild(deleteButton);

    item.appendChild(recipeActions);

    recipesList.appendChild(item);
  });

  displayPagination();
}

// Function to display pagination buttons
function displayPagination() {
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      displayRecipes();
    });
    paginationContainer.appendChild(button);
  }
}

// Function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const instructions = document.getElementById("instructions").value;
  const imageInput = document.getElementById("image");

  // Check if an image is selected
  if (imageInput.files.length > 0) {
    const image = imageInput.files[0];

    // Read the image data and convert it to a data URL
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageDataURL = event.target.result;
      addRecipe(title, ingredients, instructions, imageDataURL);
    };
    reader.readAsDataURL(image);
  } else {
    // No image selected, add the recipe without an image
    addRecipe(title, ingredients, instructions, "");
  }

  // Reset the form
  document.getElementById("recipe-form").reset();
}

// Function to view a recipe
function viewRecipe(id) {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (recipe) {
    // Show recipe details (e.g., in a modal or a separate page)
    console.log(recipe);
  }
}

// Function to edit a recipe
function editRecipe(id) {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (recipe) {
    // Pre-fill the form with the recipe details for editing
    document.getElementById("title").value = recipe.title;
    document.getElementById("ingredients").value = recipe.ingredients;
    document.getElementById("instructions").value = recipe.instructions;
    // Handle image editing if necessary

    // Update the recipe on form submission
    function handleEditSubmit(event) {
      event.preventDefault();

      recipe.title = document.getElementById("title").value;
      recipe.ingredients = document.getElementById("ingredients").value;
      recipe.instructions = document.getElementById("instructions").value;
      // Handle image updating if necessary

      saveRecipes();
      displayRecipes();

      // Reset the form
      document.getElementById("recipe-form").reset();
      // Remove the event listener to avoid adding a new recipe on subsequent submissions
      document
        .getElementById("recipe-form")
        .removeEventListener("submit", handleEditSubmit);
    }

    document
      .getElementById("recipe-form")
      .addEventListener("submit", handleEditSubmit);
  }
}

// Function to search for recipes
function searchRecipes(query) {
  const searchResults = recipes.filter((recipe) => {
    const titleMatch = recipe.title.toLowerCase().includes(query.toLowerCase());
    const ingredientsMatch = recipe.ingredients
      .toLowerCase()
      .includes(query.toLowerCase());
    return titleMatch || ingredientsMatch;
  });
  displaySearchResults(searchResults);
}

// Function to display search results
function displaySearchResults(results) {
  const recipesList = document.getElementById("recipes");
  recipesList.innerHTML = "";

  if (results.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No matching recipes found.";
    recipesList.appendChild(message);
    return;
  }

  results.forEach((recipe) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <h3>${recipe.title}</h3>
      <div>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${recipe.ingredients}</p>
        <p>${recipe.instructions}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="viewRecipe(${recipe.id})">View</button>
        <button onclick="editRecipe(${recipe.id})">Edit</button>
        <button onclick="deleteRecipe(${recipe.id})">Delete</button>
      </div>
    `;
    recipesList.appendChild(item);
  });
}

// Function to initialize the application
function init() {
  loadRecipes();
  document
    .getElementById("recipe-form")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const query = document.getElementById("search-input").value;
      searchRecipes(query);
      // Reset the search input
      document.getElementById("search-input").value = "";
    });
}

// Call the init function when the page has finished loading
document.addEventListener("DOMContentLoaded", init);
