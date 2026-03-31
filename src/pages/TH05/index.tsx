import React, { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import ColumnChart from '../../components/Chart/ColumnChart';

const { TextArea } = Input;
const { TabPane } = Tabs;

type Club = {
  key: string;
  avatar: string;
  name: string;
  founded: string;
  description: string;
  owner: string;
  active: boolean;
};

type Registration = {
  key: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  strengths: string;
  clubKey: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note: string;
};

type HistoryItem = {
  key: string;
  registrationKey: string;
  action: 'Approved' | 'Rejected';
  time: string;
  note: string;
  admin: string;
};

const initialClubs: Club[] = [
  {
    key: 'c1',
    avatar: 'https://i.pravatar.cc/80?img=12',
    name: 'CLB Công nghệ',
    founded: '2019-04-05',
    description: '<p>CLB dành cho bạn yêu thích lập trình và sáng tạo.</p>',
    owner: 'Nguyễn Văn A',
    active: true,
  },
  {
    key: 'c2',
    avatar: 'https://i.pravatar.cc/80?img=14',
    name: 'CLB Văn nghệ',
    founded: '2020-08-12',
    description: '<p>CLB biểu diễn, âm nhạc và nghệ thuật.</p>',
    owner: 'Lê Thị B',
    active: false,
  },
];

const initialRegistrations: Registration[] = [
  {
    key: 'r1',
    fullName: 'Trần Văn C',
    email: 'tran.van.c@example.com',
    phone: '0909123456',
    gender: 'Nam',
    address: 'Hà Nội',
    strengths: 'Lãnh đạo, tổ chức sự kiện',
    clubKey: 'c1',
    reason: 'Muốn nâng cao kỹ năng CNTT.',
    status: 'Pending',
    note: '',
  },
  {
    key: 'r2',
    fullName: 'Phạm Thị D',
    email: 'pham.thi.d@example.com',
    phone: '0912345678',
    gender: 'Nữ',
    address: 'Hải Phòng',
    strengths: 'Ca hát, nhảy múa',
    clubKey: 'c2',
    reason: 'Yêu thích văn nghệ và muốn tham gia đội nhóm.',
    status: 'Approved',
    note: '',
  },
  {
    key: 'r3',
    fullName: 'Nguyễn Văn E',
    email: 'nguyen.van.e@example.com',
    phone: '0987654321',
    gender: 'Nam',
    address: 'Đà Nẵng',
    strengths: 'Viết nội dung, thiết kế',
    clubKey: 'c1',
    reason: 'Muốn thử sức với dự án nhóm.',
    status: 'Rejected',
    note: 'Chưa đủ thời gian tham gia.',
  },
];

const TH05: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [clubEditing, setClubEditing] = useState<Club | null>(null);
  const [clubForm] = Form.useForm();
  const [clubSearch, setClubSearch] = useState('');

  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [registrationEditing, setRegistrationEditing] = useState<Registration | null>(null);
  const [registrationForm] = Form.useForm();

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<Registration | null>(null);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectKeys, setRejectKeys] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');

  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const [selectedRegistrationKeys, setSelectedRegistrationKeys] = useState<React.Key[]>([]);
  const [selectedMemberKeys, setSelectedMemberKeys] = useState<React.Key[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferClubKey, setTransferClubKey] = useState<string>('');

  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [membersModalTitle, setMembersModalTitle] = useState('');
  const [membersOfClub, setMembersOfClub] = useState<Registration[]>([]);

  const approvedMembers = useMemo(
    () => registrations.filter((item) => item.status === 'Approved'),
    [registrations],
  );

  const clubCount = clubs.length;
  const pendingCount = registrations.filter((item) => item.status === 'Pending').length;
  const approvedCount = registrations.filter((item) => item.status === 'Approved').length;
  const rejectedCount = registrations.filter((item) => item.status === 'Rejected').length;

  const chartData = useMemo(() => {
    const categories = clubs.map((club) => club.name);
    const pending = clubs.map((club) => registrations.filter((item) => item.clubKey === club.key && item.status === 'Pending').length);
    const approved = clubs.map((club) => registrations.filter((item) => item.clubKey === club.key && item.status === 'Approved').length);
    const rejected = clubs.map((club) => registrations.filter((item) => item.clubKey === club.key && item.status === 'Rejected').length);
    return { categories, pending, approved, rejected };
  }, [clubs, registrations]);

  const filteredClubs = useMemo(() => {
    const keyword = clubSearch.trim().toLowerCase();
    if (!keyword) return clubs;
    return clubs.filter((club) => club.name.toLowerCase().includes(keyword) || club.owner.toLowerCase().includes(keyword));
  }, [clubSearch, clubs]);

  const clubColumns: ColumnsType<Club> = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <img src={avatar} alt="avatar" style={{ width: 48, borderRadius: 8 }} />,
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'founded',
      key: 'founded',
      sorter: (a: Club, b: Club) => a.founded.localeCompare(b.founded),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => <div dangerouslySetInnerHTML={{ __html: description }} />,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'owner',
      key: 'owner',
      sorter: (a: Club, b: Club) => a.owner.localeCompare(b.owner),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Có' : 'Không'}</Tag>
      ),
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value: any, record: Club) => record.active === value,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Club) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEditClub(record)}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} type="link" onClick={() => handleDeleteClub(record.key)}>
            Xóa
          </Button>
          <Button icon={<EyeOutlined />} type="link" onClick={() => handleViewClubMembers(record)}>
            Thành viên
          </Button>
        </Space>
      ),
    },
  ];

  const registrationColumns: ColumnsType<Registration> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: Registration, b: Registration) => a.fullName.localeCompare(b.fullName),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'strengths', key: 'strengths' },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubKey',
      key: 'clubKey',
      render: (clubKey: string) => clubs.find((club) => club.key === clubKey)?.name || '-',
      filters: clubs.map((club) => ({ text: club.name, value: club.key })),
      onFilter: (value: any, record: Registration) => record.clubKey === value,
    },
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Registration['status']) => {
        const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value: any, record: Registration) => record.status === value,
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Registration) => (
        <Space>
          <Button icon={<EyeOutlined />} type="link" onClick={() => handleViewDetails(record)}>
            Xem
          </Button>
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEditRegistration(record)}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} type="link" onClick={() => handleDeleteRegistration(record.key)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const memberColumns: ColumnsType<Registration> = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubKey',
      key: 'clubKey',
      render: (clubKey: string) => clubs.find((club) => club.key === clubKey)?.name || '-',
    },
  ];

  function handleEditClub(record: Club) {
    setClubEditing(record);
    clubForm.setFieldsValue(record);
    setClubModalVisible(true);
  }

  function handleDeleteClub(key: string) {
    Modal.confirm({
      title: 'Xóa CLB',
      content: 'Bạn có chắc muốn xóa CLB này?',
      onOk() {
        setClubs((prev) => prev.filter((club) => club.key !== key));
        message.success('Đã xóa CLB');
      },
    });
  }

  function handleViewClubMembers(club: Club) {
    const data = registrations.filter((item) => item.clubKey === club.key && item.status === 'Approved');
    setMembersModalTitle(`Thành viên của ${club.name}`);
    setMembersOfClub(data);
    setMembersModalVisible(true);
  }

  function handleAddClub() {
    setClubEditing(null);
    clubForm.resetFields();
    setClubModalVisible(true);
  }

  function handleSaveClub(values: any) {
    if (clubEditing) {
      setClubs((prev) => prev.map((club) => (club.key === clubEditing.key ? { ...club, ...values } : club)));
      message.success('Cập nhật CLB thành công');
    } else {
      const newClub: Club = {
        key: `c${Date.now()}`,
        avatar: 'https://i.pravatar.cc/80?img=52',
        ...values,
      };
      setClubs((prev) => [...prev, newClub]);
      message.success('Thêm CLB mới thành công');
    }
    setClubModalVisible(false);
  }

  function handleEditRegistration(record: Registration) {
    setRegistrationEditing(record);
    registrationForm.setFieldsValue(record);
    setRegistrationModalVisible(true);
  }

  function handleDeleteRegistration(key: string) {
    Modal.confirm({
      title: 'Xóa đơn đăng ký',
      content: 'Bạn có chắc muốn xóa đơn này?',
      onOk() {
        setRegistrations((prev) => prev.filter((item) => item.key !== key));
        setSelectedRegistrationKeys((prev) => prev.filter((value) => value !== key));
        message.success('Đã xóa đơn đăng ký');
      },
    });
  }

  function handleAddRegistration() {
    setRegistrationEditing(null);
    registrationForm.resetFields();
    setRegistrationModalVisible(true);
  }

  function handleSaveRegistration(values: any) {
    if (registrationEditing) {
      setRegistrations((prev) =>
        prev.map((item) =>
          item.key === registrationEditing.key ? { ...item, ...values, status: registrationEditing.status, note: registrationEditing.note } : item,
        ),
      );
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      const newRegistration: Registration = {
        key: `r${Date.now()}`,
        status: 'Pending',
        note: '',
        ...values,
      };
      setRegistrations((prev) => [...prev, newRegistration]);
      message.success('Thêm đơn đăng ký mới thành công');
    }
    setRegistrationModalVisible(false);
  }

  function handleViewDetails(record: Registration) {
    setDetailRecord(record);
    setDetailModalVisible(true);
  }

  function addHistoryEntry(reg: Registration, action: 'Approved' | 'Rejected', note: string) {
    setHistory((prev) => [
      ...prev,
      {
        key: `h-${Date.now()}-${reg.key}`,
        registrationKey: reg.key,
        action,
        time: new Date().toLocaleString('vi-VN'),
        note,
        admin: 'Admin',
      },
    ]);
  }

  function handleApproveRegistrations(keys: React.Key[]) {
    if (!keys.length) return;
    setRegistrations((prev) =>
      prev.map((item) => {
        if (keys.includes(item.key)) {
          addHistoryEntry(item, 'Approved', 'Duyệt đơn');
          return { ...item, status: 'Approved', note: '' };
        }
        return item;
      }),
    );
    setSelectedRegistrationKeys([]);
    message.success(`Đã duyệt ${keys.length} đơn`);
  }

  function handleRejectRegistrations(keys: string[]) {
    if (!keys.length || !rejectReason.trim()) return;
    setRegistrations((prev) =>
      prev.map((item) => {
        if (keys.includes(item.key)) {
          addHistoryEntry(item, 'Rejected', rejectReason.trim());
          return { ...item, status: 'Rejected', note: rejectReason.trim() };
        }
        return item;
      }),
    );
    setRejectKeys([]);
    setRejectReason('');
    setRejectModalVisible(false);
    setSelectedRegistrationKeys([]);
    message.success(`Đã từ chối ${keys.length} đơn`);
  }

  function openRejectModal(keys: string[]) {
    setRejectKeys(keys);
    setRejectReason('');
    setRejectModalVisible(true);
  }

  function handleTransferMembers() {
    if (!selectedMemberKeys.length || !transferClubKey) {
      message.warning('Chọn CLB mới để chuyển thành viên');
      return;
    }
    setRegistrations((prev) =>
      prev.map((item) =>
        selectedMemberKeys.includes(item.key) ? { ...item, clubKey: transferClubKey } : item,
      ),
    );
    setSelectedMemberKeys([]);
    setTransferClubKey('');
    setTransferModalVisible(false);
    message.success('Đã chuyển CLB cho thành viên được chọn');
  }

  return (
    <div style={{ padding: 16 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách CLB" key="1">
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClub}>
              Thêm CLB
            </Button>
            <Input.Search
              placeholder="Tìm CLB theo tên hoặc chủ nhiệm"
              allowClear
              onSearch={(value) => setClubSearch(value)}
              style={{ width: 300 }}
            />
          </Space>
          <Table<Club>
            columns={clubColumns}
            dataSource={filteredClubs}
            rowKey="key"
            pagination={{ pageSize: 5 }}
          />
        </TabPane>

        <TabPane tab="Quản lý đơn đăng ký" key="2">
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRegistration}>
              Thêm đơn
            </Button>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              disabled={!selectedRegistrationKeys.length}
              onClick={() => handleApproveRegistrations(selectedRegistrationKeys)}
            >
              Duyệt {selectedRegistrationKeys.length ? `(${selectedRegistrationKeys.length})` : ''}
            </Button>
            <Button
              icon={<CloseOutlined />}
              danger
              disabled={!selectedRegistrationKeys.length}
              onClick={() => openRejectModal(selectedRegistrationKeys as string[])}
            >
              Từ chối {selectedRegistrationKeys.length ? `(${selectedRegistrationKeys.length})` : ''}
            </Button>
            <Button icon={<HistoryOutlined />} onClick={() => setHistoryModalVisible(true)}>
              Lịch sử thao tác
            </Button>
          </Space>
          <Table<Registration>
            rowSelection={{
              selectedRowKeys: selectedRegistrationKeys,
              onChange: setSelectedRegistrationKeys,
            }}
            columns={registrationColumns}
            dataSource={registrations}
            rowKey="key"
            pagination={{ pageSize: 6 }}
          />
        </TabPane>

        <TabPane tab="Quản lý thành viên" key="3">
          <Space style={{ marginBottom: 16 }}>
            <Button
              icon={<SwapOutlined />}
              type="primary"
              disabled={!selectedMemberKeys.length}
              onClick={() => setTransferModalVisible(true)}
            >
              Chuyển CLB ({selectedMemberKeys.length})
            </Button>
          </Space>
          <Table<Registration>
            rowSelection={{
              selectedRowKeys: selectedMemberKeys,
              onChange: setSelectedMemberKeys,
            }}
            columns={memberColumns}
            dataSource={approvedMembers}
            rowKey="key"
            pagination={{ pageSize: 6 }}
          />
        </TabPane>

        <TabPane tab="Báo cáo & thống kê" key="4">
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic title="Số CLB" value={clubCount} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Pending" value={pendingCount} valueStyle={{ color: '#faad14' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Approved" value={approvedCount} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Rejected" value={rejectedCount} valueStyle={{ color: '#f5222d' }} />
              </Card>
            </Col>
          </Row>
          <Card>
            <ColumnChart
              title="Đơn đăng ký theo CLB"
              xAxis={chartData.categories}
              yAxis={[chartData.pending, chartData.approved, chartData.rejected]}
              yLabel={['Pending', 'Approved', 'Rejected']}
              height={320}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={clubEditing ? 'Sửa CLB' : 'Thêm CLB'}
        visible={clubModalVisible}
        onCancel={() => setClubModalVisible(false)}
        footer={null}
      >
        <Form form={clubForm} layout="vertical" onFinish={handleSaveClub} initialValues={{ active: true }}>
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true, message: 'Nhập tên CLB' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="founded" label="Ngày thành lập" rules={[{ required: true, message: 'Nhập ngày thành lập' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Nhập mô tả' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="owner" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Nhập tên chủ nhiệm' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setClubModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={registrationEditing ? 'Sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
        visible={registrationModalVisible}
        onCancel={() => setRegistrationModalVisible(false)}
        footer={null}
      >
        <Form form={registrationForm} layout="vertical" onFinish={handleSaveRegistration}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Chọn giới tính' }]}>
            <Select options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }]} />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="strengths" label="Sở trường" rules={[{ required: true, message: 'Nhập sở trường' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="clubKey" label="Câu lạc bộ" rules={[{ required: true, message: 'Chọn CLB' }]}>
            <Select options={clubs.map((club) => ({ label: club.name, value: club.key }))} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký" rules={[{ required: true, message: 'Nhập lý do đăng ký' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setRegistrationModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết đơn đăng ký"
        visible={detailModalVisible}
        footer={null}
        onCancel={() => setDetailModalVisible(false)}
      >
        {detailRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">{detailRecord.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{detailRecord.email}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{detailRecord.phone}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{detailRecord.gender}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{detailRecord.address}</Descriptions.Item>
            <Descriptions.Item label="Sở trường">{detailRecord.strengths}</Descriptions.Item>
            <Descriptions.Item label="Câu lạc bộ">
              {clubs.find((club) => club.key === detailRecord.clubKey)?.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do đăng ký">{detailRecord.reason}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{detailRecord.status}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{detailRecord.note || 'Không có'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Từ chối đơn đăng ký"
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={() => handleRejectRegistrations(rejectKeys)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Lý do từ chối" required>
            <TextArea
              rows={4}
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Nhập lý do từ chối"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lịch sử thao tác"
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
      >
        <Table
          columns={[
            {
              title: 'Đơn',
              dataIndex: 'registrationKey',
              key: 'registrationKey',
              render: (key: string) => registrations.find((item) => item.key === key)?.fullName || key,
            },
            { title: 'Hành động', dataIndex: 'action', key: 'action' },
            { title: 'Admin', dataIndex: 'admin', key: 'admin' },
            { title: 'Thời gian', dataIndex: 'time', key: 'time' },
            { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
          ]}
          dataSource={history}
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      <Modal
        title={membersModalTitle}
        visible={membersModalVisible}
        onCancel={() => setMembersModalVisible(false)}
        footer={null}
      >
        <Table
          columns={memberColumns}
          dataSource={membersOfClub}
          rowKey="key"
          pagination={false}
          locale={{ emptyText: 'Chưa có thành viên' }}
        />
      </Modal>

      <Modal
        title="Chuyển CLB cho thành viên"
        visible={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onOk={handleTransferMembers}
        okText="Chuyển"
      >
        <Form layout="vertical">
          <Form.Item label={`Chuyển ${selectedMemberKeys.length} thành viên sang CLB`}>
            <Select
              value={transferClubKey}
              onChange={setTransferClubKey}
              options={clubs.map((club) => ({ label: club.name, value: club.key }))}
              placeholder="Chọn CLB mới"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TH05;
