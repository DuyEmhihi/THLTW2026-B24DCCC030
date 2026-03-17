import React, { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, TimePicker, Button, Table, Tag, Space, Modal, message, Statistic, Row, Col, Menu, InputNumber, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, DollarOutlined, AppstoreOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

// Interfaces cho TypeScript
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxClientsPerDay: number;
  workSchedule: WorkSchedule[];
  rating: number;
  isActive: boolean;
}

interface WorkSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  isActive: boolean;
}

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  employeeId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  review?: Review;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  employeeReply?: string;
  createdAt: string;
}

// Component chính
const AppointmentBooking: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('appointments');

  // State management
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      maxClientsPerDay: 8,
      workSchedule: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
      ],
      rating: 4.5,
      isActive: true,
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      maxClientsPerDay: 6,
      workSchedule: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 6, startTime: '08:00', endTime: '16:00' },
      ],
      rating: 4.8,
      isActive: true,
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Cắt tóc nam',
      description: 'Cắt tóc kiểu dáng cho nam',
      price: 50000,
      duration: 30,
      isActive: true,
    },
    {
      id: '2',
      name: 'Cắt tóc nữ',
      description: 'Cắt tóc kiểu dáng cho nữ',
      price: 80000,
      duration: 45,
      isActive: true,
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@example.com',
      customerPhone: '0111111111',
      serviceId: '1',
      employeeId: '1',
      date: '2024-01-15',
      time: '10:00',
      status: 'completed',
      notes: 'Khách hàng hài lòng',
      createdAt: '2024-01-10T09:00:00Z',
      review: {
        id: '1',
        rating: 5,
        comment: 'Rất hài lòng với dịch vụ',
        employeeReply: 'Cảm ơn quý khách đã tin tưởng!',
        createdAt: '2024-01-15T11:00:00Z',
      },
    },
  ]);

  // Modal states
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Forms
  const [employeeForm] = Form.useForm();
  const [serviceForm] = Form.useForm();
  const [appointmentForm] = Form.useForm();

  const handleMenuClick = (e: any) => {
    setCurrentTab(e.key);
  };

  // Helper functions
  const getServiceById = (id: string): Service | undefined => {
    return services.find((s: Service) => s.id === id);
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find((e: Employee) => e.id === id);
  };

  const checkTimeConflict = (employeeId: string, date: string, time: string, excludeId?: string): boolean => {
    const employee = getEmployeeById(employeeId);
    if (!employee) return true;

    const dayOfWeek = moment(date).day();
    const workSchedule = employee.workSchedule.find(ws => ws.dayOfWeek === dayOfWeek);
    if (!workSchedule) return true;

    const appointmentTime = moment(time, 'HH:mm');
    const workStart = moment(workSchedule.startTime, 'HH:mm');
    const workEnd = moment(workSchedule.endTime, 'HH:mm');

    if (appointmentTime.isBefore(workStart) || appointmentTime.isAfter(workEnd)) {
      return true; // Outside working hours
    }

    // Check for existing appointments
    const conflictingAppointment = appointments.find(apt => {
      if (excludeId && apt.id === excludeId) return false;
      if (apt.employeeId !== employeeId || apt.date !== date || apt.status === 'cancelled') return false;

      const aptTime = moment(apt.time, 'HH:mm');
      const service = getServiceById(apt.serviceId);
      if (!service) return false;

      const aptEndTime = moment(aptTime).add(service.duration, 'minutes');
      const newAptEndTime = moment(appointmentTime).add(service.duration, 'minutes');

      return appointmentTime.isBefore(aptEndTime) && newAptEndTime.isAfter(aptTime);
    });

    return !!conflictingAppointment;
  };

  const checkDailyLimit = (employeeId: string, date: string): boolean => {
    const employee = getEmployeeById(employeeId);
    if (!employee) return true;

    const dayAppointments = appointments.filter(apt =>
      apt.employeeId === employeeId &&
      apt.date === date &&
      apt.status !== 'cancelled'
    );

    return dayAppointments.length >= employee.maxClientsPerDay;
  };

  // Employee handlers
  const handleEmployeeSubmit = async (values: any) => {
    try {
      const employeeData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        maxClientsPerDay: values.maxClientsPerDay,
        workSchedule: values.workSchedule || [],
        rating: 0,
        isActive: true,
      };

      if (editingEmployee) {
        setEmployees(prev => prev.map(emp =>
          emp.id === editingEmployee.id
            ? { ...emp, ...employeeData }
            : emp
        ));
        message.success('Cập nhật nhân viên thành công!');
      } else {
        const newEmployee: Employee = {
          id: Date.now().toString(),
          ...employeeData,
        };
        setEmployees(prev => [...prev, newEmployee]);
        message.success('Thêm nhân viên thành công!');
      }

      setIsEmployeeModalVisible(false);
      employeeForm.resetFields();
      setEditingEmployee(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleEmployeeEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    employeeForm.setFieldsValue(employee);
    setIsEmployeeModalVisible(true);
  };

  const handleEmployeeDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa nhân viên này?',
      onOk: () => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        message.success('Xóa nhân viên thành công!');
      },
    });
  };

  // Service handlers
  const handleServiceSubmit = async (values: any) => {
    try {
      const serviceData = {
        name: values.name,
        description: values.description,
        price: values.price,
        duration: values.duration,
        isActive: true,
      };

      if (editingService) {
        setServices(prev => prev.map(srv =>
          srv.id === editingService.id
            ? { ...srv, ...serviceData }
            : srv
        ));
        message.success('Cập nhật dịch vụ thành công!');
      } else {
        const newService: Service = {
          id: Date.now().toString(),
          ...serviceData,
        };
        setServices(prev => [...prev, newService]);
        message.success('Thêm dịch vụ thành công!');
      }

      setIsServiceModalVisible(false);
      serviceForm.resetFields();
      setEditingService(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleServiceEdit = (service: Service) => {
    setEditingService(service);
    serviceForm.setFieldsValue(service);
    setIsServiceModalVisible(true);
  };

  const handleServiceDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa dịch vụ này?',
      onOk: () => {
        setServices(prev => prev.filter(srv => srv.id !== id));
        message.success('Xóa dịch vụ thành công!');
      },
    });
  };

  // Appointment handlers
  const handleAppointmentSubmit = async (values: any) => {
    try {
      const appointmentData = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        serviceId: values.serviceId,
        employeeId: values.employeeId,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        status: 'pending' as const,
        notes: values.notes,
        createdAt: new Date().toISOString(),
      };

      // Validation
      if (checkTimeConflict(values.employeeId, appointmentData.date, appointmentData.time)) {
        message.error('Thời gian này đã có lịch hẹn hoặc ngoài giờ làm việc!');
        return;
      }

      if (checkDailyLimit(values.employeeId, appointmentData.date)) {
        message.error('Nhân viên đã đạt giới hạn khách hàng trong ngày!');
        return;
      }

      if (editingAppointment) {
        setAppointments(prev => prev.map(apt =>
          apt.id === editingAppointment.id
            ? { ...apt, ...appointmentData }
            : apt
        ));
        message.success('Cập nhật lịch hẹn thành công!');
      } else {
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          ...appointmentData,
        };
        setAppointments(prev => [...prev, newAppointment]);
        message.success('Đặt lịch hẹn thành công!');
      }

      setIsAppointmentModalVisible(false);
      appointmentForm.resetFields();
      setEditingAppointment(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleAppointmentEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    appointmentForm.setFieldsValue({
      ...appointment,
      date: moment(appointment.date),
      time: moment(appointment.time, 'HH:mm'),
    });
    setIsAppointmentModalVisible(true);
  };

  const handleAppointmentDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa lịch hẹn này?',
      onOk: () => {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        message.success('Xóa lịch hẹn thành công!');
      },
    });
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, status } : apt
    ));
    message.success('Cập nhật trạng thái thành công!');
  };

  // Table columns
  const employeeColumns: ColumnsType<Employee> = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới hạn khách/ngày',
      dataIndex: 'maxClientsPerDay',
      key: 'maxClientsPerDay',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `⭐${rating}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEmployeeEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleEmployeeDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const serviceColumns: ColumnsType<Service> = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString(),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Service) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleServiceEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleServiceDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const appointmentColumns: ColumnsType<Appointment> = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceId',
      key: 'serviceId',
      render: (serviceId: string) => getServiceById(serviceId)?.name || 'N/A',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (employeeId: string) => getEmployeeById(employeeId)?.name || 'N/A',
    },
    {
      title: 'Ngày giờ',
      key: 'datetime',
      render: (_: any, record: Appointment) => `${moment(record.date).format('DD/MM/YYYY')} ${record.time}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Chờ duyệt' },
          confirmed: { color: 'blue', text: 'Xác nhận' },
          completed: { color: 'green', text: 'Hoàn thành' },
          cancelled: { color: 'red', text: 'Hủy' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Appointment) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleAppointmentEdit(record)}
          >
            Sửa
          </Button>
          <Select
            value={record.status}
            style={{ width: 100 }}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Select.Option value="pending">Chờ duyệt</Select.Option>
            <Select.Option value="confirmed">Xác nhận</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
            <Select.Option value="cancelled">Hủy</Select.Option>
          </Select>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleAppointmentDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Menu onClick={handleMenuClick} selectedKeys={[currentTab]} mode="horizontal">
        <Menu.Item key="employees" icon={<TeamOutlined />}>Quản lý nhân viên</Menu.Item>
        <Menu.Item key="services" icon={<AppstoreOutlined />}>Quản lý dịch vụ</Menu.Item>
        <Menu.Item key="appointments" icon={<CalendarOutlined />}>Đặt lịch hẹn</Menu.Item>
        <Menu.Item key="statistics" icon={<BarChartOutlined />}>Thống kê</Menu.Item>
      </Menu>

      {currentTab === 'employees' && (
        <div>
          <Card
            title="Quản lý nhân viên"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingEmployee(null);
                  employeeForm.resetFields();
                  setIsEmployeeModalVisible(true);
                }}
              >
                Thêm nhân viên
              </Button>
            }
          >
            <Table
              columns={employeeColumns}
              dataSource={employees}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      )}

      {currentTab === 'services' && (
        <div>
          <Card
            title="Quản lý dịch vụ"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingService(null);
                  serviceForm.resetFields();
                  setIsServiceModalVisible(true);
                }}
              >
                Thêm dịch vụ
              </Button>
            }
          >
            <Table
              columns={serviceColumns}
              dataSource={services}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      )}

      {currentTab === 'appointments' && (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng lịch hẹn"
                  value={appointments.length}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã hoàn thành"
                  value={appointments.filter(apt => apt.status === 'completed').length}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Chờ duyệt"
                  value={appointments.filter(apt => apt.status === 'pending').length}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Doanh thu"
                  value={appointments
                    .filter(apt => apt.status === 'completed')
                    .reduce((sum, apt) => {
                      const service = getServiceById(apt.serviceId);
                      return sum + (service?.price || 0);
                    }, 0)}
                  prefix={<DollarOutlined />}
                  suffix="VNĐ"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>
          <Card
            title="Quản lý lịch hẹn"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingAppointment(null);
                  appointmentForm.resetFields();
                  setIsAppointmentModalVisible(true);
                }}
              >
                Đặt lịch mới
              </Button>
            }
          >
            <Table
              columns={appointmentColumns}
              dataSource={appointments}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      )}

      {currentTab === 'statistics' && (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Thống kê theo nhân viên">
                {employees.map(employee => {
                  const employeeAppointments = appointments.filter(apt => apt.employeeId === employee.id);
                  const completedCount = employeeAppointments.filter(apt => apt.status === 'completed').length;
                  const revenue = employeeAppointments
                    .filter(apt => apt.status === 'completed')
                    .reduce((sum, apt) => {
                      const service = getServiceById(apt.serviceId);
                      return sum + (service?.price || 0);
                    }, 0);

                  return (
                    <div key={employee.id} style={{ marginBottom: 16 }}>
                      <h4>{employee.name}</h4>
                      <p>Lịch hẹn hoàn thành: {completedCount}</p>
                      <p>Doanh thu: {revenue.toLocaleString()} VNĐ</p>
                    </div>
                  );
                })}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Thống kê theo dịch vụ">
                {services.map(service => {
                  const serviceAppointments = appointments.filter(apt => apt.serviceId === service.id);
                  const completedCount = serviceAppointments.filter(apt => apt.status === 'completed').length;
                  const revenue = serviceAppointments
                    .filter(apt => apt.status === 'completed')
                    .reduce((sum, apt) => sum + service.price, 0);

                  return (
                    <div key={service.id} style={{ marginBottom: 16 }}>
                      <h4>{service.name}</h4>
                      <p>Lịch hẹn hoàn thành: {completedCount}</p>
                      <p>Doanh thu: {revenue.toLocaleString()} VNĐ</p>
                    </div>
                  );
                })}
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Employee Modal */}
      <Modal
        title={editingEmployee ? "Sửa nhân viên" : "Thêm nhân viên"}
        visible={isEmployeeModalVisible}
        onCancel={() => {
          setIsEmployeeModalVisible(false);
          employeeForm.resetFields();
          setEditingEmployee(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={employeeForm}
          layout="vertical"
          onFinish={handleEmployeeSubmit}
        >
          <Form.Item
            name="name"
            label="Tên nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
          >
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="maxClientsPerDay"
            label="Giới hạn khách hàng/ngày"
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn khách hàng!' }]}
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setIsEmployeeModalVisible(false);
                employeeForm.resetFields();
                setEditingEmployee(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingEmployee ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Service Modal */}
      <Modal
        title={editingService ? "Sửa dịch vụ" : "Thêm dịch vụ"}
        visible={isServiceModalVisible}
        onCancel={() => {
          setIsServiceModalVisible(false);
          serviceForm.resetFields();
          setEditingService(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={serviceForm}
          layout="vertical"
          onFinish={handleServiceSubmit}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea placeholder="Nhập mô tả dịch vụ" rows={3} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian thực hiện (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setIsServiceModalVisible(false);
                serviceForm.resetFields();
                setEditingService(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingService ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Appointment Modal */}
      <Modal
        title={editingAppointment ? "Sửa lịch hẹn" : "Đặt lịch hẹn"}
        visible={isAppointmentModalVisible}
        onCancel={() => {
          setIsAppointmentModalVisible(false);
          appointmentForm.resetFields();
          setEditingAppointment(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={appointmentForm}
          layout="vertical"
          onFinish={handleAppointmentSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
              >
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerPhone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="customerEmail"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceId"
                label="Dịch vụ"
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
              >
                <Select placeholder="Chọn dịch vụ">
                  {services.filter(s => s.isActive).map(service => (
                    <Select.Option key={service.id} value={service.id}>
                      {service.name} - {service.price.toLocaleString()} VNĐ ({service.duration} phút)
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Nhân viên"
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
              >
                <Select placeholder="Chọn nhân viên">
                  {employees.filter(e => e.isActive).map(employee => (
                    <Select.Option key={employee.id} value={employee.id}>
                      {employee.name} (⭐{employee.rating})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Giờ"
                rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
              >
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea placeholder="Nhập ghi chú (tùy chọn)" rows={3} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setIsAppointmentModalVisible(false);
                appointmentForm.resetFields();
                setEditingAppointment(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingAppointment ? 'Cập nhật' : 'Đặt lịch'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentBooking;
