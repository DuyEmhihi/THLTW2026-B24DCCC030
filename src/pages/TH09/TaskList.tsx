import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Popconfirm, Input, Select, Badge, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import taskService from '@/services/taskService';
import { Task } from '@/models/task';

interface TaskListProps {
  onEditTask: (taskId: string) => void;
  refreshKey?: number;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask, refreshKey }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');

  const loadTasks = () => {
    const allTasks = taskService.getAllTasks();
    setTasks(allTasks);
    applyFiltersAndSort(allTasks, searchText, filterStatus, filterPriority, sortBy);
  };

  useEffect(() => {
    loadTasks();
  }, [refreshKey]);

  const applyFiltersAndSort = (
    taskList: Task[],
    search: string,
    status: string,
    priority: string,
    sort: string,
  ) => {
    let filtered = taskList;

    // Lọc theo tên
    if (search) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Lọc theo trạng thái
    if (status !== 'all') {
      filtered = filtered.filter((task) => task.status === status);
    }

    // Lọc theo ưu tiên
    if (priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sort) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFiltersAndSort(tasks, value, filterStatus, filterPriority, sortBy);
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    applyFiltersAndSort(tasks, searchText, value, filterPriority, sortBy);
  };

  const handlePriorityFilter = (value: string) => {
    setFilterPriority(value);
    applyFiltersAndSort(tasks, searchText, filterStatus, value, sortBy);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    applyFiltersAndSort(tasks, searchText, filterStatus, filterPriority, value);
  };

  const handleDeleteTask = (taskId: string) => {
    taskService.deleteTask(taskId);
    loadTasks();
  };

  const priorityColors: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  };

  const priorityLabels = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  };

  const statusLabels: Record<string, string> = {
    todo: 'Cần làm',
    inProgress: 'Đang làm',
    done: 'Hoàn thành',
  };

  const isOverdue = (deadline: string, status: Task['status']) => {
    if (status === 'done') return false;
    return new Date(deadline) < new Date();
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Tên Task',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text: string) => (
        <span style={{ color: '#666', fontSize: 12 }}>{text || '-'}</span>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 120,
      render: (deadline: string, record: Task) => {
        const overdue = isOverdue(deadline, record.status);
        return (
          <span style={{ color: overdue ? '#ff4d4f' : 'inherit' }}>
            {overdue && <ClockCircleOutlined style={{ marginRight: 4 }} />}
            {new Date(deadline).toLocaleDateString('vi-VN')}
          </span>
        );
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={priorityColors[priority]}>{priorityLabels[priority]}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = {
          todo: 'processing',
          inProgress: 'warning',
          done: 'success',
        };
        return <Badge status={colors[status] as any} text={statusLabels[status]} />;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <span>
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <Tag key={tag} color="blue" style={{ marginBottom: 4 }}>
                {tag}
              </Tag>
            ))
          ) : (
            <span style={{ color: '#ccc' }}>-</span>
          )}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditTask(record.id)}
          />
          <Popconfirm
            title="Xóa task"
            description="Bạn có chắc muốn xóa task này?"
            onConfirm={() => handleDeleteTask(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm theo tên hoặc mô tả"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          value={filterStatus}
          onChange={handleStatusFilter}
          style={{ width: 180 }}
        >
          <Select.Option value="all">Tất cả trạng thái</Select.Option>
          <Select.Option value="todo">Cần làm</Select.Option>
          <Select.Option value="inProgress">Đang làm</Select.Option>
          <Select.Option value="done">Hoàn thành</Select.Option>
        </Select>
        <Select
          placeholder="Lọc theo ưu tiên"
          value={filterPriority}
          onChange={handlePriorityFilter}
          style={{ width: 180 }}
        >
          <Select.Option value="all">Tất cả ưu tiên</Select.Option>
          <Select.Option value="high">Cao</Select.Option>
          <Select.Option value="medium">Trung bình</Select.Option>
          <Select.Option value="low">Thấp</Select.Option>
        </Select>
        <Select
          placeholder="Sắp xếp theo"
          value={sortBy}
          onChange={handleSort}
          style={{ width: 150 }}
        >
          <Select.Option value="deadline">Deadline</Select.Option>
          <Select.Option value="priority">Ưu tiên</Select.Option>
          <Select.Option value="created">Mới nhất</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={{ pageSize: 10, total: filteredTasks.length }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default TaskList;
