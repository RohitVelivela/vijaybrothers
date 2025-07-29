'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ClientLightbox = dynamic(() => import('./ClientLightbox'), { ssr: false });

interface ClientSwiperProps {
  slides: string[];
  initialSlide?: number;
}

export default function ClientSwiper({ slides, initialSlide }: ClientSwiperProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        navigation={slides.length > 1}
        slidesPerView={1}
        initialSlide={initialSlide}
        className="w-full h-full"
      >
        {slides.map((url, i) => (
          <SwiperSlide key={i} onClick={() => openLightbox(i)}>
            <img src={url} alt={`Slide ${i}`} className="w-full h-auto object-contain" />
          </SwiperSlide>
        ))}
      </Swiper>
      {isLightboxOpen && (
        <ClientLightbox
          images={slides}
          startIndex={currentImageIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}
