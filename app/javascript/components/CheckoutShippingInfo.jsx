import React from 'react';
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
});

const CheckoutShippingInfo = ({ order, onUpdateOrder, onNext, onBack }) => {
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
      // First, update the order with the new shipping info
      const updatedOrderResponse = await axios.patch(`/api/v1/orders/${order.id}`, { order: { ...values, shipping_info: true } });
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
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
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