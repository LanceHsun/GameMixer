import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoModal = ({ 
  isOpen, 
  onClose, 
  currentPhoto, 
  onNext, 
  onPrevious, 
  photos,
  currentIndex 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl mx-4 z-10">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.alt}
            className="w-full h-full object-contain"
          />

          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < photos.length - 1 && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Photo Info */}
        <div className="mt-4 text-white text-center">
          <p className="text-sm opacity-80">
            {currentIndex + 1} of {photos.length}
          </p>
          {currentPhoto.description && (
            <p className="mt-2 text-lg">{currentPhoto.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;