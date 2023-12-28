const searchBtn = document.getElementById("searchBtn");
const searchField = document.getElementById("searchField");
const recipeDiv = document.querySelector(".recipe-cards");
const baseURL = "http://localhost:8080";

const errCallback = (err, origin) => {
  if (err.response) {
    console.log(err.response.data);
  } else {
    console.error(`Error occurred in ${origin}:`, err);
  }
};

//Search External API//

const searchHandler = async (e) => {
  e.preventDefault();
  const params = searchField.value;
  try {
    const response = await axios.get(`${baseURL}/letscook/api/search`, {
      params: { query: params },
    });
    renderRecipes(response.data.results);
  } catch (error) {
    errCallback(error, "getRecipes");
  }
};

const renderRecipes = (recipes) => {
  const fragment = document.createDocumentFragment();

  recipes.forEach((recipe) => {
    const recipeCard = makeRecipeCard(recipe);
    fragment.appendChild(recipeCard);
  });

  recipeDiv.innerHTML = "";
  recipeDiv.appendChild(fragment);
};

const makeRecipeCard = (recipe) => {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipe-card");
  recipeCard.setAttribute("data-id", recipe.id);

  recipeCard.innerHTML = `
    <div class="recipe-card outline">
    <img src='${recipe.image}' alt='${recipe.title}' class="recipe-cover"/>
    <br>
    <p>${recipe.title}</p>
    <button type="button" class="btn btn-primary view-recipe-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
    View Recipe
    </button>
    </div>
    `;

  const viewRecipeBtn = recipeCard.querySelector(".view-recipe-btn");
  viewRecipeBtn.addEventListener("click", () => {
    fetchRecipeDetails(recipe.id);
  });

  return recipeCard;
};

//Recipe Details Modal//

const fetchRecipeDetails = async (recipeId) => {
  try {
    const response = await axios.get(`${baseURL}/letscook/api/recipe`, {
      params: { recipeId: recipeId },
    });
    displayRecipeDetails(response.data);
  } catch (error) {
    errCallback(error, "fetchRecipeDetails");
  }
};

const displayRecipeDetails = (recipeDetails) => {
  renderRecipeInfo(recipeDetails);
  renderInstructions(recipeDetails.analyzedInstructions);
  renderIngredients(recipeDetails.extendedIngredients);
};

const renderRecipeInfo = (recipeDetails) => {
  const modalContent = document.getElementById("recipeDetailsContent");
  modalContent.innerHTML = `
  <img src="${recipeDetails.image}" alt="${recipeDetails.title}" style="max-width: 100%; height: auto;" />
    <h2>${recipeDetails.title}</h2>
    <p>Ready in ${recipeDetails.readyInMinutes} minutes</p>
    <br>
    <p1>Servings: ${recipeDetails.servings}</p1>
    <br>
    <p1>Summary: ${recipeDetails.summary}</p1>
    <br>
    <br>
    <div id="ingredientsContainer">
      <h3>Ingredients</h3>
      <ul id="ingredientsList"></ul>
    </div>
    <div id="instructionsContainer">
    <h2>Instructions</h2>
    <ul id="instructionsList"></ul>
    </div>
  `;
};

const renderInstructions = (analyzedInstructions) => {
  const instructionsList = document.getElementById("instructionsList");
  const fragment = document.createDocumentFragment();

  analyzedInstructions.forEach((instructionGroup) => {
    instructionGroup.steps.forEach((step, stepIndex) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Step ${stepIndex + 1}: ${step.step}`;
      fragment.appendChild(listItem);
    });
  });
  instructionsList.innerHTML = "";
  instructionsList.appendChild(fragment);
};

let checkboxIdCounter = 0;

const renderIngredients = (extendedIngredients) => {
  const ingredientsList = document.getElementById("ingredientsList");
  const fragment = document.createDocumentFragment();

  extendedIngredients.forEach((ingredient) => {
    const listItem = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input");
    checkbox.id = `${ingredient.id}_${checkboxIdCounter++}`;
    checkbox.name = ingredient.name;
    checkbox.value = ingredient.name;
    checkbox.checked = true;

    label.classList.add("form-check-label");
    label.htmlFor = ingredient.id;
    label.innerHTML = `
      <b>${ingredient.name}</b> ${ingredient.amount} - ${ingredient.unit}
    `;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    fragment.appendChild(listItem);
  });

  ingredientsList.innerHTML = "";
  ingredientsList.appendChild(fragment);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.classList.add("btn", "btn-primary", "subBtn");
  addBtn.innerText = "Add Items";
  addBtn.id = "subBtn";
  ingredientsList.appendChild(addBtn);
  addBtn.addEventListener("click", () => {
      handleButtonClick(extendedIngredients);
    });
};

const handleButtonClick = (extendedIngredients) => {
  const checkedInputs = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  );

  console.log(`type for extendedIngred`)
  for (const [key, value] of checkedInputs.entries()) {
    console.log(key, value, typeof value);
  }

  const selectedIngredients = checkedInputs.map((input) => {
    const parts = input.id.split('_');
    if (parts.length >= 2) {
      return parseInt(parts[0]);
    }
    return null; 
  }).filter((id) => id !== null);

  console.log(selectedIngredients)

  addIngredientsToList(extendedIngredients, selectedIngredients);

};

//Add ingredients to shopping list//

const addIngredientsToList = (extendedIngredients, selectedIngredients) => {

  const selectedIngredientsNumbers = selectedIngredients.map((str) => parseInt(str, 10));

  console.log(`type for extendedIngred`)
  for (const [key, value] of extendedIngredients.entries()) {
    console.log(key, value, typeof value);
  }
  console.log(`type for selectedIngred Id`)
  for (const [key, value] of selectedIngredients.entries()) {
    console.log(key, value, typeof value);
  }
  const idMap = new Map();
  extendedIngredients.forEach((ingredient) => {
    idMap.set(ingredient.id, ingredient);
  });
  console.log(`type for idmap Id`)
  for (const [key, value] of idMap.entries()) {
    console.log(key, value, typeof value);
  }

  const selectedIngredientsId = selectedIngredientsNumbers
    .map((id) => idMap.get(id))
    .filter(Boolean);

    console.log(`type for selectedIngredientsId`)
    for (const [key, value] of selectedIngredientsId.entries()) {
      console.log(key, value, typeof value);
    }
    
  const selectedIngredientsArray = Array.from(selectedIngredientsId.values());

  console.log(`type for selectedInselectedIngredientsArraygredientsId`)
  selectedIngredientsArray.forEach((value, index) => {
    console.log(index, value, typeof value);
  });

  axios
    .post(`${baseURL}/letscook/api/ingredients`, selectedIngredientsArray)
    .then(() => {
      alert(`Ingredients have been added to your shopping list!`);
    });
};

searchBtn.addEventListener("click", searchHandler);
