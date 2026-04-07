import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Row,
  Col,
  Card,
  Statistic,
  Space,
  Popconfirm,
  Tag,
  Tabs,
  message,
  Progress,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  HomeOutlined,
  CarOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';

import { Destination, StatisticsData } from './models';
import { mockDestinations } from './mockData';
import styles from './styles.less';

interface AdminProps {}

export const Admin: React.FC<AdminProps> = () => {
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Mock statistics data
  const mockStats: StatisticsData = {
    totalItineraries: 156,
    totalRevenue: 45600000,
    popularDestinations: [
      { destination: mockDestinations[0], count: 45 },
      { destination: mockDestinations[1], count: 38 },
      { destination: mockDestinations[3], count: 35 },
    ],
    monthlyItineraries: [
      { month: 'Jan', count: 10 },
      { month: 'Feb', count: 15 },
      { month: 'Mar', count: 25 },
      { month: 'Apr', count: 32 },
      { month: 'May', count: 28 },
      { month: 'Jun', count: 46 },
    ],
    budgetByCategory: {
      food: 3600000,
      accommodation: 8900000,
      transport: 2400000,
      activities: 2100000,
      other: 600000,
      total: 17700000,
    },
  };

  const handleAddDestination = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditDestination = (record: Destination) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteDestination = (id: string) => {
    setDestinations(destinations.filter((d) => d.id !== id));
    message.success('Xóa địa điểm thành công');
  };

  const handleSaveDestination = async (values: any) => {
    if (editingId) {
      setDestinations(
        destinations.map((d) => (d.id === editingId ? { ...d, ...values } : d))
      );
      message.success('Cập nhật địa điểm thành công');
    } else {
      const newDestination: Destination = {
        id: `dest-${Date.now()}`,
        ...values,
        image: values.image || 'https://via.placeholder.com/400x300',
      };
      setDestinations([...destinations, newDestination]);
      message.success('Thêm địa điểm thành công');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Tên Địa Điểm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Destination) => (
        <div>
          <div>{text}</div>
          <small style={{ color: '#999' }}>{record.location}</small>
        </div>
      ),
    },
    {
      title: 'Loại Hình',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Đánh Giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `⭐ ${rating}/5`,
    },
    {
      title: 'Giá Cơ Bản',
      dataIndex: 'basePrice',
      key: 'basePrice',
      align: 'right' as const,
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Thời Gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration}h`,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (_, record: Destination) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditDestination(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa địa điểm?"
            description="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteDestination(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.admin}>
      <Tabs
        items={[
          {
            key: 'destinations',
            label: 'Quản Lý Địa Điểm',
            children: (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddDestination}
                  >
                    Thêm Địa Điểm Mới
                  </Button>
                </div>

                <Table
                  columns={columns}
                  dataSource={destinations}
                  rowKey="id"
                  scroll={{ x: true }}
                  pagination={{ pageSize: 10 }}
                />

                <Modal
                  title={editingId ? 'Sửa Địa Điểm' : 'Thêm Địa Điểm Mới'}
                  open={isModalVisible}
                  onOk={() => form.submit()}
                  onCancel={() => setIsModalVisible(false)}
                  width={600}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveDestination}
                  >
                    <Form.Item
                      name="name"
                      label="Tên Địa Điểm"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="location"
                      label="Vị Trí"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Mô Tả"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="type"
                          label="Loại Hình"
                          rules={[{ required: true }]}
                        >
                          <Select
                            options={[
                              { label: 'Biển', value: 'beach' },
                              { label: 'Núi', value: 'mountain' },
                              { label: 'Thành Phố', value: 'city' },
                              { label: 'Thiên Nhiên', value: 'nature' },
                              { label: 'Văn Hóa', value: 'cultural' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="rating"
                          label="Đánh Giá"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={1} max={5} step={0.1} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="basePrice"
                          label="Giá Cơ Bản (VNĐ)"
                          rules={[{ required: true }]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="duration"
                          label="Thời Gian Tham Quan (giờ)"
                          rules={[{ required: true }]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="foodCost"
                          label="Chi Phí Ăn Uống (VNĐ)"
                          rules={[{ required: true }]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="accommodationCost"
                          label="Chi Phí Lưu Trú (VNĐ)"
                          rules={[{ required: true }]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="transportCost"
                      label="Chi Phí Di Chuyển (VNĐ)"
                      rules={[{ required: true }]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            ),
          },
          {
            key: 'statistics',
            label: 'Thống Kê & Báo Cáo',
            children: (
              <div>
                {/* Summary Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Tổng Lịch Trình"
                        value={mockStats.totalItineraries}
                        prefix={<ShoppingOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Tổng Doanh Thu"
                        value={mockStats.totalRevenue}
                        suffix="VNĐ"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Địa Điểm"
                        value={destinations.length}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Đánh Giá Cao Nhất"
                        value={Math.max(...destinations.map((d) => d.rating))}
                        suffix="⭐"
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Charts */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="📈 Lịch Trình Theo Tháng">
                      {mockStats.monthlyItineraries.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{item.month}</span>
                            <strong>{item.count} lịch</strong>
                          </div>
                          <Progress percent={Math.min((item.count / 50) * 100, 100)} />
                        </div>
                      ))}
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="📊 Chi Phí Theo Hạng Mục">
                      <div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>🍔 Ăn Uống</span>
                            <strong>{mockStats.budgetByCategory.food.toLocaleString()} VNĐ</strong>
                          </div>
                          <Progress percent={Math.round((mockStats.budgetByCategory.food / mockStats.totalRevenue) * 100)} strokeColor="#1890ff" />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>🏨 Lưu Trú</span>
                            <strong>{mockStats.budgetByCategory.accommodation.toLocaleString()} VNĐ</strong>
                          </div>
                          <Progress percent={Math.round((mockStats.budgetByCategory.accommodation / mockStats.totalRevenue) * 100)} strokeColor="#52c41a" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>🚗 Di Chuyển</span>
                            <strong>{mockStats.budgetByCategory.transport.toLocaleString()} VNĐ</strong>
                          </div>
                          <Progress percent={Math.round((mockStats.budgetByCategory.transport / mockStats.totalRevenue) * 100)} strokeColor="#faad14" />
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Popular Destinations */}
                <Card title="🏆 Địa Điểm Phổ Biến" style={{ marginTop: 16 }}>
                  <Table
                    dataSource={mockStats.popularDestinations}
                    columns={[
                      {
                        title: 'Địa Điểm',
                        dataIndex: ['destination', 'name'],
                        key: 'name',
                      },
                      {
                        title: 'Số Lần Chọn',
                        dataIndex: 'count',
                        key: 'count',
                        align: 'right' as const,
                        render: (count: number) => <strong>{count}</strong>,
                      },
                    ]}
                    pagination={false}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
