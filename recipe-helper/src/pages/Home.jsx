import React, { useState, useEffect } from "react";
import { Search, Clock, Heart, ChefHat, Sparkles, Filter, X, Plus } from "lucide-react";
import { searchMealsByIngredient, searchMealsByName, fetchMealsByCategories, filterUnwantedIngredients } from "../api.js";
import { useNavigate } from "react-router-dom";
import RecipeResults from "./Result.jsx";
import TopRightButtons from "./TopRight.jsx";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchType, setSearchType] = useState("ingredients");
    const [query, setQuery] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const [unwantedQuery, setUnwantedQuery] = useState("");
    const [unwantedIngredients, setUnwantedIngredients] = useState([]);

    // Add these state variables at the top with your other states
const [showWishlist, setShowWishlist] = useState(false);
const [wishlistRecipes, setWishlistRecipes] = useState([]);
const [wishlistLoading, setWishlistLoading] = useState(false);

// Add these functions in your Home component
const getLovedrRecipeIds = () => {
    const lovedIds = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('loved_')) {
            const value = localStorage.getItem(key);
            if (value === 'true') {
                const recipeId = key.replace('loved_', '');
                lovedIds.push(recipeId);
            }
        }
    }
    return lovedIds;
};

const fetchWishlistRecipes = async () => {
    setWishlistLoading(true);
    const lovedIds = getLovedrRecipeIds();
    
    if (lovedIds.length === 0) {
        setWishlistRecipes([]);
        setWishlistLoading(false);
        return;
    }

    try {
        const recipePromises = lovedIds.map(async (id) => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        });

        const recipes = await Promise.all(recipePromises);
        setWishlistRecipes(recipes.filter(recipe => recipe !== null));
    } catch (error) {
        console.error('Error fetching wishlist recipes:', error);
        setWishlistRecipes([]);
    } finally {
        setWishlistLoading(false);
    }
};

// Demo handleWishlistClick function
const handleWishlistClick = () => {
    console.log('Wishlist button clicked!');
    setShowWishlist(true);
    fetchWishlistRecipes();
};

// Demo handleMealOfTheDay function
const handleMealOfTheDay = async () => {
    console.log('Meal of the day clicked!');
    setLoading(true);
    setError("");
    
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
            setRecipes([data.meals[0]]);
        } else {
            setError("Could not fetch meal of the day. Please try again!");
        }
    } catch (error) {
        console.error('Error fetching meal of the day:', error);
        setError("Something went wrong while fetching meal of the day.");
    } finally {
        setLoading(false);
    }
};


    // Combined time estimation with better fallback
    const estimateCookingTime = (meal) => {
        // Instructions based guess (improved logic)
        if (meal.strInstructions) {
            const instructions = meal.strInstructions.toLowerCase();
            const words = instructions.split(" ").length;

            // Check for cooking time keywords
            if (instructions.includes("quick") || instructions.includes("15 min") || instructions.includes("20 min") || instructions.includes("microwave")) {
                return "quick";
            }
            if (instructions.includes("slow cook") || instructions.includes("2 hour") || instructions.includes("3 hour") || instructions.includes("overnight")) {
                return "slow";
            }

            // Fallback to word count - more refined logic
            if (words < 150) return "quick";
            if (words < 300) return "medium";
            return "slow";
        }

        return "medium"; // default fallback
    };

    const moodCategoryMap = {
        comfort: ["Beef", "Chicken", "Lamb", "Pork"],
        healthy: ["Salad", "Vegetarian", "Seafood", "Tomato"],
        indulgent: ["Dessert", "Pork"],
        fresh: ["Salad", "Seafood", "Vegetarian"],
        spicy: ["Chicken", "Lamb", "Pork"],
        sweet: ["Dessert", "Breakfast"]
    };

    const moods = [
        { id: "comfort", label: "Comfort Food", emoji: "🤗", color: "bg-orange-100 text-orange-800" },
        { id: "healthy", label: "Healthy", emoji: "🥗", color: "bg-green-100 text-green-800" },
        { id: "indulgent", label: "Indulgent", emoji: "🍰", color: "bg-purple-100 text-purple-800" },
        { id: "fresh", label: "Fresh & Light", emoji: "🌿", color: "bg-blue-100 text-blue-800" },
        { id: "spicy", label: "Spicy", emoji: "🌶️", color: "bg-red-100 text-red-800" },
        { id: "sweet", label: "Sweet Treats", emoji: "🍯", color: "bg-yellow-100 text-yellow-800" }
    ];

    const timeOptions = [
        { id: "quick", label: "Quick (< 30min)", time: "30" },
        { id: "medium", label: "Medium (30-60min)", time: "60" },
        { id: "slow", label: "Slow Cook (1+ hours)", time: "120" }
    ];

    const searchTypes = [
        { id: "ingredients", label: "By Ingredients", icon: ChefHat },
        { id: "name", label: "By Recipe Name", icon: Search }
    ];

    const handleSearch = async () => {
        if (!query.trim() && !selectedMood && !selectedTime && !unwantedQuery.trim()) {
            setError("Please enter a search query or select filters");
            return;
        }

        setLoading(true);
        setError("");
        setRecipes([]);

        try {
            let results = [];

            // Case 1: Query diya hai
            if (query.trim()) {
                if (searchType === "ingredients") {
                    const ingredients = query
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item);
                    if (ingredients.length === 0) {
                        throw new Error("Please enter valid ingredients");
                    }
                    results = await searchMealsByIngredient(ingredients);
                } else if (searchType === "name") {
                    results = await searchMealsByName(query.trim());
                }
            }
            // Case 2: Only filters selected
            else if (selectedMood || selectedTime) {
                let categories = [];

                if (selectedMood) {
                    categories = moodCategoryMap[selectedMood] || [];
                }

                if (categories.length > 0) {
                    results = await fetchMealsByCategories(categories);
                } else {
                    // If no mood selected but time is selected, get from all categories
                    const allCategories = [
                        "Beef",
                        "Chicken",
                        "Dessert",
                        "Lamb",
                        "Miscellaneous",
                        "Pasta",
                        "Pork",
                        "Seafood",
                        "Side",
                        "Starter",
                        "Vegan",
                        "Vegetarian",
                        "Breakfast",
                        "Goat",
                    ];
                    results = await fetchMealsByCategories(allCategories);
                }
            }

            // Validate results
            if (!Array.isArray(results)) {
                throw new Error("Invalid response from API");
            }

            if (results.length === 0) {
                setError("No recipes found. Try different search terms or filters.");
                return;
            }

            // Apply post-processing filters - SIMPLIFIED LOGIC
            let filtered = results;

            // Apply mood filter (only if mood is selected AND we got results from query)
            if (query.trim() && selectedMood) {
                filtered = filtered.filter((meal) => {
                    return moodCategoryMap[selectedMood]?.includes(meal.strCategory);
                });
            }

            // Apply time filter using estimateCookingTime function
            if (selectedTime) {
                filtered = filtered.filter((meal) => {
                    const estimatedTime = estimateCookingTime(meal);
                    return estimatedTime === selectedTime;
                });
            }

            // Apply unwanted ingredients filter
            if (unwantedIngredients.length > 0) {
                const unwantedList = unwantedIngredients.map(item => item.toLowerCase());
                filtered = await filterUnwantedIngredients(filtered, unwantedList);
            }

            // Final validation
            if (filtered.length === 0) {
                setError("No recipes match your criteria. Try adjusting your filters.");
                return;
            }

            // Success - save and display results
            setRecipes(filtered);
            saveToLocalStorage(filtered, query, selectedMood, selectedTime);

        } catch (err) {
            console.error("Search error:", err);
            setError(err.message || "Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    // Improved localStorage management
    const saveToLocalStorage = (recipes, query, mood, time) => {
        const searchData = {
            recipes,
            query,
            selectedMood: mood,
            selectedTime: time,
            timestamp: Date.now()
        };
        localStorage.setItem("recipeSearchData", JSON.stringify(searchData));
    };

    const loadFromLocalStorage = () => {
        try {
            const savedData = localStorage.getItem("recipeSearchData");
            if (savedData) {
                const data = JSON.parse(savedData);

                // Check if data is recent (within 1 hour)
                const isRecent = (Date.now() - data.timestamp) < (60 * 60 * 1000);

                if (isRecent && data.recipes) {
                    setRecipes(data.recipes);
                    setQuery(data.query || "");
                    setSelectedMood(data.selectedMood || "");
                    setSelectedTime(data.selectedTime || "");
                }
            }
        } catch (error) {
            console.error("Error loading from localStorage:", error);
            localStorage.removeItem("recipeSearchData");
        }
    };

    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    const clearFilters = () => {
        setSelectedMood("");
        setSelectedTime("");
        setQuery("");
        setUnwantedQuery("");
        setUnwantedIngredients([]); // Add this line
        setRecipes([]);
        setError("");
        localStorage.removeItem("recipeSearchData");
    };

    const activeFiltersCount = [
        selectedMood,
        selectedTime,
        unwantedIngredients.length > 0 ? 'unwanted' : null
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
            
            {/* Hero Section ke andar, relative div ke baad */}
<TopRightButtons
    onMealOfTheDayClick={handleMealOfTheDay}
    onWishlistClick={handleWishlistClick}
    wishlistCount={getLovedrRecipeIds().length}
    showWishlistCount={true}
/>
{/* Wishlist Modal - Add this in Home.jsx, not in TopRightButtons */}
{showWishlist && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-rose-500">
                <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-white fill-current" />
                    <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                        {wishlistRecipes.length} recipes
                    </span>
                </div>
                <button
                    onClick={() => setShowWishlist(false)}
                    className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-full"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                {wishlistLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                    </div>
                ) : wishlistRecipes.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No recipes in wishlist yet</h3>
                        <p className="text-gray-500">Start adding recipes to your wishlist by clicking the heart icon on recipe details!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistRecipes.map((recipe) => (
                            <div
                                key={recipe.idMeal}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
                                onClick={() => {
                                    setShowWishlist(false);
                                    navigate(`/recipe/${recipe.idMeal}`);
                                }}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={recipe.strMealThumb}
                                        alt={recipe.strMeal}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{recipe.strMeal}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                            {recipe.strCategory}
                                        </span>
                                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
)}

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
                            <ChefHat className="w-8 h-8 sm:w-10 sm:h-10" />
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                                Taylor's Kitchen
                            </h1>
                        </div>
                        <p className="text-lg sm:text-xl md:text-2xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Discover amazing recipes tailored to your taste, mood, and time
                        </p>

                        {/* Search Type Toggle */}
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 inline-flex flex-col sm:flex-row w-full sm:w-auto max-w-sm sm:max-w-none">
                                {searchTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setSearchType(type.id);
                                                setError(""); // Clear error when changing search type
                                            }}
                                            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 w-full sm:w-auto ${searchType === type.id
                                                ? "bg-white text-orange-600 shadow-lg"
                                                : "text-white hover:bg-white/20"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Main Search */}
                        <div className="max-w-2xl mx-auto px-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            if (error) setError(""); // Clear error while typing
                                        }}
                                        placeholder={
                                            searchType === "ingredients"
                                                ? "Enter ingredients (e.g., chicken, tomatoes, garlic)"
                                                : "Search for recipe names (e.g., pasta, curry, salad)"
                                        }
                                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-0 text-gray-800 text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl"
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                    <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto"
                                >
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>

                        {/* Filter Toggle */}
                        <div className="mt-4 sm:mt-6">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200 text-sm sm:text-base"
                            >
                                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                                Advanced Filters
                                {activeFiltersCount > 0 && (
                                    <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="bg-white shadow-lg border-t">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                Customize Your Search
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                            {/* Mood Selection */}
                            <div className="lg:col-span-1">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                                    Choose Your Mood
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                                    {moods.map((mood) => (
                                        <button
                                            key={mood.id}
                                            onClick={() => {
                                                setSelectedMood(selectedMood === mood.id ? "" : mood.id);
                                                if (error) setError("");
                                            }}
                                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${selectedMood === mood.id
                                                ? "border-orange-500 bg-orange-50 shadow-md"
                                                : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                                                <span className="font-medium text-gray-800 text-sm sm:text-base">{mood.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cooking Time */}
                            <div className="lg:col-span-1">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                    Cooking Time
                                </h4>
                                <div className="space-y-3">
                                    {timeOptions.map((time) => (
                                        <button
                                            key={time.id}
                                            onClick={() => {
                                                setSelectedTime(selectedTime === time.id ? "" : time.id);
                                                if (error) setError("");
                                            }}
                                            className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${selectedTime === time.id
                                                ? "border-orange-500 bg-orange-50 shadow-md"
                                                : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-800 text-sm sm:text-base">{time.label}</span>
                                                <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedTime === time.id ? "text-orange-500" : "text-gray-400"
                                                    }`} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Unwanted Ingredients */}
                            <div className="lg:col-span-2 xl:col-span-1">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                    Unwanted Ingredients
                                </h4>

                                {/* Input Section */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={unwantedQuery}
                                            onChange={(e) => setUnwantedQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && unwantedQuery.trim()) {
                                                    e.preventDefault();
                                                    const ingredients = unwantedQuery.split(',').map(item => item.trim()).filter(item => item);
                                                    ingredients.forEach(ingredient => {
                                                        if (!unwantedIngredients.includes(ingredient)) {
                                                            setUnwantedIngredients(prev => [...prev, ingredient]);
                                                        }
                                                    });
                                                    setUnwantedQuery('');
                                                }
                                            }}
                                            placeholder="Type ingredient and press Enter"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 text-sm sm:text-base"
                                        />
                                        <button
                                            onClick={() => {
                                                if (unwantedQuery.trim()) {
                                                    const ingredients = unwantedQuery.split(',').map(item => item.trim()).filter(item => item);
                                                    ingredients.forEach(ingredient => {
                                                        if (!unwantedIngredients.includes(ingredient)) {
                                                            setUnwantedIngredients(prev => [...prev, ingredient]);
                                                        }
                                                    });
                                                    setUnwantedQuery('');
                                                }
                                            }}
                                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                        Add ingredients you want to avoid (press Enter or click + to add)
                                    </p>
                                </div>

                                {/* Selected Ingredients Display */}
                                {unwantedIngredients.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">Excluded Ingredients:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                            {unwantedIngredients.map((ingredient, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setUnwantedIngredients(prev => prev.filter((_, i) => i !== index));
                                                        if (error) setError("");
                                                    }}
                                                    className="p-2 sm:p-3 rounded-xl border-2 border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-800 text-xs sm:text-sm">{ingredient}</span>
                                                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover:text-red-600 transition-colors" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            )}


            <RecipeResults
                loading={loading}
                error={error}
                recipes={recipes}
                navigate={navigate}
            />

        </div>
    );
};

export default Home;