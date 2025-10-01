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

  const handleRefresh = async () => {
    setLoading(true);
    await fetchOrders();
    setFilterTerm('');
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + parseFloat(order.final_price || 0), 0).toFixed(2);
  };

  return (
    <div className="p-4">
      {/* Controls Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1">Order Management</h5>
          <small className="text-muted">Real-time order tracking and analytics</small>
        </div>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={handleRefresh} 
          disabled={loading}
          className="d-flex align-items-center"
        >
          <i className={`fas fa-sync ${loading ? 'fa-spin' : ''} me-1`}></i>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Live Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 bg-gradient-primary text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-shopping-cart fa-2x mb-2"></i>
              <h6 className="text-uppercase">Total Orders</h6>
              <h3 className="font-weight-bold">{orders.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 bg-gradient-success text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-dollar-sign fa-2x mb-2"></i>
              <h6 className="text-uppercase">Revenue</h6>
              <h3 className="font-weight-bold">${calculateTotalRevenue()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 bg-gradient-info text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <h6 className="text-uppercase">Completed</h6>
              <h3 className="font-weight-bold">{orders.filter(o => o.paypal_payment_status === 'COMPLETED').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 bg-gradient-warning text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-clock fa-2x mb-2"></i>
              <h6 className="text-uppercase">Last Update</h6>
              <small className="font-weight-bold">{new Date().toLocaleTimeString()}</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <Form>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-search text-muted"></i>
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search orders by name, email, order ID, PayPal ID, or shipping method..."
                    value={filterTerm}
                    onChange={(e) => filterOrders(e.target.value)}
                  />
                  {filterTerm && (
                    <Button variant="outline-secondary" onClick={() => filterOrders('')}>
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </InputGroup>
              </Form>
            </div>
            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <small className="text-muted">
                Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h6 className="mb-0">Order Details</h6>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
          <thead className="bg-light">
            <tr>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('created_at')} className="border-0">
                  <div className="d-flex align-items-center">
                    Created At {sortField === 'created_at' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('paid_at')} className="border-0">
                  <div className="d-flex align-items-center">
                    Paid At {sortField === 'paid_at' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('ship_to_name')} className="border-0">
                  <div className="d-flex align-items-center">
                    Customer {sortField === 'ship_to_name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('final_price')} className="border-0">
                  <div className="d-flex align-items-center">
                    Total {sortField === 'final_price' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('shipping_cost')} className="border-0">
                  <div className="d-flex align-items-center">
                    Shipping {sortField === 'shipping_cost' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('paypal_payment_status')} className="border-0">
                  <div className="d-flex align-items-center">
                    Status {sortField === 'paypal_payment_status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="align-middle">
                <td>
                  <div className="small text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </div>
                </td>
                <td>
                  {order.paid_at ? (
                    <div>
                      <div className="small">{new Date(order.paid_at).toLocaleDateString()}</div>
                      <div className="text-xs text-muted">{new Date(order.paid_at).toLocaleTimeString()}</div>
                    </div>
                  ) : (
                    <span className="badge bg-warning">Pending</span>
                  )}
                </td>
                <td>
                  <div className="fw-bold">{order.ship_to_name}</div>
                  <div className="small text-muted">{order.customer_email}</div>
                  <div className="text-xs text-muted">Order #{order.id.toString().padStart(6, '0')}</div>
                </td>
                <td>
                  <div className="fw-bold text-success">${parseFloat(order.final_price || 0).toFixed(2)}</div>
                  <div className="text-xs text-muted">PayPal: {order.paypal_transaction_id ? order.paypal_transaction_id.slice(-8) : 'N/A'}</div>
                </td>
                <td>
                  <div>${parseFloat(order.shipping_cost || 0).toFixed(2)}</div>
                  <div className="text-xs text-muted">{order.shipping_method_name || 'Standard'}</div>
                </td>
                <td>
                  <span className={`badge ${order.paypal_payment_status === 'COMPLETED' ? 'bg-success' : 
                    order.paypal_payment_status === 'PENDING' ? 'bg-warning' : 'bg-secondary'}`}>
                    {order.paypal_payment_status || 'Processing'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;