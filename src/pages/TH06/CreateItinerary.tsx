import React, { useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  List,
  Space,
  Row,
  Col,
  Popconfirm,
  InputNumber,
  Select,
  Empty,
  message,
  Divider,
  Tag,
  Tabs,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  CalculatorOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Destination, Itinerary, ItineraryItem } from './models';
import { mockDestinations } from './mockData';
import styles from './styles.less';

interface CreateItineraryProps {}

export const CreateItinerary: React.FC<CreateItineraryProps> = () => {
  const [form] = Form.useForm();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<ItineraryItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  const calculateTravelTime = (dest1: Destination, dest2: Destination): number => {
    // Mock calculation: 1 hour per 100km
    return 1;
  };

  const calculateTotalCost = (items: ItineraryItem[]): number => {
    return items.reduce((total, item) => {
      const dest = mockDestinations.find((d) => d.id === item.destinationId);
      if (dest) {
        return (
          total +
          dest.foodCost +
          dest.accommodationCost +
          dest.transportCost
        );
      }
      return total;
    }, 0);
  };

  const handleAddDestination = (destinationId: string, day: number) => {
    const destination = mockDestinations.find((d) => d.id === destinationId);
    if (!destination) {
      message.error('Không tìm thấy địa điểm');
      return;
    }

    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      destinationId,
      destination,
      day,
      orderInDay: 1,
    };

    setSelectedDestinations([...selectedDestinations, newItem]);
  };

  const handleRemoveDestination = (itemId: string) => {
    setSelectedDestinations(selectedDestinations.filter((item) => item.id !== itemId));
  };

  const handleCreateItinerary = async (values: any) => {
    if (selectedDestinations.length === 0) {
      message.error('Vui lòng thêm ít nhất một địa điểm');
      return;
    }

    const startDate = values.dateRange[0];
    const endDate = values.dateRange[1];
    const totalDays = endDate.diff(startDate, 'day') + 1;

    const totalCost = calculateTotalCost(selectedDestinations);

    const newItinerary: Itinerary = {
      id: `iter-${Date.now()}`,
      title: values.title,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      totalDays,
      destinations: selectedDestinations,
      budget: {
        food: selectedDestinations.length * 200000,
        accommodation: selectedDestinations.length * 800000,
        transport: selectedDestinations.length * 150000,
        activities: selectedDestinations.length * 100000,
        other: 100000,
        total: totalCost,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItineraries([...itineraries, newItinerary]);
    setCurrentItinerary(newItinerary);
    setSelectedDestinations([]);
    form.resetFields();
    setShowForm(false);
    message.success('Tạo lịch trình thành công!');
  };

  const groupedByDay = selectedDestinations.reduce(
    (acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = [];
      }
      acc[item.day].push(item);
      return acc;
    },
    {} as Record<number, ItineraryItem[]>
  );

  return (
    <div className={styles.itinerary}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Tạo Lịch Trình Du Lịch" className={styles.formCard}>
            {!showForm ? (
              <Button
                type="primary"
                size="large"
                block
                onClick={() => setShowForm(true)}
              >
                <PlusOutlined /> Tạo Lịch Trình Mới
              </Button>
            ) : (
              <Form form={form} layout="vertical" onFinish={handleCreateItinerary}>
                <Form.Item
                  name="title"
                  label="Tên lịch trình"
                  rules={[{ required: true, message: 'Vui lòng nhập tên lịch trình' }]}
                >
                  <Input placeholder="Chuyến du lịch Hà Nội - Hạ Long" />
                </Form.Item>

                <Form.Item
                  name="dateRange"
                  label="Thời gian"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                >
                  <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Chọn Địa Điểm"
                >
                  <Select
                    placeholder="Chọn địa điểm để thêm"
                    options={mockDestinations.map((d) => ({
                      label: `${d.name} (${d.location})`,
                      value: d.id,
                    }))}
                    onChange={(value) => {
                      const day = Object.keys(groupedByDay).length || 1;
                      handleAddDestination(value, parseInt(day));
                    }}
                  />
                </Form.Item>

                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Lưu Lịch Trình
                  </Button>
                  <Button onClick={() => setShowForm(false)}>Hủy</Button>
                </Space>
              </Form>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Địa Điểm Đã Chọn" className={styles.selectedCard}>
            {selectedDestinations.length === 0 ? (
              <Empty description="Chưa chọn địa điểm nào" />
            ) : (
              <div>
                <Tabs
                  items={Object.entries(groupedByDay).map(([day, items]) => ({
                    key: day,
                    label: `Ngày ${day}`,
                    children: (
                      <List
                        dataSource={items}
                        renderItem={(item) => {
                          const dest = mockDestinations.find(
                            (d) => d.id === item.destinationId
                          );
                          return (
                            <List.Item
                              actions={[
                                <Popconfirm
                                  title="Xóa địa điểm?"
                                  onConfirm={() => handleRemoveDestination(item.id)}
                                >
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                  />
                                </Popconfirm>,
                              ]}
                            >
                              <List.Item.Meta
                                title={dest?.name}
                                description={
                                  <Space direction="vertical" size={0}>
                                    <span>{dest?.location}</span>
                                    <Tag>{dest?.type}</Tag>
                                    <span>
                                      Chi phí: {dest?.basePrice.toLocaleString()} VNĐ
                                    </span>
                                  </Space>
                                }
                              />
                            </List.Item>
                          );
                        }}
                      />
                    ),
                  }))}
                />

                <Divider />

                <div className={styles.costSummary}>
                  <h3>
                    <CalculatorOutlined /> Tổng Chi Phí
                  </h3>
                  <div className={styles.costItem}>
                    <span>Tổng cộng:</span>
                    <strong>{calculateTotalCost(selectedDestinations).toLocaleString()} VNĐ</strong>
                  </div>
                  <div className={styles.costItem}>
                    <span>Số địa điểm:</span>
                    <strong>{selectedDestinations.length}</strong>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Itineraries List */}
      <Card title="Lịch Trình Đã Tạo" style={{ marginTop: 24 }}>
        {itineraries.length === 0 ? (
          <Empty description="Chưa có lịch trình nào" />
        ) : (
          <List
            dataSource={itineraries}
            renderItem={(itinerary) => (
              <List.Item
                actions={[
                  <Button type="link">Xem chi tiết</Button>,
                  <Button type="link" danger>
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={itinerary.title}
                  description={`${itinerary.startDate} - ${itinerary.endDate} (${itinerary.totalDays} ngày) | Tổng chi phí: ${itinerary.budget.total.toLocaleString()} VNĐ`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};
