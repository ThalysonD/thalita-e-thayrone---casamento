import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const Gallery = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photos = [
    {
      id: 1,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2014.31.17%20(1).jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 1'
    },
    {
      id: 2,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2014.31.18.jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 2'
    },
    {
      id: 3,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2014.31.18%20(3).jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 3'
    },
    {
      id: 4,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2014.31.19%20(2).jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 4'
    },
    {
      id: 5,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2014.31.19.jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 5'
    },
    {
      id: 6,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2015.05.34%20(1).jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 6'
    },
    {
      id: 7,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2015.05.36%20(3).jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 7'
    },
    {
      id: 8,
      src: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/render/image/public/wedding-photos/WhatsApp%20Image%202025-08-09%20at%2015.05.35%20(2).jpeg?width=800&height=600&resize=cover',
      alt: 'Thayrone e Thalita - Foto 8'
    }
  ];

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section className="py-20 px-4 bg-white relative">
      {/* Background Decorations */}
      <div className="absolute top-10 left-4 text-[#C9A66B] opacity-10 text-4xl">✿</div>
      <div className="absolute bottom-10 right-4 text-[#C9A66B] opacity-10 text-4xl">✿</div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Camera className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
          <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-4">
            Nossa História em Fotos
          </h2>
          <p className="font-['Playfair_Display'] text-lg text-gray-600">
            Momentos especiais que contam nossa jornada de amor
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="aspect-square cursor-pointer group relative overflow-hidden rounded-2xl shadow-lg"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-[#C9A66B] transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-[#C9A66B] transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-[#C9A66B] transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <img
              src={photos[currentImageIndex].src}
              alt={photos[currentImageIndex].alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} / {photos.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;