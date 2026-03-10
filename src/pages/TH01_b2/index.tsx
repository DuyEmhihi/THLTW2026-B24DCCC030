import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  List,
  Space,
  message,
  Table,
  Tabs,
  DatePicker,
  TimePicker,
  InputNumber,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

interface Category {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  categoryId: string;
  datetime: string; // ISO
  duration: number; // minutes
  content: string;
  note?: string;
}

interface Goal {
  id: string;
  categoryId?: string; // undefined means total
  month: string; // YYYY-MM
  targetMinutes: number;
}

const STORAGE_KEYS = {
  categories: 'studyCategories',
  schedules: 'studySchedules',
  goals: 'studyGoals',
};

const TH02: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // modals state
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [catForm] = Form.useForm();
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [schedModalVisible, setSchedModalVisible] = useState(false);
  const [schedForm] = Form.useForm();
  const [editingSched, setEditingSched] = useState<Schedule | null>(null);

  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalForm] = Form.useForm();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // load from localStorage
  useEffect(() => {
    const cats = localStorage.getItem(STORAGE_KEYS.categories);
    const schs = localStorage.getItem(STORAGE_KEYS.schedules);
    const gsl = localStorage.getItem(STORAGE_KEYS.goals);
    if (cats) setCategories(JSON.parse(cats));
    if (schs) setSchedules(JSON.parse(schs));
    if (gsl) setGoals(JSON.parse(gsl));
  }, []);

  // persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.schedules, JSON.stringify(schedules));
  }, [schedules]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  }, [goals]);

  // helpers
  const addOrUpdateCategory = (values: any) => {
    if (editingCat) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCat.id ? { ...c, name: values.name } : c))
      );
      message.success('Cập nhật danh mục thành công');
    } else {
      const newCat: Category = { id: Date.now().toString(), name: values.name };
      setCategories((prev) => [...prev, newCat]);
      message.success('Thêm danh mục thành công');
    }
    setCatModalVisible(false);
    catForm.resetFields();
    setEditingCat(null);
  };

  const deleteCategory = (cat: Category) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: `Bạn có chắc muốn xóa môn "${cat.name}"? Tất cả lịch và mục tiêu liên quan sẽ bị xóa.`,
      onOk: () => {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        setSchedules((prev) => prev.filter((s) => s.categoryId !== cat.id));
        setGoals((prev) => prev.filter((g) => g.categoryId !== cat.id));
        message.success('Đã xóa');
      },
    });
  };

  const addOrUpdateSchedule = (values: any) => {
    const datetime = values.datetime.format();
    const newSched: Schedule = editingSched
      ? { ...editingSched, ...values, datetime }
      : { id: Date.now().toString(), ...values, datetime } as Schedule;

    if (editingSched) {
      setSchedules((prev) => prev.map((s) => (s.id === newSched.id ? newSched : s)));
      message.success('Cập nhật lịch học');
    } else {
      setSchedules((prev) => [...prev, newSched]);
      message.success('Thêm lịch học');
    }
    setSchedModalVisible(false);
    schedForm.resetFields();
    setEditingSched(null);
  };

  const deleteSchedule = (sched: Schedule) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: `Bạn có chắc muốn xóa lịch học này?`,
      onOk: () => {
        setSchedules((prev) => prev.filter((s) => s.id !== sched.id));
        message.success('Đã xóa');
      },
    });
  };

  const addOrUpdateGoal = (values: any) => {
    const month = values.month.format('YYYY-MM');
    const newGoal: Goal = editingGoal
      ? { ...editingGoal, ...values, month }
      : { id: Date.now().toString(), month, ...values } as Goal;

    if (editingGoal) {
      setGoals((prev) => prev.map((g) => (g.id === newGoal.id ? newGoal : g)));
      message.success('Cập nhật mục tiêu');
    } else {
      setGoals((prev) => [...prev, newGoal]);
      message.success('Thêm mục tiêu');
    }
    setGoalModalVisible(false);
    goalForm.resetFields();
    setEditingGoal(null);
  };

  const deleteGoal = (goal: Goal) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: `Bạn có chắc muốn xóa mục tiêu này?`,
      onOk: () => {
        setGoals((prev) => prev.filter((g) => g.id !== goal.id));
        message.success('Đã xóa');
      },
    });
  };

  // compute goal status
  const computeGoalStatus = (goal: Goal) => {
    const used = schedules
      .filter((s) => (goal.categoryId ? s.categoryId === goal.categoryId : true))
      .filter((s) => s.datetime.startsWith(goal.month))
      .reduce((acc, s) => acc + s.duration, 0);
    return { used, met: used >= goal.targetMinutes };
  };

  return (
    <div className={styles.container}>
      <Card title="Quản lý học tập">
        <Tabs defaultActiveKey="categories">
          <Tabs.TabPane key="categories" tab="Danh mục">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCatModalVisible(true)}
            >
              Thêm môn học
            </Button>
            <List
              bordered
              dataSource={categories}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={() => {
                        setEditingCat(item);
                        catForm.setFieldsValue(item);
                        setCatModalVisible(true);
                      }}
                    />, 
                    <DeleteOutlined
                      key="delete"
                      onClick={() => deleteCategory(item)}
                    />,
                  ]}
                >
                  {item.name}
                </List.Item>
              )}
              style={{ marginTop: 16 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane key="schedules" tab="Lịch học">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setSchedModalVisible(true)}
            >
              Thêm lịch học
            </Button>
            <Table
              dataSource={schedules.map((s) => ({
                ...s,
                key: s.id,
                category: categories.find((c) => c.id === s.categoryId)?.name || '',
                datetime: moment(s.datetime).format('YYYY-MM-DD HH:mm'),
              }))}
              columns={[
                { title: 'Môn', dataIndex: 'category' },
                { title: 'Thời gian', dataIndex: 'datetime' },
                { title: 'Thời lượng (phút)', dataIndex: 'duration' },
                { title: 'Nội dung', dataIndex: 'content' },
                {
                  title: 'Hành động',
                  render: (_: any, record: any) => (
                    <Space>
                      <EditOutlined
                        onClick={() => {
                          const orig = schedules.find((s) => s.id === record.key)!;
                          setEditingSched(orig);
                          schedForm.setFieldsValue({
                            ...orig,
                            datetime: moment(orig.datetime),
                          });
                          setSchedModalVisible(true);
                        }}
                      />
                      <DeleteOutlined
                        onClick={() => deleteSchedule(schedules.find((s) => s.id === record.key)!)}
                      />
                    </Space>
                  ),
                },
              ]}
              style={{ marginTop: 16 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane key="goals" tab="Mục tiêu">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setGoalModalVisible(true)}
            >
              Thêm mục tiêu
            </Button>
            <Table
              dataSource={goals.map((g) => {
                const status = computeGoalStatus(g);
                return {
                  ...g,
                  key: g.id,
                  category: g.categoryId
                    ? categories.find((c) => c.id === g.categoryId)?.name || ''
                    : 'Tổng',
                  month: g.month,
                  status,
                };
              })}
              columns={[
                { title: 'Môn / Tổng', dataIndex: 'category' },
                { title: 'Tháng', dataIndex: 'month' },
                {
                  title: 'Mục tiêu (phút)',
                  dataIndex: 'targetMinutes',
                },
                {
                  title: 'Đã học',
                  dataIndex: ['status', 'used'],
                },
                {
                  title: 'Trạng thái',
                  render: (_: any, rec: any) => (
                    rec.status.met ? <Tag color="green">Đạt</Tag> : <Tag color="red">Chưa</Tag>
                  ),
                },
                {
                  title: 'Hành động',
                  render: (_: any, record: any) => (
                    <Space>
                      <EditOutlined
                        onClick={() => {
                          const orig = goals.find((g) => g.id === record.key)!;
                          setEditingGoal(orig);
                          goalForm.setFieldsValue({
                            ...orig,
                            month: moment(orig.month, 'YYYY-MM'),
                          });
                          setGoalModalVisible(true);
                        }}
                      />
                      <DeleteOutlined
                        onClick={() => deleteGoal(goals.find((g) => g.id === record.key)!)}
                      />
                    </Space>
                  ),
                },
              ]}
              style={{ marginTop: 16 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* Modals */}
      <Modal
        title={editingCat ? 'Sửa danh mục' : 'Thêm danh mục'}
        visible={catModalVisible}
        onCancel={() => {
          setCatModalVisible(false);
          catForm.resetFields();
          setEditingCat(null);
        }}
        onOk={() => catForm.submit()}
      >
        <Form form={catForm} onFinish={addOrUpdateCategory} layout="vertical">
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingSched ? 'Sửa lịch học' : 'Thêm lịch học'}
        visible={schedModalVisible}
        onCancel={() => {
          setSchedModalVisible(false);
          schedForm.resetFields();
          setEditingSched(null);
        }}
        onOk={() => schedForm.submit()}
      >
        <Form form={schedForm} onFinish={addOrUpdateSchedule} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Môn học"
            rules={[{ required: true, message: 'Chọn môn học' }]}
          >
            <select style={{ width: '100%', padding: '5px' }}>
              <option value="">-- Chọn --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item
            name="datetime"
            label="Ngày giờ"
            rules={[{ required: true, message: 'Chọn thời gian' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời lượng (phút)"
            rules={[{ required: true, message: 'Nhập thời lượng' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
        visible={goalModalVisible}
        onCancel={() => {
          setGoalModalVisible(false);
          goalForm.resetFields();
          setEditingGoal(null);
        }}
        onOk={() => goalForm.submit()}
      >
        <Form form={goalForm} onFinish={addOrUpdateGoal} layout="vertical">
          <Form.Item name="categoryId" label="Môn (để trống nếu tổng)">
            <select style={{ width: '100%', padding: '5px' }}>
              <option value="">Tổng</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item
            name="month"
            label="Tháng"
            rules={[{ required: true, message: 'Chọn tháng' }]}
          >
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="targetMinutes"
            label="Mục tiêu (phút)"
            rules={[{ required: true, message: 'Nhập số phút' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TH02;
