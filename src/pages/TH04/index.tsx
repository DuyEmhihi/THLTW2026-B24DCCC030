import React, { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Button, Card, Form, Input, message, Modal, Select, Space, Switch, Table, Tabs, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;

type Book = { id: string; year: string; currentEntryNumber: number };
type Decision = {
  id: string;
  bookId: string;
  batchNumber: string;
  decisionNumber: string;
  decisionDate: string;
  summary: string;
  searchCount: number;
};
type Field = { id: string; name: string; type: 'string' | 'number' | 'date'; required: boolean };
type Diploma = {
  id: string;
  diplomaNumber: string;
  studentId: string;
  name: string;
  birthDate: string;
  bookId: string;
  decisionId: string;
  customValues: Record<string, string>;
};

type FieldForm = { name: string; type: Field['type']; required: boolean };
type DiplomaForm = {
  diplomaNumber: string;
  studentId: string;
  name: string;
  birthDate: string;
  bookId: string;
  decisionId: string;
  customValues: Record<string, string>;
};

const initialBooks: Book[] = [
  { id: 'b1', year: '2023', currentEntryNumber: 12 },
  { id: 'b2', year: '2024', currentEntryNumber: 5 },
];

const initialDecisions: Decision[] = [
  {
    id: 'd1',
    bookId: 'b1',
    batchNumber: '1',
    decisionNumber: '001',
    decisionDate: '2024-01-10',
    summary: 'Quyết định tốt nghiệp đợt 1',
    searchCount: 10,
  },
];

const initialFields: Field[] = [
  { id: 'f1', name: 'Chuyên ngành', type: 'string', required: true },
  { id: 'f2', name: 'Xếp loại', type: 'string', required: false },
];

const initialDiplomas: Diploma[] = [
  {
    id: 'p1',
    diplomaNumber: 'TV-001',
    studentId: 'SV001',
    name: 'Nguyễn Văn A',
    birthDate: '2000-05-05',
    bookId: 'b1',
    decisionId: 'd1',
    customValues: { f1: 'Công nghệ thông tin', f2: 'Giỏi' },
  },
];

const TH04: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [diplomas, setDiplomas] = useState<Diploma[]>(initialDiplomas);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [decisionModalVisible, setDecisionModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [diplomaModalVisible, setDiplomaModalVisible] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);

  const [bookForm] = Form.useForm();
  const [decisionForm] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [diplomaForm] = Form.useForm();

  const filteredDiplomas = useMemo(
    () =>
      diplomas.filter(
        (item) =>
          item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.diplomaNumber.toLowerCase().includes(searchKeyword.toLowerCase()),
      ),
    [diplomas, searchKeyword],
  );

  const getBookLabel = (id: string) => books.find((item) => item.id === id)?.year || '-';
  const getDecisionLabel = (id: string) => decisions.find((item) => item.id === id)?.decisionNumber || '-';

  const bookColumns: ColumnsType<Book> = [
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    { title: 'Số vào sổ hiện tại', dataIndex: 'currentEntryNumber', key: 'currentEntryNumber' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openBookModal(record)}>
            Sửa
          </Button>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => deleteBook(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const decisionColumns: ColumnsType<Decision> = [
    {
      title: 'Sổ văn bằng',
      dataIndex: 'bookId',
      key: 'bookId',
      render: (value) => getBookLabel(value),
    },
    { title: 'Đợt', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: 'Số quyết định', dataIndex: 'decisionNumber', key: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'decisionDate', key: 'decisionDate' },
    { title: 'Trích yếu', dataIndex: 'summary', key: 'summary' },
    { title: 'Lượt tra cứu', dataIndex: 'searchCount', key: 'searchCount' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openDecisionModal(record)}>
            Sửa
          </Button>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => deleteDecision(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const fieldColumns: ColumnsType<Field> = [
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      key: 'type',
      render: (value: Field['type']) => {
        const typeMap: Record<Field['type'], string> = { string: 'Chuỗi', number: 'Số', date: 'Ngày' };
        return typeMap[value] || value;
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      key: 'required',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Có' : 'Không'}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openFieldModal(record)}>
            Sửa
          </Button>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => deleteField(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const diplomaColumns: ColumnsType<Diploma> = [
    { title: 'Số văn bằng', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
    { title: 'Mã sinh viên', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate' },
    { title: 'Sổ', dataIndex: 'bookId', key: 'bookId', render: (value) => getBookLabel(value) },
    { title: 'Quyết định', dataIndex: 'decisionId', key: 'decisionId', render: (value) => getDecisionLabel(value) },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openDiplomaModal(record)}>
            Sửa
          </Button>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => deleteDiploma(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const openBookModal = (book?: Book) => {
    setEditingBook(book || null);
    bookForm.setFieldsValue(book || { year: '', currentEntryNumber: 1 });
    setBookModalVisible(true);
  };

  const openDecisionModal = (decision?: Decision) => {
    setEditingDecision(decision || null);
    decisionForm.setFieldsValue(
      decision || {
        bookId: books[0]?.id,
        batchNumber: '',
        decisionNumber: '',
        decisionDate: '',
        summary: '',
        searchCount: 0,
      },
    );
    setDecisionModalVisible(true);
  };

  const openFieldModal = (field?: Field) => {
    setEditingField(field || null);
    fieldForm.setFieldsValue(field || { name: '', type: 'string', required: false });
    setFieldModalVisible(true);
  };

  const openDiplomaModal = (diploma?: Diploma) => {
    setEditingDiploma(diploma || null);
    diplomaForm.setFieldsValue(
      diploma || {
        diplomaNumber: '',
        studentId: '',
        name: '',
        birthDate: '',
        bookId: books[0]?.id,
        decisionId: decisions[0]?.id,
        customValues: fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {} as Record<string, string>),
      },
    );
    setDiplomaModalVisible(true);
  };

  const saveBook = (values: Omit<Book, 'id'>) => {
    if (editingBook) {
      setBooks((prev) => prev.map((item) => (item.id === editingBook.id ? { ...item, ...values } : item)));
      message.success('Cập nhật sổ văn bằng thành công');
    } else {
      setBooks((prev) => [...prev, { id: `b${Date.now()}`, ...values }]);
      message.success('Thêm sổ văn bằng thành công');
    }
    setBookModalVisible(false);
    setEditingBook(null);
  };

  const saveDecision = (values: Omit<Decision, 'id'>) => {
    if (editingDecision) {
      setDecisions((prev) => prev.map((item) => (item.id === editingDecision.id ? { ...item, ...values } : item)));
      message.success('Cập nhật quyết định thành công');
    } else {
      setDecisions((prev) => [...prev, { id: `d${Date.now()}`, ...values }]);
      message.success('Thêm quyết định thành công');
    }
    setDecisionModalVisible(false);
    setEditingDecision(null);
  };

  const saveField = (values: FieldForm) => {
    if (editingField) {
      setFields((prev) => prev.map((item) => (item.id === editingField.id ? { ...item, ...values } : item)));
      message.success('Cập nhật trường thành công');
    } else {
      setFields((prev) => [...prev, { id: `f${Date.now()}`, ...values }]);
      message.success('Thêm trường thành công');
    }
    setFieldModalVisible(false);
    setEditingField(null);
  };

  const saveDiploma = (values: DiplomaForm) => {
    if (editingDiploma) {
      setDiplomas((prev) => prev.map((item) => (item.id === editingDiploma.id ? { ...item, ...values } : item)));
      message.success('Cập nhật văn bằng thành công');
    } else {
      setDiplomas((prev) => [...prev, { id: `p${Date.now()}`, ...values }]);
      message.success('Thêm văn bằng thành công');
    }
    setDiplomaModalVisible(false);
    setEditingDiploma(null);
  };

  const deleteBook = (id: string) => setBooks((prev) => prev.filter((item) => item.id !== id));
  const deleteDecision = (id: string) => setDecisions((prev) => prev.filter((item) => item.id !== id));
  const deleteField = (id: string) => setFields((prev) => prev.filter((item) => item.id !== id));
  const deleteDiploma = (id: string) => setDiplomas((prev) => prev.filter((item) => item.id !== id));

  return (
    <div style={{ padding: 16 }}>
      <Tabs defaultActiveKey="search">
        <TabPane tab="Tra cứu văn bằng" key="search">
          <Space style={{ marginBottom: 16 }}>
            <Input.Search
              placeholder="Tìm theo tên hoặc số văn bằng"
              allowClear
              onSearch={setSearchKeyword}
              style={{ width: 320 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openDiplomaModal()}>
              Thêm văn bằng
            </Button>
          </Space>
          <Table columns={diplomaColumns} dataSource={filteredDiplomas} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        <TabPane tab="Quản lý sổ văn bằng" key="books">
          <Card
            title="Danh sách sổ văn bằng"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openBookModal()}>
                Thêm sổ mới
              </Button>
            }
          >
            <Table columns={bookColumns} dataSource={books} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </TabPane>

        <TabPane tab="Quyết định tốt nghiệp" key="decisions">
          <Card
            title="Danh sách quyết định"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openDecisionModal()}>
                Thêm quyết định
              </Button>
            }
          >
            <Table columns={decisionColumns} dataSource={decisions} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </TabPane>

        <TabPane tab="Cấu hình biểu mẫu" key="fields">
          <Card
            title="Danh sách trường thông tin"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openFieldModal()}>
                Thêm trường
              </Button>
            }
          >
            <Table columns={fieldColumns} dataSource={fields} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={editingBook ? 'Sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
        visible={bookModalVisible}
        onCancel={() => setBookModalVisible(false)}
        footer={null}
      >
        <Form form={bookForm} layout="vertical" onFinish={saveBook} initialValues={{ year: '', currentEntryNumber: 1 }}>
          <Form.Item name="year" label="Năm" rules={[{ required: true, message: 'Nhập năm' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="currentEntryNumber" label="Số vào sổ" rules={[{ required: true, message: 'Nhập số vào sổ' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setBookModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingDecision ? 'Sửa quyết định' : 'Thêm quyết định'}
        visible={decisionModalVisible}
        onCancel={() => setDecisionModalVisible(false)}
        footer={null}
      >
        <Form
          form={decisionForm}
          layout="vertical"
          onFinish={saveDecision}
          initialValues={{ bookId: books[0]?.id, batchNumber: '', decisionNumber: '', decisionDate: '', summary: '', searchCount: 0 }}
        >
          <Form.Item name="bookId" label="Sổ văn bằng" rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}>
            <Select options={books.map((item) => ({ label: item.year, value: item.id }))} />
          </Form.Item>
          <Form.Item name="batchNumber" label="Đợt" rules={[{ required: true, message: 'Nhập đợt' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="decisionNumber" label="Số quyết định" rules={[{ required: true, message: 'Nhập số quyết định' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="decisionDate" label="Ngày ban hành" rules={[{ required: true, message: 'Nhập ngày ban hành' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="summary" label="Trích yếu" rules={[{ required: true, message: 'Nhập trích yếu' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="searchCount" label="Lượt tra cứu" rules={[{ required: true, message: 'Nhập lượt tra cứu' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setDecisionModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingField ? 'Sửa trường' : 'Thêm trường'}
        visible={fieldModalVisible}
        onCancel={() => setFieldModalVisible(false)}
        footer={null}
      >
        <Form form={fieldForm} layout="vertical" onFinish={saveField} initialValues={{ name: '', type: 'string', required: false }}>
          <Form.Item name="name" label="Tên trường" rules={[{ required: true, message: 'Nhập tên trường' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true, message: 'Chọn kiểu dữ liệu' }]}>
            <Select options={[{ label: 'Chuỗi', value: 'string' }, { label: 'Số', value: 'number' }, { label: 'Ngày', value: 'date' }]} />
          </Form.Item>
          <Form.Item name="required" label="Bắt buộc" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setFieldModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingDiploma ? 'Sửa văn bằng' : 'Thêm văn bằng'}
        visible={diplomaModalVisible}
        onCancel={() => setDiplomaModalVisible(false)}
        footer={null}
      >
        <Form
          form={diplomaForm}
          layout="vertical"
          onFinish={saveDiploma}
          initialValues={{
            diplomaNumber: '',
            studentId: '',
            name: '',
            birthDate: '',
            bookId: books[0]?.id,
            decisionId: decisions[0]?.id,
            customValues: fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {} as Record<string, string>),
          }}
        >
          <Form.Item name="diplomaNumber" label="Số văn bằng" rules={[{ required: true, message: 'Nhập số văn bằng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="studentId" label="Mã sinh viên" rules={[{ required: true, message: 'Nhập mã sinh viên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthDate" label="Ngày sinh" rules={[{ required: true, message: 'Nhập ngày sinh' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="bookId" label="Sổ văn bằng" rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}>
            <Select options={books.map((item) => ({ label: item.year, value: item.id }))} />
          </Form.Item>
          <Form.Item name="decisionId" label="Quyết định" rules={[{ required: true, message: 'Chọn quyết định' }]}>
            <Select options={decisions.map((item) => ({ label: item.decisionNumber, value: item.id }))} />
          </Form.Item>
          {fields.map((field) => (
            <Form.Item
              key={field.id}
              name={['customValues', field.id]}
              label={field.name}
              rules={field.required ? [{ required: true, message: `Nhập ${field.name}` }] : []}
            >
              <Input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} />
            </Form.Item>
          ))}
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setDiplomaModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TH04;
