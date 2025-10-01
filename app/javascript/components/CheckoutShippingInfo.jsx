import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  ship_to_name: Yup.string().required('Required'),
  customer_email: Yup.string().email('Invalid email').required('Required'),
  address_line_1: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  postal_code: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  create_account: Yup.boolean(),
  password: Yup.string().when('create_account', {
    is: true,
    then: () => Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    otherwise: () => Yup.string()
  }),
  password_confirmation: Yup.string().when('create_account', {
    is: true,
    then: () => Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required'),
    otherwise: () => Yup.string()
  })
});

const CheckoutShippingInfo = ({ order, onUpdateOrder, onNext, onBack }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in by looking for user session indicators
    const userSignedIn = document.querySelector('meta[name="user-signed-in"]')?.content === 'true' ||
                        document.querySelector('[data-user-id]')?.dataset.userId ||
                        document.body.dataset.userSignedIn === 'true';
    setIsUserLoggedIn(userSignedIn);
  }, []);
  
  const fetchShippingRates = async (orderId, retries = 3) => {
    try {
      const response = await axios.get(`/api/v1/orders/${orderId}/shipping_rates`);
      return response.data;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return fetchShippingRates(orderId, retries - 1);
      }
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Check if user is already logged in before attempting registration
      const isLoggedIn = document.querySelector('meta[name="current-user-id"]')?.content;
      
      // Only attempt account creation if not logged in and checkbox is checked
      if (values.create_account && !isLoggedIn) {
        try {
          // Split name into first and last name
          const nameParts = values.ship_to_name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          const registrationData = {
            user: {
              email: values.customer_email,
              password: values.password,
              password_confirmation: values.password_confirmation,
              first_name: firstName,
              last_name: lastName
            }
          };
          
          const registrationResponse = await axios.post('/users', registrationData);
          // Store user info if registration successful
          if (registrationResponse.data.user) {
            // User is now logged in via devise
            console.log('Account created successfully');
            // Refresh the page to update the session
            window.location.reload();
            return;
          }
        } catch (registrationError) {
          if (registrationError.response?.status === 302) {
            // Already logged in, continue with checkout
            console.log('User already logged in, continuing with checkout');
          } else if (registrationError.response?.data?.errors) {
            setErrors({ submit: 'Account creation failed: ' + Object.values(registrationError.response.data.errors).join(', ') });
            return;
          }
        }
      }
      
      // Continue with order update (remove password fields from order data)
      const { create_account, password, password_confirmation, ...orderData } = values;
      
      // Update the order with the new shipping info
      const updatedOrderResponse = await axios.patch(`/api/v1/orders/${order.id}`, { 
        order: { ...orderData, shipping_info: true } 
      });
      const updatedOrder = updatedOrderResponse.data;
  
      // Update the order state in the parent component
      onUpdateOrder(updatedOrder);
  
      // Then, fetch shipping rates using the correct endpoint
      const shippingRates = await fetchShippingRates(updatedOrder.id);
  
      // Move to the next step, passing the updated order and shipping rates
      onNext(updatedOrder, shippingRates);
    } catch (error) {
      console.error('Error updating order or fetching shipping rates:', error);
      console.error('Error response:', error.response);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ submit: error.response.data.error });
      } else {
        setErrors({ submit: 'An error occurred. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-center mb-4">Shipping Info</h1>
      <Formik
        initialValues={{
          ship_to_name: order.ship_to_name || '',
          customer_email: order.customer_email || '',
          address_line_1: order.address_line_1 || '',
          address_line_2: order.address_line_2 || '',
          city: order.city || '',
          state: order.state || '',
          postal_code: order.postal_code || '',
          country: order.country || '',
          create_account: false,
          password: '',
          password_confirmation: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, values }) => (
          <Form>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <Field name="ship_to_name" className="form-control" placeholder="Name" />
                <ErrorMessage name="ship_to_name" component="div" className="text-danger" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <Field name="customer_email" type="email" className="form-control" placeholder="Email" />
                <ErrorMessage name="customer_email" component="div" className="text-danger" />
              </div>
              <div className="col-12 mb-3">
                <Field name="address_line_1" className="form-control" placeholder="Address Line 1" />
                <ErrorMessage name="address_line_1" component="div" className="text-danger" />
              </div>
              <div className="col-12 mb-3">
                <Field name="address_line_2" className="form-control" placeholder="Address Line 2 (Optional)" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <Field name="city" className="form-control" placeholder="City" />
                <ErrorMessage name="city" component="div" className="text-danger" />
              </div>
              <div className="col-12 col-md-2 mb-3">
                <Field name="state" className="form-control" placeholder="State" />
                <ErrorMessage name="state" component="div" className="text-danger" />
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Field name="postal_code" className="form-control" placeholder="Postal Code" />
                <ErrorMessage name="postal_code" component="div" className="text-danger" />
              </div>
              <div className="col-12 mb-3">
                <Field name="country" className="form-control" placeholder="Country" />
                <ErrorMessage name="country" component="div" className="text-danger" />
              </div>
            </div>
            
            {/* Account Creation Section - Only show if not logged in */}
            {!isUserLoggedIn && (
              <div className="card mb-3 mt-4">
                <div className="card-body">
                  <div className="form-check mb-3">
                    <Field type="checkbox" name="create_account" className="form-check-input" id="createAccount" />
                    <label className="form-check-label" htmlFor="createAccount">
                      Create an account to track your orders
                    </label>
                  </div>
                  
                  {values.create_account && (
                    <div className="row">
                      <div className="col-12 col-md-6 mb-3">
                        <Field name="password" type="password" className="form-control" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="text-danger" />
                      </div>
                      <div className="col-12 col-md-6 mb-3">
                        <Field name="password_confirmation" type="password" className="form-control" placeholder="Confirm Password" />
                        <ErrorMessage name="password_confirmation" component="div" className="text-danger" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
            <div className="d-flex justify-content-between mt-4">
              <button type="button" onClick={onBack} className="btn btn-secondary">Back</button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Processing...' : 'See Shipping Options'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CheckoutShippingInfo;