import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Space } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import taskService from '@/services/taskService';
import { TaskStats } from '@/models/task';

interface DashboardProps {
  onRefresh?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onRefresh }) => {
  const [stats, setStats] = useState<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  const loadStats = () => {
    const newStats = taskService.getStats();
    setStats(newStats);
    onRefresh?.();
  };

  useEffect(() => {
    loadStats();
  }, []);

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn reset về dữ liệu mặc định?')) {
      taskService.resetToDefault();
      loadStats();
    }
  };

  const handleClear = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả tasks?')) {
      taskService.clearAllTasks();
      loadStats();
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số tasks"
              value={stats.totalTasks}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tasks hoàn thành"
              value={stats.completedTasks}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tasks quá hạn"
              value={stats.overdueTasks}
              prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={completionRate}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Hành động">
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadStats}
          >
            Làm mới thống kê
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset dữ liệu mặc định
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleClear}>
            Xóa tất cả
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
