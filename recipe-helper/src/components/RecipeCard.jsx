import React from "react";

const RecipeCard = ({ recipe, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Recipe Image */}
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-48 object-cover"
      />

      {/* Recipe Content */}
      <div className="p-4 flex flex-col justify-between h-32">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {recipe.strMeal}
        </h2>

        <button
          onClick={() => onSelect(recipe)}
          className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors duration-300"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
