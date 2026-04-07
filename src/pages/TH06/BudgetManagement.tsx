import React, { useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Alert,
  Progress,
  Empty,
  Divider,
  Space,
} from 'antd';
import {
  DollarOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  HomeOutlined,
  CoffeeOutlined,
  FundOutlined,
} from '@ant-design/icons';
import { BudgetBreakdown, BudgetAlert } from './models';
import styles from './styles.less';

interface BudgetManagementProps {
  budgets?: BudgetBreakdown[];
}

// Simple mock chart component (you can replace with echarts/recharts)
const BudgetChart: React.FC<{ data: BudgetBreakdown }> = ({ data }) => {
  const total = data.total || 1;
  const categories = [
    { name: 'Ăn Uống', value: data.food, icon: <CoffeeOutlined /> },
    { name: 'Lưu Trú', value: data.accommodation, icon: <HomeOutlined /> },
    { name: 'Di Chuyển', value: data.transport, icon: <CarOutlined /> },
    { name: 'Hoạt Động', value: data.activities, icon: <FundOutlined /> },
    { name: 'Khác', value: data.other, icon: <ShoppingOutlined /> },
  ];

  return (
    <div>
      {categories.map((cat, idx) => {
        const percentage = (cat.value / total) * 100;
        return (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>
                {cat.icon} {cat.name}
              </span>
              <span>
                {cat.value.toLocaleString()} VNĐ ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress percent={Math.round(percentage)} />
          </div>
        );
      })}
    </div>
  );
};

export const BudgetManagement: React.FC<BudgetManagementProps> = ({ budgets = [] }) => {
  // Mock data
  const mockBudget: BudgetBreakdown = {
    food: 1500000,
    accommodation: 3200000,
    transport: 800000,
    activities: 500000,
    other: 300000,
    total: 6300000,
  };

  const totalBudget = 7000000;
  const usedBudget = mockBudget.total;
  const remainingBudget = totalBudget - usedBudget;
  const budgetUsagePercent = (usedBudget / totalBudget) * 100;

  const budgetAlerts: BudgetAlert[] = [
    {
      id: '1',
      category: 'accommodation',
      limit: 3000000,
      current: 3200000,
      exceeded: true,
    },
    {
      id: '2',
      category: 'food',
      limit: 1800000,
      current: 1500000,
      exceeded: false,
    },
  ];

  const categoryDetails = [
    {
      key: 'food',
      name: 'Ăn Uống',
      icon: <CoffeeOutlined />,
      amount: mockBudget.food,
      limit: 1800000,
      icon_color: '#1890ff',
    },
    {
      key: 'accommodation',
      name: 'Lưu Trú',
      icon: <HomeOutlined />,
      amount: mockBudget.accommodation,
      limit: 3000000,
      icon_color: '#52c41a',
    },
    {
      key: 'transport',
      name: 'Di Chuyển',
      icon: <CarOutlined />,
      amount: mockBudget.transport,
      limit: 1000000,
      icon_color: '#faad14',
    },
    {
      key: 'activities',
      name: 'Hoạt Động',
      icon: <FundOutlined />,
      amount: mockBudget.activities,
      limit: 600000,
      icon_color: '#f5222d',
    },
    {
      key: 'other',
      name: 'Khác',
      icon: <ShoppingOutlined />,
      amount: mockBudget.other,
      limit: 500000,
      icon_color: '#722ed1',
    },
  ];

  return (
    <div className={styles.budget}>
      {/* Summary Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Ngân Sách"
              value={totalBudget}
              suffix="VNĐ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã Chi"
              value={usedBudget}
              suffix="VNĐ"
              valueStyle={{ color: '#f5222d', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Còn Lại"
              value={remainingBudget}
              suffix="VNĐ"
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ Lệ Sử Dụng"
              value={budgetUsagePercent}
              suffix="%"
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Budget Usage Progress */}
      <Card style={{ marginTop: 16 }} title="Tỷ Lệ Sử Dụng Ngân Sách">
        <Progress
          percent={Math.round(budgetUsagePercent)}
          strokeColor={budgetUsagePercent > 90 ? '#f5222d' : '#1890ff'}
          format={(percent) => `${percent}%`}
        />
        <Divider />
        <div>
          Đã sử dụng: <strong>{usedBudget.toLocaleString()} VNĐ</strong> / Tổng thể:{' '}
          <strong>{totalBudget.toLocaleString()} VNĐ</strong>
        </div>
      </Card>

      {/* Alerts */}
      {budgetAlerts.filter((a) => a.exceeded).length > 0 && (
        <Card style={{ marginTop: 16 }}>
          {budgetAlerts
            .filter((a) => a.exceeded)
            .map((alert) => (
              <Alert
                key={alert.id}
                message={`⚠️ Đã vượt ngân sách ${alert.category}`}
                description={`Đã chi: ${alert.current.toLocaleString()} VNĐ / Giới hạn: ${alert.limit.toLocaleString()} VNĐ`}
                type="warning"
                style={{ marginBottom: '8px' }}
                showIcon
              />
            ))}
        </Card>
      )}

      {/* Category Breakdown */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Phân Bổ Chi Phí Theo Hạng Mục">
            <BudgetChart data={mockBudget} />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Chi Tiết Từng Hạng Mục">
            <Table
              dataSource={categoryDetails}
              columns={[
                {
                  title: 'Hạng Mục',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <span>
                      <span style={{ color: record.icon_color, marginRight: '8px' }}>
                        {record.icon}
                      </span>
                      {text}
                    </span>
                  ),
                },
                {
                  title: 'Đã Chi',
                  dataIndex: 'amount',
                  key: 'amount',
                  align: 'right' as const,
                  render: (val) => <strong>{val.toLocaleString()}</strong>,
                },
                {
                  title: 'Giới Hạn',
                  dataIndex: 'limit',
                  key: 'limit',
                  align: 'right' as const,
                  render: (val) => val.toLocaleString(),
                },
                {
                  title: 'Trạng Thái',
                  key: 'status',
                  align: 'center' as const,
                  render: (_, record) => {
                    const exceeded = record.amount > record.limit;
                    return exceeded ? (
                      <AlertOutlined style={{ color: '#f5222d' }} title="Vượt giới hạn" />
                    ) : (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    );
                  },
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Budget Tips */}
      <Card style={{ marginTop: 16 }} title="💡 Mẹo Tiết Kiệm">
        <Space direction="vertical">
          <p>✓ Đặt phòng trước để nhận giá tốt hơn</p>
          <p>✓ Sử dụng phương tiện công cộng thay vì taxi</p>
          <p>✓ Ăn tại các quán địa phương thay vì nhà hàng du lịch</p>
          <p>✓ Tìm các gói tour combo để tiết kiệm chi phí</p>
          <p>✓ Lên kế hoạch trước để tránh chi phí phát sinh</p>
        </Space>
      </Card>
    </div>
  );
};
