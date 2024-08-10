import 'bootstrap'
import tinymce from 'tinymce/tinymce';
import React from 'react'
import { createRoot } from 'react-dom/client'
import ProductDetails from './components/ProductDetails'



try {

	const renderReactComponent = () => {
		
		try {
			const productDetailsContainer = document.getElementById('productDetails');
			if (productDetailsContainer) {
				
				const productData = JSON.parse(productDetailsContainer.getAttribute('data-product'));
				const root = createRoot(productDetailsContainer);
				root.render(React.createElement(ProductDetails, { product: productData }));
				
			} else {
				console.warn('Product details container not found');
			}
		} catch (error) {
			console.error('Error in renderReactComponent:', error);
		}
	}

	const initializePage = () => {
		
		try {
			// TinyMCE initialization (if you're using it)
			/*
			if (typeof tinymce !== 'undefined') {
				const tinymceElements = document.querySelectorAll('.tinymce');
				if (tinymceElements.length > 0) {
				tinymce.init({
					selector: '.tinymce',
					plugins: 'paste link',
					toolbar: 'undo redo | styleselect | bold italic | link image',
					menubar: 'file edit view insert format tools table help',
				});
				
				} else {
				console.warn('No elements found for TinyMCE initialization');
				}
			} else {
				console.warn('TinyMCE is not defined');
			}
			*/

			// React component rendering
			renderReactComponent();
		} catch (error) {
			console.error('Error during initialization:', error);
		}
	}

	// Use both DOMContentLoaded and load events
	['DOMContentLoaded', 'load'].forEach(event => {
		window.addEventListener(event, () => {
		
		initializePage();
		});
	});

} catch (error) {
	console.error('Error in application.js:', error);
}

