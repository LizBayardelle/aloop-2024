import React, { useState, useEffect } from 'react';

const ImageGallery = ({ product }) => {
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    const images = product.components.flatMap(component => 
      component.variants.flatMap(variant => variant.photos_urls || [])
    );
    setAllImages(images);
    setMainImage(images[0] || '');
  }, [product]);

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
            key={index} 
            className={`thumbnail ${image === mainImage ? 'active' : ''}`}
            onClick={() => setMainImage(image)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="img-fluid" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;