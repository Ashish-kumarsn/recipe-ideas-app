
// Base URL of TheMealDB API
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// 🔎 Search meals by ingredient(s)
export const searchMealsByIngredient = async (ingredients) => {
  try {
    // Agar string hai, split karke array bana lo
    const ingredientList = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(",").map((i) => i.trim()).filter(Boolean);

    if (ingredientList.length === 0) return [];

    // First ingredient ke liye API call
    const response = await fetch(`${BASE_URL}/filter.php?i=${ingredientList[0]}`);
    const data = await response.json();
    let meals = data.meals || [];

    // Agar multiple ingredients diye hain toh intersection nikalna hoga
    for (let i = 1; i < ingredientList.length; i++) {
      const res = await fetch(`${BASE_URL}/filter.php?i=${ingredientList[i]}`);
      const d = await res.json();
      const nextMeals = d.meals || [];

      // Common recipes (intersection by idMeal)
      const nextIds = new Set(nextMeals.map((m) => m.idMeal));
      meals = meals.filter((m) => nextIds.has(m.idMeal));
    }

    return meals;
  } catch (error) {
    console.error("Error fetching meals by ingredient:", error);
    throw error;
  }
};

// 🔎 Search meals by name
export const searchMealsByName = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching meals by name:", error);
    throw error;
  }
};


// 🔎 Fetch meals by multiple categories
export const fetchMealsByCategories = async (categories) => {
  try {
    let allMeals = [];
    for (const category of categories) {
      const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
      const data = await response.json();
      if (data.meals) {
        allMeals = [...allMeals, ...data.meals];
      }
    }
    return allMeals;
  } catch (error) {
    console.error("Error fetching meals by categories:", error);
    throw error;
  }
};


// 🔎 Get meal details by ID
export const getMealDetailsById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching meal details:", error);
    throw error;
  }
};

// 🛠️ Filter unwanted ingredients from a meal list
export const filterUnwantedIngredients = async (meals, unwantedIngredients) => {
  try {
    if (!unwantedIngredients || unwantedIngredients.length === 0) {
      return meals; // agar exclude list empty hai toh original return karo
    }

    const filteredMeals = [];

    for (let meal of meals) {
      const details = await getMealDetailsById(meal.idMeal);
      if (!details) continue;

      // Meal ke saare ingredients collect karo
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = details[`strIngredient${i}`];
        if (ing) ingredients.push(ing.toLowerCase());
      }

      // Check karo koi unwanted ingredient match karta hai ya nahi
      const hasUnwanted = unwantedIngredients.some(unwanted =>
        ingredients.includes(unwanted.toLowerCase())
      );

      if (!hasUnwanted) {
        filteredMeals.push(meal);
      }
    }

    return filteredMeals;
  } catch (error) {
    console.error("Error filtering unwanted ingredients:", error);
    throw error;
  }
};
