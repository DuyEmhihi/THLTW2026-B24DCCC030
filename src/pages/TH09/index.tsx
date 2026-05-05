import React, { useState } from 'react';
import { Tabs, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const TH09Page: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenForm = (taskId?: string) => {
    if (taskId) {
      setEditingTaskId(taskId);
    }
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingTaskId(null);
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <Tabs type="card">
        <Tabs.TabPane tab="📊 Dashboard" key="dashboard">
          <Dashboard onRefresh={() => setRefreshKey((prev) => prev + 1)} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="📋 Kanban Board" key="kanban">
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenForm()}
              >
                Thêm Task mới
              </Button>
            </div>
            <KanbanBoard onEditTask={handleOpenForm} refreshKey={refreshKey} />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="📝 Danh sách Task" key="list">
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenForm()}
              >
                Thêm Task mới
              </Button>
            </div>
            <TaskList onEditTask={handleOpenForm} refreshKey={refreshKey} />
          </div>
        </Tabs.TabPane>
      </Tabs>

      <TaskForm
        visible={formVisible}
        taskId={editingTaskId}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default TH09Page;
