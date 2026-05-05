import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Tag, Button, Space, Empty, Popconfirm, Row, Col, Badge, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import taskService from '@/services/taskService';
import { Task } from '@/models/task';
import './kanban.less';

interface KanbanBoardProps {
  onEditTask: (taskId: string) => void;
  refreshKey?: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTask, refreshKey }) => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    inProgress: [],
    done: [],
  });

  const loadTasks = () => {
    const allTasks = taskService.getAllTasks();
    const grouped: Record<string, Task[]> = {
      todo: [],
      inProgress: [],
      done: [],
    };

    allTasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });

    setTasks(grouped);
  };

  useEffect(() => {
    loadTasks();
  }, [refreshKey]);

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task['status'];
    taskService.updateTaskStatus(draggableId, newStatus);
    loadTasks();
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

  const isOverdue = (deadline: string, status: Task['status']) => {
    if (status === 'done') return false;
    return new Date(deadline) < new Date();
  };

  const statusConfig = {
    todo: {
      title: '📝 Cần làm',
      color: '#1890ff',
    },
    inProgress: {
      title: '⚙️ Đang làm',
      color: '#faad14',
    },
    done: {
      title: '✅ Hoàn thành',
      color: '#52c41a',
    },
  };

  const renderTaskCard = (task: Task, index: number) => {
    const overdue = isOverdue(task.deadline, task.status);

    return (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              marginBottom: 12,
            }}
          >
            <Card
              size="small"
              className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${
                overdue ? 'overdue' : ''
              }`}
              style={{
                borderLeft: `4px solid ${priorityColors[task.priority]}`,
                opacity: snapshot.isDragging ? 0.5 : 1,
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: '0 0 4px 0',
                        wordBreak: 'break-word',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {task.title}
                    </h4>
                  </div>
                  {overdue && (
                    <Tooltip title="Quá hạn">
                      <ClockCircleOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
                    </Tooltip>
                  )}
                </div>

                {task.description && (
                  <p
                    style={{
                      margin: '4px 0',
                      fontSize: 12,
                      color: '#666',
                      wordBreak: 'break-word',
                    }}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 8 }}>
                <Tag color={priorityColors[task.priority]} style={{ fontSize: 11 }}>
                  {priorityLabels[task.priority]}
                </Tag>
                {task.deadline && (
                  <Tag
                    color={overdue ? 'red' : 'default'}
                    style={{ fontSize: 11, marginLeft: 4 }}
                  >
                    {new Date(task.deadline).toLocaleDateString('vi-VN')}
                  </Tag>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {task.tags.map((tag) => (
                    <Tag key={tag} color="blue" style={{ fontSize: 10 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}

              <Space size="small" style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEditTask(task.id)}
                />
                <Popconfirm
                  title="Xóa task"
                  description="Bạn có chắc muốn xóa task này?"
                  onConfirm={() => handleDeleteTask(task.id)}
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
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row gutter={16} className="kanban-container">
        {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(
          (status) => (
            <Col xs={24} sm={24} lg={8} key={status}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{statusConfig[status].title}</span>
                    <Badge count={tasks[status]?.length || 0} color={statusConfig[status].color} />
                  </div>
                }
                bordered
                style={{
                  borderTop: `3px solid ${statusConfig[status].color}`,
                  minHeight: 600,
                }}
              >
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                      style={{
                        minHeight: 500,
                        backgroundColor: snapshot.isDraggingOver ? '#f0f2f5' : 'transparent',
                        padding: 4,
                        borderRadius: 4,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {tasks[status] && tasks[status].length > 0 ? (
                        tasks[status].map((task, index) => renderTaskCard(task, index))
                      ) : (
                        <Empty
                          description="Không có tasks"
                          style={{ marginTop: 50 }}
                        />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ),
        )}
      </Row>
    </DragDropContext>
  );
};

export default KanbanBoard;
