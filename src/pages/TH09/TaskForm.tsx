import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Tag, Space, Drawer } from 'antd';
import moment from 'moment';
import { Task } from '@/models/task';
import taskService from '@/services/taskService';

interface TaskFormProps {
  visible: boolean;
  taskId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  taskId,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!taskId;

  useEffect(() => {
    if (visible && taskId) {
      const task = taskService.getTaskById(taskId);
      if (task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          tags: task.tags,
          deadline: task.deadline ? moment(task.deadline) : null,
        });
      }
    } else {
      form.resetFields();
    }
  }, [visible, taskId, form]);

  const handleSubmit = async (values: any) => {
    try {
      const deadline = values.deadline ? values.deadline.format('YYYY-MM-DD') : '';
      const taskData = {
        title: values.title,
        description: values.description,
        status: values.status || 'todo',
        priority: values.priority || 'medium',
        tags: values.tags || [],
        deadline,
      };

      if (isEdit && taskId) {
        taskService.updateTask(taskId, taskData);
      } else {
        taskService.addTask(taskData);
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
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

  return (
    <Drawer
      title={isEdit ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Tên Task"
          rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
        >
          <Input placeholder="Nhập tên task" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea
            placeholder="Nhập mô tả task"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Deadline"
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          initialValue="medium"
        >
          <Select>
            {Object.entries(priorityLabels).map(([key, label]) => (
              <Select.Option key={key} value={key}>
                <Tag color={priorityColors[key]}>{label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          initialValue="todo"
        >
          <Select>
            <Select.Option value="todo">Cần làm</Select.Option>
            <Select.Option value="inProgress">Đang làm</Select.Option>
            <Select.Option value="done">Hoàn thành</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tag"
        >
          <Select
            mode="tags"
            placeholder="Thêm tags"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={onClose}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TaskForm;
