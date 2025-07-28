import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Heart,
  X,
  Sparkle,
  MapPin,
  Camera,
  Coffee,
  Mountain,
} from "lucide-react";

const UserCard = () => {
  const [isLiked, setIsLiked] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right' | null
  const cardRef = useRef(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef(null);

  const handleInterested = () => {
    setIsLiked(true);
    setTimeout(() => setIsLiked(null), 1000);
  };

  const handleIgnore = () => {
    setIsLiked(false);
    setTimeout(() => setIsLiked(null), 1000);
  };

  const getDurationFromCSS = useCallback((variableName, element) => {
    const targetElement = element || document.documentElement;
    const value = getComputedStyle(targetElement)?.getPropertyValue(variableName)?.trim();
    if (!value) return 300; // Default 300ms
    if (value.endsWith("ms")) return parseFloat(value);
    if (value.endsWith("s")) return parseFloat(value) * 1000;
    return parseFloat(value) || 300;
  }, []);

  const applySwipeStyles = useCallback((deltaX) => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty('--swipe-x', `${deltaX}px`);
    card.style.setProperty('--swipe-rotate', `${deltaX * 0.1}deg`);
    card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 200, 1) * 0.3).toString();
  }, []);

  const resetCard = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty('--swipe-x', '0px');
    card.style.setProperty('--swipe-rotate', '0deg');
    card.style.opacity = '1';
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  }, []);

  const handleStart = useCallback((clientX) => {
    if (isSwiping.current) return;
    isSwiping.current = true;
    setIsDragging(true);
    startX.current = clientX;
    currentX.current = clientX;

    const card = cardRef.current;
    if (card) {
      card.style.transition = 'none';
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 100;
    const duration = getDurationFromCSS('--card-swap-duration', cardRef.current);
    const card = cardRef.current;

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);

        // Animate card off screen
        card.style.setProperty('--swipe-x', `${direction * 1000}px`);
        card.style.setProperty('--swipe-rotate', `${direction * 30}deg`);
        card.style.opacity = '0';

        // Trigger appropriate action
        if (direction > 0) {
          handleInterested(); // Right swipe = interested
        } else {
          handleIgnore(); // Left swipe = not interested
        }

        // Reset card after animation
        setTimeout(() => {
          resetCard();
        }, duration);
      } else {
        // Snap back to center
        resetCard();
      }
    }

    isSwiping.current = false;
    setIsDragging(false);
    setSwipeDirection(null);
    startX.current = 0;
    currentX.current = 0;
  }, [getDurationFromCSS, handleInterested, handleIgnore, resetCard]);

  const handleMove = useCallback((clientX) => {
    if (!isSwiping.current) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      currentX.current = clientX;
      const deltaX = currentX.current - startX.current;

      // Update swipe direction for visual feedback
      if (Math.abs(deltaX) > 50) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(null);
      }

      applySwipeStyles(deltaX);
    });
  }, [applySwipeStyles]);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const handlePointerDown = (e) => {
      e.preventDefault();
      handleStart(e.clientX);
    };

    const handlePointerMove = (e) => {
      handleMove(e.clientX);
    };

    const handlePointerUp = () => {
      handleEnd();
    };

    // Add event listeners
    cardElement.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      cardElement.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 md:w-24 md:h-24 bg-gradient-radial from-purple-600/20 via-violet-500/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>

      <div
        ref={cardRef}
        className="bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-2xl border border-purple-500/30 dark:border-purple-400/20 w-80 max-w-sm rounded-3xl overflow-hidden relative z-10 shadow-2xl shadow-black/50 cursor-grab active:cursor-grabbing select-none will-change-transform hover:scale-[1.02] hover:shadow-3xl hover:shadow-purple-500/20 dark:hover:shadow-purple-400/10"
        style={{
          transform: `translateX(var(--swipe-x, 0px)) rotate(var(--swipe-rotate, 0deg))`,
          touchAction: 'none',
          '--card-swap-duration': '300ms',
        }}
      >
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-400/5 dark:from-purple-400/5 dark:to-purple-300/5 rounded-3xl pointer-events-none" />

        {/* Swipe indicators */}
        {isDragging && (
          <>
            {/* Like indicator (right swipe) */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent rounded-3xl pointer-events-none transition-opacity duration-200 ${swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'
                }`}
            />
            <div
              className={`absolute top-1/2 left-8 transform -translate-y-1/2 transition-all duration-200 ${swipeDirection === 'right' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
            >
              <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                <Heart className="w-6 h-6 fill-white" />
              </div>
            </div>

            {/* Pass indicator (left swipe) */}
            <div
              className={`absolute inset-0 bg-gradient-to-l from-red-500/20 to-transparent rounded-3xl pointer-events-none transition-opacity duration-200 ${swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'
                }`}
            />
            <div
              className={`absolute top-1/2 right-8 transform -translate-y-1/2 transition-all duration-200 ${swipeDirection === 'left' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
            >
              <div className="bg-red-500 text-white p-3 rounded-full shadow-lg">
                <X className="w-6 h-6" />
              </div>
            </div>
          </>
        )}

        {/* Profile Image */}
        <figure className="relative h-48 group">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
            alt="Profile"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent dark:from-gray-950/95 dark:via-gray-900/40" />
          {/* Age Badge */}
          <div className="absolute top-4 right-4 bg-black/90 dark:bg-gray-950/95 backdrop-blur-sm text-white dark:text-gray-100 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/50 dark:border-purple-400/40 shadow-lg flex items-center">
            <Sparkle className="w-3 h-3 mr-1 text-purple-400 dark:text-purple-300" />
            25
          </div>
          {/* Location */}
          <div className="absolute bottom-4 left-4 bg-black/90 dark:bg-gray-950/95 backdrop-blur-sm text-white dark:text-gray-100 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 dark:border-purple-400/20 shadow-lg flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-purple-300 dark:text-purple-200" />2 miles away
          </div>
        </figure>

        {/* Profile Info */}
        <div className="p-6 space-y-4 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-1 tracking-tight flex items-center">
              Sarah Johnson
              <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-500 dark:to-pink-400 text-transparent bg-clip-text">
                PRO
              </span>
            </h2>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mt-2 font-medium">
              Adventure seeker and coffee enthusiast. Always looking for new
              experiences and connections!
            </p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2 mt-5">
              <div className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur border border-purple-500/20 dark:border-purple-400/15 text-white dark:text-gray-100 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                <Camera className="w-3 h-3 mr-1.5 text-purple-300 dark:text-purple-200" />
                Photography
              </div>
              <div className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur border border-purple-500/20 dark:border-purple-400/15 text-white dark:text-gray-100 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                <Mountain className="w-3 h-3 mr-1.5 text-purple-300 dark:text-purple-200" />
                Hiking
              </div>
              <div className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur border border-purple-500/20 dark:border-purple-400/15 text-white dark:text-gray-100 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                <Coffee className="w-3 h-3 mr-1.5 text-purple-300 dark:text-purple-200" />
                Coffee
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-5">
            <button
              onClick={handleIgnore}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-800 dark:bg-gray-900 hover:bg-gray-700/90 dark:hover:bg-gray-800/90 border border-red-500/30 dark:border-red-400/25 hover:border-red-500/50 dark:hover:border-red-400/40 shadow-lg text-red-400 dark:text-red-300 hover:text-red-300 dark:hover:text-red-200 rounded-xl font-medium text-sm transition-all duration-300 group"
            >
              <X className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" />
              Ignore
            </button>

            <button
              onClick={handleInterested}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 border-0 shadow-lg shadow-purple-500/50 dark:shadow-purple-400/30 text-white rounded-xl font-medium text-sm transition-all duration-300 group"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform fill-white" />
              Interested
            </button>
          </div>
        </div>

        {/* Like/Pass Overlay */}
        {isLiked !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className={`text-3xl font-black tracking-wide transform rotate-12 border-4 rounded-xl px-6 py-3 backdrop-blur-md shadow-xl animate-bounce ${isLiked
                ? "text-purple-300 dark:text-purple-200 border-purple-300/70 dark:border-purple-200/60 bg-purple-900/30 dark:bg-purple-800/40 shadow-purple-400/50 dark:shadow-purple-300/40"
                : "text-red-300 dark:text-red-200 border-red-300/70 dark:border-red-200/60 bg-red-900/30 dark:bg-red-800/40 shadow-red-400/50 dark:shadow-red-300/40"
                }`}
            >
              {isLiked ? "LIKED" : "PASSED"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
