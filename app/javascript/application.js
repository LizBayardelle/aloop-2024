import 'bootstrap'
import React from 'react'
import axios from 'axios';
import { createRoot } from 'react-dom/client'
import ProductDetails from './components/ProductDetails'
import AdminProducts from './components/AdminProducts'
import AdminSales from './components/AdminSales';
import Checkout from './components/Checkout'


const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
axios.defaults.headers.common['X-CSRF-Token'] = token;



try {

	document.addEventListener('DOMContentLoaded', () => {
		const adminProductsContainer = document.getElementById('admin-products-root');
		if (adminProductsContainer) {
		  const products = JSON.parse(adminProductsContainer.getAttribute('data-products'));
		  const categories = JSON.parse(adminProductsContainer.getAttribute('data-categories'));
		  const bikeModels = JSON.parse(adminProductsContainer.getAttribute('data-bike-models'));
	  
		  const root = createRoot(adminProductsContainer);
		  root.render(
			<AdminProducts 
			  initialProducts={products} 
			  initialCategories={categories} 
			  initialBikeModels={bikeModels} 
			/>
		  );
		}
	});

	document.addEventListener('DOMContentLoaded', () => {
		const checkoutContainer = document.getElementById('checkout-root');
		if (checkoutContainer) {
		  const order = JSON.parse(checkoutContainer.getAttribute('data-order'));
		  const user = JSON.parse(checkoutContainer.getAttribute('data-user'));
	  
		  const root = createRoot(checkoutContainer);
		  root.render(
			<Checkout 
			  initialOrder={order} 
			  initialUser={user}
			/>
		  );
		}
	});

	document.addEventListener('DOMContentLoaded', () => {
		const productDetailsContainer = document.getElementById('product-details-root');
		if (productDetailsContainer) {
			const product = JSON.parse(productDetailsContainer.getAttribute('data-product'));
			const root = createRoot(productDetailsContainer);
		  root.render(
			<ProductDetails 
			  product={product} 
			/>
		  );
		}
	});

	document.addEventListener('DOMContentLoaded', () => {
	const adminSalesContainer = document.getElementById('admin-sales-root');
	if (adminSalesContainer) {
		const orders = JSON.parse(adminSalesContainer.getAttribute('data-orders'));
		const root = createRoot(adminSalesContainer);
		root.render(
		<AdminSales initialOrders={orders} />
		);
	}
	});




} catch (error) {
	console.error('Error in application.js:', error);
}

