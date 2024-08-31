import React, { useState, useEffect } from 'react';

const ImageGallery = ({ variant }) => {
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    const images = variant.photo_urls || [];
    setAllImages(images);
    setMainImage(images[0]?.url || '');
  }, [variant]);

  return (
    <div className="image-gallery">
      <div className="main-image-container">
        {mainImage ? (
          <img src={mainImage} alt="Main product" className="img-fluid main-image" />
        ) : (
          <div className="no-image">
            <span>No image available</span>
          </div>
        )}
      </div>
      <div className="thumbnails-container mt-3">
        {allImages.map((image, index) => (
          <div 
            key={image.id} 
            className={`thumbnail ${image.url === mainImage ? 'active' : ''}`}
            onClick={() => setMainImage(image.url)}
          >
            <img src={image.thumbnail} alt={`Thumbnail ${index + 1}`} className="img-fluid" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;