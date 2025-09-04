import React from 'react';
import { ChefHat, X } from 'lucide-react';

const RecipeResults = ({ 
    loading, 
    error, 
    recipes, 
    navigate,
    emptyStateTitle = "Ready to discover amazing recipes?",
    emptyStateMessage = "Use the search above to find recipes by ingredients or recipe names. You can also use the advanced filters to find recipes by mood and cooking time!"
}) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12 sm:py-20">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-500 border-t-transparent"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <X className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recipes Found */}
            {recipes.length > 0 && (
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center px-4">
                        Found {recipes.length} amazing recipes for you! ✨
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.idMeal}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                                onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={recipe.strMealThumb}
                                        alt={recipe.strMeal}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "/api/placeholder/400/225"; // Fallback image
                                        }}
                                    />
                                </div>
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                        {recipe.strMeal}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <ChefHat className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm">Tap to view recipe</span>
                                        </div>
                                        {recipe.strCategory && (
                                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full self-start sm:self-auto">
                                                {recipe.strCategory}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && recipes.length === 0 && (
                <div className="text-center py-12 sm:py-20 px-4">
                    <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3 sm:mb-4">
                        {emptyStateTitle}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
                        {emptyStateMessage}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecipeResults;