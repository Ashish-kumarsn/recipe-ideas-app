import React from 'react';
import { ChefHat, Heart } from 'lucide-react';

const TopRightButtons = ({ 
    onMealOfTheDayClick, 
    onWishlistClick,
    wishlistCount = 0,
    showWishlistCount = false 
}) => {
    return (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-10">
            {/* Meal of the Day Button */}
            <button
                onClick={onMealOfTheDayClick}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-orange-400 to-rose-400 text-white rounded-full hover:from-orange-500 hover:to-rose-500 transition-all duration-200 text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                <ChefHat className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Suggest Random</span>
                <span className="sm:hidden">Random</span>
            </button>
            
            {/* Wishlist Button */}
            <button
                onClick={onWishlistClick}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200 text-xs sm:text-sm group shadow-lg hover:shadow-xl transform hover:scale-105 relative"
            >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 group-hover:fill-current transition-all duration-200" />
                <span className="hidden sm:inline">Wishlist</span>
                
                {/* Optional Wishlist Count Badge */}
                {showWishlistCount && wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                        {wishlistCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default TopRightButtons;