import React from 'react';
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
import { BudgetAlert } from './models';
import styles from './styles.less';

interface BudgetManagementProps {
  budgetItems?: BudgetAlert[];
}

// Simple chart component using budget items
const BudgetChart: React.FC<{ budgetItems: BudgetAlert[] }> = ({ budgetItems }) => {
  const total = budgetItems.reduce((sum, item) => sum + item.current, 0) || 1;
  const categories = budgetItems.map(item => {
    const categoryMap = {
      food: { name: 'Ăn Uống', icon: <CoffeeOutlined /> },
      accommodation: { name: 'Lưu Trú', icon: <HomeOutlined /> },
      transport: { name: 'Di Chuyển', icon: <CarOutlined /> },
      activities: { name: 'Hoạt Động', icon: <FundOutlined /> },
      other: { name: 'Khác', icon: <ShoppingOutlined /> },
    };
    const cat = categoryMap[item.category];
    return {
      name: cat.name,
      value: item.current,
      icon: cat.icon,
    };
  });

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

export const BudgetManagement: React.FC<BudgetManagementProps> = ({ budgetItems = [] }) => {

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.limit, 0);
  const usedBudget = budgetItems.reduce((sum, item) => sum + item.current, 0);
  const remainingBudget = totalBudget - usedBudget;
  const budgetUsagePercent = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0;

  const budgetAlerts = budgetItems.filter(item => item.exceeded);

  const categoryDetails = budgetItems.map(item => {
    const categoryMap = {
      food: { name: 'Ăn Uống', icon: <CoffeeOutlined />, color: '#1890ff' },
      accommodation: { name: 'Lưu Trú', icon: <HomeOutlined />, color: '#52c41a' },
      transport: { name: 'Di Chuyển', icon: <CarOutlined />, color: '#faad14' },
      activities: { name: 'Hoạt Động', icon: <FundOutlined />, color: '#722ed1' },
      other: { name: 'Khác', icon: <ShoppingOutlined />, color: '#eb2f96' },
    };
    const cat = categoryMap[item.category];
    return {
      key: item.category,
      name: cat.name,
      icon: cat.icon,
      amount: item.current,
      limit: item.limit,
      icon_color: cat.color,
    };
  });

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
