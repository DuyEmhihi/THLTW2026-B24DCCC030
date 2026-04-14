import React, { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

type CourseStatus = 'opening' | 'completed' | 'paused';

interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  status: CourseStatus;
  description: string;
}

const instructorOptions = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Thị C', 'Phạm Minh D'];

const statusOptions: Array<{ value: CourseStatus; label: string; color: string }> = [
  { value: 'opening', label: 'Đang mở', color: 'green' },
  { value: 'completed', label: 'Đã kết thúc', color: 'blue' },
  { value: 'paused', label: 'Tạm dừng', color: 'orange' },
];

const initialCourses: Course[] = [
  {
    id: 'C001',
    name: 'React cơ bản',
    instructor: 'Nguyễn Văn A',
    studentCount: 18,
    status: 'opening',
    description: '<p>Khóa học React cơ bản giúp bạn nắm vững JSX, component và state.</p>',
  },
  {
    id: 'C002',
    name: 'Node.js và Express',
    instructor: 'Trần Thị B',
    studentCount: 0,
    status: 'paused',
    description: '<p>Khóa học xây dựng API với Node.js và Express.</p>',
  },
  {
    id: 'C003',
    name: 'TypeScript nâng cao',
    instructor: 'Lê Thị C',
    studentCount: 12,
    status: 'completed',
    description: '<p>Học cách sử dụng TypeScript cho dự án lớn và an toàn.</p>',
  },
];

const KtgkPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchName, setSearchName] = useState('');
  const [filterInstructor, setFilterInstructor] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<CourseStatus | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesSearch = course.name.toLowerCase().includes(searchName.trim().toLowerCase());
        const matchesInstructor = filterInstructor ? course.instructor === filterInstructor : true;
        const matchesStatus = filterStatus ? course.status === filterStatus : true;
        return matchesSearch && matchesInstructor && matchesStatus;
      })
      .sort((a, b) => a.studentCount - b.studentCount);
  }, [courses, filterInstructor, filterStatus, searchName]);

  const openCreateModal = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    form.resetFields();
  };

  const validateUniqueName = async (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    const normalized = value.trim().toLowerCase();
    const conflict = courses.some(
      (course) => course.name.trim().toLowerCase() === normalized && course.id !== editingCourse?.id,
    );
    if (conflict) {
      return Promise.reject(new Error('Tên khóa học đã tồn tại'));
    }
    return Promise.resolve();
  };

  const handleSaveCourse = (values: Omit<Course, 'id'>) => {
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) => (course.id === editingCourse.id ? { ...course, ...values } : course)),
      );
      message.success('Cập nhật khóa học thành công');
    } else {
      const newCourse: Course = {
        id: `C${Date.now()}`,
        ...values,
      };
      setCourses((prev) => [...prev, newCourse]);
      message.success('Thêm khóa học thành công');
    }
    closeModal();
  };

  const handleDeleteCourse = (course: Course) => {
    if (course.studentCount > 0) {
      message.error('Chỉ được xóa khóa học chưa có học viên');
      return;
    }

    setCourses((prev) => prev.filter((item) => item.id !== course.id));
    message.success('Xóa khóa học thành công');
  };

  const columns: ColumnsType<Course> = [
    {
      title: 'ID khóa học',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      width: 180,
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 180,
      sorter: (a, b) => a.studentCount - b.studentCount,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (value: CourseStatus) => {
        const item = statusOptions.find((option) => option.value === value);
        return <span style={{ color: item?.color }}>{item?.label}</span>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Chỉ khóa học chưa có học viên được xóa. Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteCourse(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={16}>
          <Space wrap>
            <Input.Search
              placeholder="Tìm kiếm theo tên khóa học"
              allowClear
              onChange={(event) => setSearchName(event.target.value)}
              style={{ width: 260 }}
            />
            <Select
              allowClear
              placeholder="Lọc giảng viên"
              value={filterInstructor}
              onChange={(value) => setFilterInstructor(value)}
              options={instructorOptions.map((item) => ({ label: item, value: item }))}
              style={{ width: 220 }}
            />
            <Select
              allowClear
              placeholder="Lọc trạng thái"
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              options={statusOptions.map((item) => ({ label: item.label, value: item.value }))}
              style={{ width: 180 }}
            />
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Thêm khóa học
          </Button>
        </Col>
      </Row>

      <Table<Course>
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={closeModal}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCourse} preserve={false}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên khóa học"
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập tên khóa học' },
                  { max: 100, message: 'Tên khóa học tối đa 100 ký tự' },
                  { validator: validateUniqueName },
                ]}
              >
                <Input maxLength={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="instructor"
                label="Giảng viên"
                rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
              >
                <Select options={instructorOptions.map((item) => ({ label: item, value: item }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentCount"
                label="Số lượng học viên"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái khóa học' }]}
              >
                <Select options={statusOptions.map((item) => ({ label: item.label, value: item.value }))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả khóa học (HTML)"
                rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mô tả khóa học' }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập nội dung HTML cho mô tả khóa học" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default KtgkPage;
