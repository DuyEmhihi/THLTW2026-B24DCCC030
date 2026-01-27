import { Modal, Button, Form, Input, InputNumber, Table, message, Popconfirm, Space, Tabs, Card, Statistic, Tag, Select, Slider, DatePicker, Row, Col } from 'antd';
const { TabPane } = Tabs;
import { ShoppingOutlined, DollarOutlined, ShoppingCartOutlined, FileTextOutlined } from '@ant-design/icons';
import { useState, useEffect, useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import './style.less';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

// Helper Functions
const getStatusTag = (quantity: number) => {
  if (quantity > 10) return <Tag color="green">Còn hàng</Tag>;
  if (quantity > 0) return <Tag color="orange">Sắp hết</Tag>;
  return <Tag color="red">Hết hàng</Tag>;
};

const getOrderStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'Chờ xử lý': 'gold',
    'Đang giao': 'blue',
    'Hoàn thành': 'green',
    'Đã hủy': 'red',
  };
  return colors[status] || 'default';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `DH${timestamp}${random}`.slice(0, 10);
};

const Bai2 = () => {
  // Product Management
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  
  // Modal & UI States
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Filter States
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 35000000]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [productSort, setProductSort] = useState<string>('');
  const [productPage, setProductPage] = useState(1);

  // Order Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | undefined>(undefined);
  const [orderSort, setOrderSort] = useState<string>('');
  const [orderPage, setOrderPage] = useState(1);

  // LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);
    setOrders(savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Product Methods
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  const handleAddProduct = (values: any) => {
    if (editingProduct) {
      setProducts(products.map(p => (p.id === editingProduct.id ? { ...p, ...values } : p)));
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...values,
      };
      setProducts([...products, newProduct]);
      message.success('Thêm sản phẩm thành công!');
    }
    productForm.resetFields();
    setProductModalVisible(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.setFieldsValue(product);
    setProductModalVisible(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesStatus = !statusFilter || 
        (statusFilter === 'Còn hàng' && p.quantity > 10) ||
        (statusFilter === 'Sắp hết' && p.quantity > 0 && p.quantity <= 10) ||
        (statusFilter === 'Hết hàng' && p.quantity === 0);
      return matchesSearch && matchesCategory && matchesPrice && matchesStatus;
    });

    if (productSort) {
      filtered.sort((a, b) => {
        if (productSort === 'name-asc') return a.name.localeCompare(b.name);
        if (productSort === 'name-desc') return b.name.localeCompare(a.name);
        if (productSort === 'price-asc') return a.price - b.price;
        if (productSort === 'price-desc') return b.price - a.price;
        if (productSort === 'qty-asc') return a.quantity - b.quantity;
        if (productSort === 'qty-desc') return b.quantity - a.quantity;
        return 0;
      });
    }

    return filtered;
  }, [products, productSearch, categoryFilter, priceRange, statusFilter, productSort]);

  const productColumns = [
    { title: 'STT', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    { title: 'Số lượng tồn kho', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Trạng thái',
      dataIndex: 'quantity',
      key: 'status',
      render: (quantity: number) => getStatusTag(quantity),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space>
          <a onClick={() => handleEditProduct(record)}>Sửa</a>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteProduct(record.id)}>
            <a style={{ color: 'red' }}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Order Methods
  const handleCreateOrder = (values: any) => {
    const selectedProducts = values.products || [];
    const productDetails = selectedProducts.map((productId: number) => {
      const product = products.find(p => p.id === productId);
      const qty = values[`qty_${productId}`];
      return {
        productId,
        productName: product?.name || '',
        quantity: qty,
        price: product?.price || 0,
      };
    });

    const totalAmount = productDetails.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0);

    const newOrder: Order = {
      id: generateOrderId(),
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: productDetails,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: dayjs().format('YYYY-MM-DD'),
    };

    setOrders([...orders, newOrder]);
    message.success('Tạo đơn hàng thành công!');
    orderForm.resetFields();
    setOrderModalVisible(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const oldStatus = order.status;
        const updatedOrder = { ...order, status: newStatus as Order['status'] };

        if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
          // Trừ số lượng tồn kho
          let updatedProducts = [...products];
          order.products.forEach(op => {
            updatedProducts = updatedProducts.map(p =>
              p.id === op.productId ? { ...p, quantity: p.quantity - op.quantity } : p
            );
          });
          setProducts(updatedProducts);
        } else if (newStatus === 'Đã hủy' && oldStatus === 'Hoàn thành') {
          // Hoàn trả số lượng
          let updatedProducts = [...products];
          order.products.forEach(op => {
            updatedProducts = updatedProducts.map(p =>
              p.id === op.productId ? { ...p, quantity: p.quantity + op.quantity } : p
            );
          });
          setProducts(updatedProducts);
        }

        return updatedOrder;
      }
      return order;
    }));
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(o => {
      const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = !orderStatusFilter || o.status === orderStatusFilter;
      const matchesDate = !dateRange || !dateRange[0] || !dateRange[1] ||
        (dayjs(o.createdAt).isSameOrAfter(dateRange[0], 'day') &&
          dayjs(o.createdAt).isSameOrBefore(dateRange[1], 'day'));
      return matchesSearch && matchesStatus && matchesDate;
    });

    if (orderSort) {
      filtered.sort((a, b) => {
        if (orderSort === 'date-new') return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
        if (orderSort === 'date-old') return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
        if (orderSort === 'amount-asc') return a.totalAmount - b.totalAmount;
        if (orderSort === 'amount-desc') return b.totalAmount - a.totalAmount;
        return 0;
      });
    }

    return filtered;
  }, [orders, orderSearch, orderStatusFilter, dateRange, orderSort]);

  const orderColumns = [
    { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
    { title: 'Tên khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Số sản phẩm', dataIndex: 'products', key: 'productCount', render: (products: any[]) => products.length },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Order) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleUpdateOrderStatus(record.id, value)}
          options={[
            { label: 'Chờ xử lý', value: 'Chờ xử lý' },
            { label: 'Đang giao', value: 'Đang giao' },
            { label: 'Hoàn thành', value: 'Hoàn thành' },
            { label: 'Đã hủy', value: 'Đã hủy' },
          ]}
        />
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Order) => (
        <a onClick={() => {
          setSelectedOrder(record);
          setOrderDetailVisible(true);
        }}>
          Xem chi tiết
        </a>
      ),
    },
  ];

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalOrders = orders.length;
    const revenue = orders
      .filter(o => o.status === 'Hoàn thành')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalProducts, totalInventoryValue, totalOrders, revenue };
  }, [products, orders]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        <ShoppingOutlined style={{ fontSize: 28, color: '#1890ff' }} />
        <h2 style={{ margin: 0 }}>Quản lý Sản phẩm & Đơn hàng</h2>
      </div>

      {/* Dashboard */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={stats.totalInventoryValue}
              prefix={<DollarOutlined />}
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs>
        <TabPane key="1" tab="Quản lý Sản phẩm">
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => {
                setEditingProduct(null);
                productForm.resetFields();
                setProductModalVisible(true);
              }}>
                Thêm sản phẩm
              </Button>
            </div>

            {/* Product Filters */}
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Input.Search
                    placeholder="Tìm kiếm sản phẩm..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProductPage(1);
                    }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Select
                    placeholder="Chọn danh mục"
                    allowClear
                    value={categoryFilter}
                    onChange={(value) => {
                      setCategoryFilter(value);
                      setProductPage(1);
                    }}
                    options={categories.map(cat => ({ label: cat, value: cat }))}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    value={statusFilter}
                    onChange={(value) => {
                      setStatusFilter(value);
                      setProductPage(1);
                    }}
                    options={[
                      { label: 'Còn hàng', value: 'Còn hàng' },
                      { label: 'Sắp hết', value: 'Sắp hết' },
                      { label: 'Hết hàng', value: 'Hết hàng' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Select
                    placeholder="Sắp xếp"
                    allowClear
                    value={productSort}
                    onChange={(value) => {
                      setProductSort(value);
                      setProductPage(1);
                    }}
                    options={[
                      { label: 'Tên (A-Z)', value: 'name-asc' },
                      { label: 'Tên (Z-A)', value: 'name-desc' },
                      { label: 'Giá (thấp-cao)', value: 'price-asc' },
                      { label: 'Giá (cao-thấp)', value: 'price-desc' },
                      { label: 'Số lượng (tăng)', value: 'qty-asc' },
                      { label: 'Số lượng (giảm)', value: 'qty-desc' },
                    ]}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <label>Khoảng giá:</label>
                <Slider
                  range
                  min={0}
                  max={35000000}
                  step={1000000}
                  value={priceRange}
                  onChange={(value) => {
                    setPriceRange(value as [number, number]);
                    setProductPage(1);
                  }}
                  marks={{
                    0: '0',
                    35000000: '35M',
                  }}
                />
              </div>
            </Card>

            <Table
              columns={productColumns}
              dataSource={filteredAndSortedProducts}
              rowKey="id"
              pagination={{ pageSize: 5, current: productPage, onChange: setProductPage }}
            />
          </div>
        </TabPane>
        <TabPane key="2" tab="Quản lý Đơn hàng">
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => {
                orderForm.resetFields();
                setOrderModalVisible(true);
              }}>
                Tạo đơn hàng mới
              </Button>
            </div>

            {/* Order Filters */}
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Input.Search
                    placeholder="Tìm kiếm đơn hàng..."
                    value={orderSearch}
                    onChange={(e) => {
                      setOrderSearch(e.target.value);
                      setOrderPage(1);
                    }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Select
                    placeholder="Lọc trạng thái"
                    allowClear
                    value={orderStatusFilter}
                    onChange={(value) => {
                      setOrderStatusFilter(value);
                      setOrderPage(1);
                    }}
                    options={[
                      { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                      { label: 'Đang giao', value: 'Đang giao' },
                      { label: 'Hoàn thành', value: 'Hoàn thành' },
                      { label: 'Đã hủy', value: 'Đã hủy' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <DatePicker.RangePicker
                    value={dateRange as any}
                    onChange={(dates) => {
                      setDateRange(dates as [Dayjs | null, Dayjs | null] | undefined);
                      setOrderPage(1);
                    }}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Select
                    placeholder="Sắp xếp"
                    allowClear
                    value={orderSort}
                    onChange={(value) => {
                      setOrderSort(value);
                      setOrderPage(1);
                    }}
                    options={[
                      { label: 'Ngày (mới-cũ)', value: 'date-new' },
                      { label: 'Ngày (cũ-mới)', value: 'date-old' },
                      { label: 'Tiền (thấp-cao)', value: 'amount-asc' },
                      { label: 'Tiền (cao-thấp)', value: 'amount-desc' },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            <Table
              columns={orderColumns}
              dataSource={filteredAndSortedOrders}
              rowKey="id"
              pagination={{ pageSize: 5, current: orderPage, onChange: setOrderPage }}
            />
          </div>
        </TabPane>
      </Tabs>

      {/* Product Modal */}
      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={productModalVisible}
        onCancel={() => {
          setProductModalVisible(false);
          setEditingProduct(null);
          productForm.resetFields();
        }}
        footer={null}
      >
        <Form form={productForm} onFinish={handleAddProduct} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục" options={categories.map(cat => ({ label: cat, value: cat }))} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: 'Vui lòng nhập giá!' },
              { type: 'number', min: 1, message: 'Giá phải lớn hơn 0!' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Nhập giá" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 0, message: 'Số lượng không được âm!' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingProduct ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Order Modal */}
      <Modal
        title="Tạo đơn hàng mới"
        visible={orderModalVisible}
        onCancel={() => {
          setOrderModalVisible(false);
          orderForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={orderForm} onFinish={handleCreateOrder} layout="vertical">
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải từ 10-11 số!' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ" rows={2} />
          </Form.Item>
          <Form.Item
            name="products"
            label="Chọn sản phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              options={products.map(p => ({ label: p.name, value: p.id }))}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.products !== currentValues.products}>
            {({ getFieldValue }) => {
              const selectedProducts = getFieldValue('products') || [];
              return (
                <div>
                  {selectedProducts.map((productId: number) => {
                    const product = products.find(p => p.id === productId);
                    return (
                      <Form.Item
                        key={productId}
                        name={`qty_${productId}`}
                        label={`Số lượng - ${product?.name}`}
                        rules={[
                          { required: true, message: 'Vui lòng nhập số lượng!' },
                          { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
                          {
                            validator: (_, value) => {
                              if (value && product && value > product.quantity) {
                                return Promise.reject(new Error(`Vượt quá số lượng tồn kho (${product.quantity})!`));
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber style={{ width: '100%' }} min={1} placeholder="Nhập số lượng" />
                      </Form.Item>
                    );
                  })}
                </div>
              );
            }}
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const selectedProducts = getFieldValue('products') || [];
              const total = selectedProducts.reduce((sum: number, productId: number) => {
                const product = products.find(p => p.id === productId);
                const qty = getFieldValue(`qty_${productId}`) || 0;
                return sum + (product?.price || 0) * qty;
              }, 0);
              return (
                <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <strong>Tổng tiền: {formatCurrency(total)}</strong>
                </div>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo đơn hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        visible={orderDetailVisible}
        onCancel={() => setOrderDetailVisible(false)}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
            <p><strong>Tên khách hàng:</strong> {selectedOrder.customerName}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <Tag color={getOrderStatusColor(selectedOrder.status)}>{selectedOrder.status}</Tag>
            </p>
            <p><strong>Ngày tạo:</strong> {selectedOrder.createdAt}</p>
            <h4>Danh sách sản phẩm:</h4>
            <Table
              columns={[
                { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
                { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price: number) => formatCurrency(price),
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_: any, record: OrderProduct) =>
                    formatCurrency(record.price * record.quantity),
                },
              ]}
              dataSource={selectedOrder.products}
              rowKey="productId"
              pagination={false}
            />
            <p style={{ marginTop: 16, textAlign: 'right' }}>
              <strong>Tổng cộng: {formatCurrency(selectedOrder.totalAmount)}</strong>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bai2;
