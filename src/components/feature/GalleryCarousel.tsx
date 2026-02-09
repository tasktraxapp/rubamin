
import React, { useState, useEffect, useCallback } from 'react';

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface GalleryItemData {
  title: string;
  date: string;
  location: string;
  category: string;
  images: GalleryImage[];
}

interface GalleryCarouselProps {
  item: GalleryItemData;
  onClose: () => void;
}

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ item, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
  }, [item.images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
  }, [item.images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-3xl"></i>
        </button>

        {/* Main Image Container */}
        <div className="relative bg-black rounded-xl overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[16/10] w-full">
            <img
              src={item.images[currentIndex].url}
              alt={item.images[currentIndex].caption || item.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navigation Arrows */}
          {item.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-2xl"></i>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-2xl"></i>
              </button>
            </>
          )}

          {/* Image Counter */}
          {item.images.length > 1 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {item.images.length}
            </div>
          )}

          {/* Photo Count Badge */}
          {item.images.length > 1 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#DC2626] rounded-full text-white text-sm font-medium flex items-center gap-1.5">
              <i className="ri-image-2-line"></i>
              {item.images.length} Photos
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-4 bg-white rounded-xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="px-3 py-1 bg-[#DC2626] text-white text-xs font-semibold rounded-full">
              {item.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-[#DC2626] font-medium">
              <i className="ri-calendar-line"></i>
              {item.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6C757D]">
              <i className="ri-map-pin-line"></i>
              {item.location}
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2C3E50]">{item.title}</h3>
          {item.images[currentIndex].caption && (
            <p className="mt-2 text-sm text-[#6C757D]">{item.images[currentIndex].caption}</p>
          )}
        </div>

        {/* Thumbnails */}
        {item.images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {item.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  idx === currentIndex ? 'ring-2 ring-[#DC2626] ring-offset-2' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface GalleryCardProps {
  item: GalleryItemData;
  onClick: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all bg-white"
    >
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={item.images[0].url}
          alt={item.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#DC2626]">
            {item.category}
          </span>
        </div>
        {item.images.length > 1 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1">
            <i className="ri-image-2-line"></i>
            {item.images.length}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
            <i className="ri-zoom-in-line text-xl text-[#2C3E50]"></i>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-calendar-line text-[#DC2626] text-base"></i>
            </div>
            <span className="text-sm font-medium text-[#DC2626]">{item.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-map-pin-line text-[#6B7280] text-base"></i>
            </div>
            <span className="text-sm text-[#6B7280]">{item.location}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[#2C3E50]">{item.title}</h3>
      </div>
    </div>
  );
};
