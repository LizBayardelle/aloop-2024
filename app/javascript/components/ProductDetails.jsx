import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ImageGallery from './ImageGallery';
import axios from 'axios';

// If using Webpacker or another modern JS bundler, uncomment the next line:
// import placeholderImage from '/app/assets/images/placeholder.jpg';

const ProductDetails = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [notes, setNotes] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [variantImages, setVariantImages] = useState({});

    useEffect(() => {
        initializeVariants();
        const token = document.querySelector('meta[name="csrf-token"]')?.content;
        setCsrfToken(token);
        initializeImages();
    }, [product]);

    const initializeVariants = () => {
        const initialVariants = {};
        product.components.forEach(component => {
            if (component.variants.length > 0) {
                const defaultVariant = component.variants[0];
                initialVariants[component.id] = defaultVariant.id;
            }
        });
        setSelectedVariants(initialVariants);
        calculateTotalPrice(initialVariants);
    };

    const initializeImages = () => {
        const images = {};
        product.components.forEach(component => {
            component.variants.forEach(variant => {
                if (variant.photos_urls && variant.photos_urls.length > 0) {
                    images[variant.id] = variant.photos_urls;
                }
            });
        });
        setVariantImages(images);
    };

    const handleVariantChange = (componentId, variantId) => {
        setSelectedVariants(prev => ({ ...prev, [componentId]: variantId }));
        calculateTotalPrice({ ...selectedVariants, [componentId]: variantId });
    };

    const calculateTotalPrice = (variants = selectedVariants) => {
        let price = 0;
        Object.entries(variants).forEach(([componentId, variantId]) => {
            const component = product.components.find(c => c.id === parseInt(componentId));
            const variant = component.variants.find(v => v.id === variantId);
            price += parseFloat(variant.price) || 0;
        });
        setTotalPrice(price);
    };

    const handleAddToCart = async () => {
        const orderItem = {
            product_id: product.id,
            quantity: 1,
            specs: Object.entries(selectedVariants).map(([componentId, variantId]) => {
                const component = product.components.find(c => c.id === parseInt(componentId));
                const variant = component.variants.find(v => v.id === variantId);
                return `${component.name}: ${variant.name}`;
            }).join('\n'),
            notes: notes,
            selected_variant_ids: Object.values(selectedVariants)
        };

        try {
            const response = await axios.post('/api/v1/order_items', 
                { order_item: orderItem },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    }
                }
            );
            if (response.data.status === 'success') {
                console.log('Added to cart successfully:', response.data.order_item);
                setShowModal(false);
                // You might want to update the UI here, e.g., show a success message
            } else {
                console.error('Error adding to cart:', response.data.errors);
                // Handle the error, e.g., show an error message to the user
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    const formatPrice = (price) => {
        const number = parseFloat(price);
        return isNaN(number) ? 'N/A' : `$${number.toFixed(2)}`;
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-sm-6">
                    <ImageGallery product={product} />
                    <p className="h2 mt-4">{product.display_price}</p>
                </div>
                <div className="col-sm-6">
                    <h1 className="pb-2">{product.name}</h1>
                    <p className="h4" dangerouslySetInnerHTML={{ __html: product.description }} />
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Customize and Add to Cart
                    </Button>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Customize Your {product.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3 className="text-center">Total Price: {formatPrice(totalPrice)}</h3>
                    {product.components.map(component => (
                        <div key={component.id}>
                            <h4 className="mt-3">Choose a <span className="font-weight-bold">{component.name}</span></h4>
                            <div className="row">
                                {component.variants.map(variant => (
                                    <div key={variant.id} className="col-6 mb-3">
                                        <div 
                                            className={`selectbox ${selectedVariants[component.id] === variant.id ? 'active' : ''}`}
                                            onClick={() => handleVariantChange(component.id, variant.id)}
                                        >
                                            <div className="row">
                                                <div className="col-4">
                                                    <img 
                                                        src={variantImages[variant.id]?.[0] || '/assets/placeholder.jpg'}
                                                        alt={variant.name || 'Placeholder image'} 
                                                        style={{ height: '70px', width: 'auto', objectFit: 'cover' }} 
                                                        onError={(e) => {
                                                            console.error(`Failed to load image: ${e.target.src}`);
                                                            e.target.src = '/assets/placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-8 text-left">
                                                    <strong>{variant.name}</strong>
                                                    <p>{formatPrice(variant.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <Form.Group className="mb-3">
                        <Form.Label>Tell Us About Your Project!</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductDetails;