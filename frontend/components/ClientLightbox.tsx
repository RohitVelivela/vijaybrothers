
'use client';

import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface ClientLightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const ClientLightbox: React.FC<ClientLightboxProps> = ({ images, startIndex, onClose }) => {
  const [photoIndex, setPhotoIndex] = useState(startIndex);

  return (
    <Lightbox
      mainSrc={images[photoIndex]}
      nextSrc={images[(photoIndex + 1) % images.length]}
      prevSrc={images[(photoIndex + images.length - 1) % images.length]}
      onCloseRequest={onClose}
      onMovePrevRequest={() =>
        setPhotoIndex((photoIndex + images.length - 1) % images.length)
      }
      onMoveNextRequest={() =>
        setPhotoIndex((photoIndex + 1) % images.length)
      }
    />
  );
};

export default ClientLightbox;
