const recipeList = document.getElementById("recipeList");
const popup = document.getElementById("popup");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const scrollTopBtn = document.getElementById("scrollTopBtn");

async function fetchRecipes(query = "") {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.meals;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function searchRecipes() {
  loader.style.display = "flex";
  const keyword = searchInput.value.trim();
  const meals = await fetchRecipes(keyword);
  displayRecipes(meals);
  loader.style.display = "none";
}

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchRecipes();
});

function displayRecipes(meals) {
  recipeList.innerHTML = "";
  if (!meals) {
    recipeList.innerHTML = `<div class="not-found">Recipe not found!</div>`;
    return;
  }

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <h3>${meal.strMeal}</h3>
          <p>${meal.strInstructions.substring(0, 80)}...</p>
          <button onclick="showPopup(${meal.idMeal})">View Details</button>
        `;
    recipeList.appendChild(card);
  });
}

async function showPopup(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals[0];

  popup.innerHTML = `
        <div class="popup-content">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="popup-img" />
          <h2>${meal.strMeal}</h2>
          <p>${meal.strInstructions}</p>
          <button class="close-btn">Close</button>
        </div>
      `;
  popup.style.display = "flex";
  popup.querySelector(".close-btn").onclick = () => {
    popup.style.display = "none";
  };
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function () {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
};

window.onload = async () => {
  const meals = await fetchRecipes();
  displayRecipes(meals);
  loader.style.display = "none";
};
