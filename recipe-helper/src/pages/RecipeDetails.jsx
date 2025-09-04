import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { getMealDetailsById } from "../api.js";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isLoved, setIsLoved] = useState(() => {
  // Restore from localStorage if available
  const saved = localStorage.getItem(`loved_${id}`);
  return saved ? JSON.parse(saved) : false;
});

  // Fetch recipe details by ID
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const meal = await getMealDetailsById(id);
        if (meal) {
          setRecipe(meal);
        } else {
          setError("Recipe details not found.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // Click karne pe toggle hota hai
const handleLoveClick = () => {
  setIsLoved(!isLoved);
  // Optional: localStorage mein save
  localStorage.setItem(`loved_${id}`, JSON.stringify(!isLoved));
};
// Native sharing ya clipboard copy
const handleShare = async () => {
  if (navigator.share) {
    // Mobile: use native share
    await navigator.share({
      title: recipe.strMeal,
      text: "Check out this recipe!",
      url: window.location.href,
    });
  } else {
    // Desktop: Copy to clipboard
    await navigator.clipboard.writeText(window.location.href);
    alert("Recipe link copied to clipboard!");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-gradient-to-br from-pink-200/15 to-purple-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-orange-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Premium Glassmorphism Navigation */}
      <nav className="relative z-10 backdrop-blur-xl bg-white/40 border-b border-white/30 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="group flex items-center gap-3 px-6 py-3 bg-white/50 hover:bg-white/60 text-gray-700 hover:text-orange-600 font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-200/50 border border-white/60 hover:border-orange-300/50 backdrop-blur-sm"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Taylor's Kitchen
            </Link>

            <div className="flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.5 2h-13C4.67 2 4 2.67 4 3.5v17c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5zM18 20H6V4h12v16z" />
                  <path d="M8 6h8v2H8zm0 3h8v2H8zm0 3h5v2H8z" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Recipe Details</span>
            </div>
          </div>
        </div>
      </nav>

      {loading && <Loader />}

      {error && (
        <div className="relative z-10 max-w-4xl mx-auto mt-8 px-4">
          <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-6 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 text-red-700">
              <div className="w-12 h-12 bg-red-100/80 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <span className="text-lg font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {recipe && (
        <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Hero Card with Enhanced Glassmorphism */}
          <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl overflow-hidden border border-white/40 mb-8 hover:shadow-3xl hover:bg-white/35 transition-all duration-500">
            {/* Image Section with Refined Overlay */}
            <div className="relative h-80 sm:h-96 lg:h-[500px] overflow-hidden">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Floating Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
                    {recipe.strMeal}
                  </h1>
                  
                  {/* Premium Tags */}
                  <div className="flex flex-wrap gap-3">
                    <div className="group backdrop-blur-lg bg-gradient-to-r from-orange-500/70 to-pink-500/70 px-4 py-2 rounded-full border border-white/40 hover:border-white/60 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="flex items-center gap-2 text-white">
                        <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold">{recipe.strCategory}</span>
                      </div>
                    </div>
                    
                    <div className="group backdrop-blur-lg bg-gradient-to-r from-blue-500/70 to-purple-500/70 px-4 py-2 rounded-full border border-white/40 hover:border-white/60 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="flex items-center gap-2 text-white">
                        <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{recipe.strArea} Cuisine</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Floating Action Buttons */}
              <div className="absolute top-6 right-6 flex gap-3">
                <button 
                  onClick={handleLoveClick}
                  className={`group w-12 h-12 backdrop-blur-lg rounded-full border transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl flex items-center justify-center ${
                    isLoved 
                      ? 'bg-red-500/90 hover:bg-red-600/90 border-red-400/60 hover:border-red-300' 
                      : 'bg-white/25 hover:bg-white/35 border-white/40 hover:border-white/60'
                  }`}
                  title={isLoved ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isLoved 
                        ? 'text-white scale-110' 
                        : 'text-white group-hover:scale-110'
                    }`} 
                    fill={isLoved ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button 
                  onClick={handleShare}
                  className="group w-12 h-12 backdrop-blur-lg bg-white/25 hover:bg-white/35 rounded-full border border-white/40 hover:border-white/60 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  title="Share this recipe"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Ingredients Section */}
            <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 sm:p-8 border border-white/40 hover:shadow-2xl hover:bg-white/35 transition-all duration-500 group shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
                  <p className="text-gray-600">Everything you need</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                  const ingredient = recipe[`strIngredient${num}`];
                  const measure = recipe[`strMeasure${num}`];
                  return (
                    ingredient &&
                    ingredient.trim() && (
                      <div key={num} className="group/item backdrop-blur-md bg-white/40 hover:bg-white/50 rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full group-hover/item:scale-125 transition-transform duration-300 shadow-sm"></div>
                          <div className="flex-1">
                            <span className="text-gray-800 font-semibold text-lg">{ingredient}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-600 font-medium">{measure}</span>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 sm:p-8 border border-white/40 hover:shadow-2xl hover:bg-white/35 transition-all duration-500 group shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Instructions</h2>
                  <p className="text-gray-600">Step by step guide</p>
                </div>
              </div>
              
              <div className="backdrop-blur-md bg-white/40 rounded-2xl p-6 border border-white/30 shadow-inner">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                    {recipe.strInstructions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          {recipe.strYoutube && (
            <div className="mt-8 backdrop-blur-xl bg-white/30 rounded-3xl p-6 sm:p-8 border border-white/40 hover:shadow-2xl hover:bg-white/35 transition-all duration-500 group shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Video Tutorial</h2>
                  <p className="text-gray-600">Watch and learn</p>
                </div>
              </div>
              
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="group/video inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-white/20 hover:border-white/40"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.876 2.876 0 00-2.025-2.037C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.473.604A2.876 2.876 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.876 2.876 0 002.025 2.037c1.968.604 9.473.604 9.473.604s7.505 0 9.473-.604a2.876 2.876 0 002.025-2.037C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">Watch on YouTube</div>
                  <div className="text-white/80 text-sm">Follow along with the video</div>
                </div>
                <svg className="w-5 h-5 group-hover/video:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;