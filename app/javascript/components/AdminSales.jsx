import React, { useState, useEffect, useCallback } from 'react';
import { Table, Form, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AdminSales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total_order_count: 0, total_revenue: 0, completed_count: 0 });

  const fetchOrders = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/orders', {
        params: { page, per_page: 20, search: search || undefined }
      });
      setOrders(response.data.orders);
      setCurrentPage(response.data.meta.page);
      setTotalPages(response.data.meta.total_pages);
      setTotalCount(response.data.meta.total_count);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  useEffect(() => {
    const debounce = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders(1, filterTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [filterTerm, fetchOrders]);

  const handlePageChange = (page) => {
    fetchOrders(page, filterTerm);
  };

  const handleRefresh = () => {
    setFilterTerm('');
    fetchOrders(1, '');
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  return (
    <div className="p-4">
      <style>{`
        .clickable-row {
          transition: background-color 0.2s ease;
        }
        .clickable-row:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
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
              <h3 className="font-weight-bold">{stats.total_order_count}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 bg-gradient-success text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-dollar-sign fa-2x mb-2"></i>
              <h6 className="text-uppercase">Revenue</h6>
              <h3 className="font-weight-bold">${formatCurrency(stats.total_revenue)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 bg-gradient-info text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <h6 className="text-uppercase">Completed</h6>
              <h3 className="font-weight-bold">{stats.completed_count}</h3>
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
              <Form onSubmit={(e) => e.preventDefault()}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-search text-muted"></i>
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search orders by name, email, order ID, PayPal ID, or shipping method..."
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                  />
                  {filterTerm && (
                    <Button variant="outline-secondary" onClick={() => setFilterTerm('')}>
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </InputGroup>
              </Form>
            </div>
            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <small className="text-muted">
                Showing {orders.length} of {totalCount} order{totalCount !== 1 ? 's' : ''}
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
                    Payment {sortField === 'paypal_payment_status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => sortOrders('order_status')} className="border-0">
                  <div className="d-flex align-items-center">
                    Fulfillment {sortField === 'order_status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>}
                  </div>
                </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No orders found{filterTerm ? ` matching "${filterTerm}"` : ''}.
                </td>
              </tr>
            ) : (
              orders.map(order => (
              <tr
                key={order.id}
                className="align-middle clickable-row"
                style={{cursor: 'pointer'}}
                onClick={() => window.location.href = `/admin/orders/${order.id}`}
              >
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
                  <div className="fw-bold text-success">${formatCurrency(order.final_price)}</div>
                  <div className="text-xs text-muted">PayPal: {order.paypal_transaction_id ? order.paypal_transaction_id.slice(-8) : 'N/A'}</div>
                </td>
                <td>
                  <div>${formatCurrency(order.shipping_cost)}</div>
                  <div className="text-xs text-muted">{order.shipping_method_name || 'Standard'}</div>
                </td>
                <td>
                  <span className={`badge ${order.paypal_payment_status === 'COMPLETED' ? 'bg-success' :
                    order.paypal_payment_status === 'PENDING' ? 'bg-warning' : 'bg-secondary'}`}>
                    {order.paypal_payment_status || 'Processing'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${order.order_status === 'shipped' ? 'bg-success' : 'bg-info'}`}>
                    {order.order_status ? order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) : 'Pending'}
                  </span>
                </td>
              </tr>
            )))}
          </tbody>
        </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Page {currentPage} of {totalPages}
            </small>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage <= 1 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="fas fa-chevron-left me-1"></i> Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage >= totalPages || loading}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <i className="fas fa-chevron-right ms-1"></i>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSales;
