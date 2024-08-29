import React, { useState, useEffect } from 'react';
import { Table, Form, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AdminSales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/v1/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const sortOrders = (field) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    const sortedOrders = [...orders].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setOrders(sortedOrders);
    setSortField(field);
    setSortDirection(direction);
  };

  const filterOrders = (term) => {
    setFilterTerm(term);
    if (term === '') {
      fetchOrders();
    } else {
      const filteredOrders = orders.filter(order => 
        order.ship_to_name.toLowerCase().includes(term.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(term.toLowerCase()) ||
        order.id.toString().includes(term) ||
        order.paypal_order_id?.toLowerCase().includes(term.toLowerCase()) ||
        order.paypal_transaction_id?.toLowerCase().includes(term.toLowerCase()) ||
        order.shipping_method_name?.toLowerCase().includes(term.toLowerCase())
      );
      setOrders(filteredOrders);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  }

  return (
    <div className="container-fluid my-5">      
      <Form className="mb-4">
        <InputGroup>
          <FormControl
            placeholder="Search by name, email, order ID, PayPal order ID, transaction ID, or shipping method"
            value={filterTerm}
            onChange={(e) => filterOrders(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => filterOrders('')}>Clear</Button>
        </InputGroup>
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
                <th onClick={() => sortOrders('created_at')}>Created At {sortField === 'created_at' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('paid_at')}>Paid At {sortField === 'paid_at' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('ship_to_name')}>Customer {sortField === 'ship_to_name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('final_price')}>Total {sortField === 'final_price' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('shipping_cost')}>Shipping {sortField === 'shipping_cost' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('shipping_method_name')}>Shipping Method {sortField === 'shipping_method_name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('paypal_order_id')}>PayPal Order ID {sortField === 'paypal_order_id' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('paypal_transaction_id')}>PayPal Transaction ID {sortField === 'paypal_transaction_id' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => sortOrders('paypal_payment_status')}>PayPal Status {sortField === 'paypal_payment_status' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{order.paid_at ? new Date(order.paid_at).toLocaleString() : 'Not paid'}</td>
                <td>{order.ship_to_name || order.customer_email}</td>
                <td>${parseFloat(order.final_price).toFixed(2)}</td>
                <td>${parseFloat(order.shipping_cost).toFixed(2)}</td>
                <td>{order.shipping_method_name || 'N/A'}</td>
                <td>{order.paypal_order_id}</td>
                <td>{order.paypal_transaction_id}</td>
                <td>{order.paypal_payment_status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSales;