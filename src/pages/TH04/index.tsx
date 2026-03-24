import React, { useState } from 'react';
import { Tabs, Card, Button, Space, message, Table, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useDiplomaBookModel from '../../models/diplomaBook';
import useGraduationDecisionModel from '../../models/graduationDecision';
import useDiplomaFieldModel from '../../models/diplomaField';
import useDiplomaModel from '../../models/diploma';
import FormDiplomaBook from '../../components/Diploma/FormDiplomaBook';
import FormGraduationDecision from '../../components/Diploma/FormGraduationDecision';
import FormDiplomaField from '../../components/Diploma/FormDiplomaField';
import FormDiploma from '../../components/Diploma/FormDiploma';
import DiplomaSearch from '../../components/Diploma/DiplomaSearch';
import DiplomaTable from '../../components/Diploma/DiplomaTable';
import type {
  DiplomaBook,
  GraduationDecision,
  DiplomaField,
  Diploma,
  DiplomaBookForm,
  GraduationDecisionForm,
  DiplomaFieldForm,
  DiplomaForm,
  DiplomaSearchForm
} from '../../services/TH04/typings';

const { TabPane } = Tabs;

const TH04: React.FC = () => {
  // Models
  const diplomaBookModel = useDiplomaBookModel();
  const graduationDecisionModel = useGraduationDecisionModel();
  const diplomaFieldModel = useDiplomaFieldModel();
  const diplomaModel = useDiplomaModel();

  // Modal states
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [decisionModalVisible, setDecisionModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [diplomaModalVisible, setDiplomaModalVisible] = useState(false);

  // Edit states
  const [editingBook, setEditingBook] = useState<DiplomaBook | null>(null);
  const [editingDecision, setEditingDecision] = useState<GraduationDecision | null>(null);
  const [editingField, setEditingField] = useState<DiplomaField | null>(null);
  const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);

  // Handlers for Diploma Books
  const handleAddBook = async (values: DiplomaBookForm) => {
    await diplomaBookModel.addBook(values);
    setBookModalVisible(false);
    message.success('Thêm sổ văn bằng thành công');
  };

  const handleEditBook = async (book: DiplomaBook) => {
    setEditingBook(book);
    setBookModalVisible(true);
  };

  const handleUpdateBook = async (values: DiplomaBookForm) => {
    if (editingBook) {
      await diplomaBookModel.updateBook(editingBook.id, values);
      setBookModalVisible(false);
      setEditingBook(null);
      message.success('Cập nhật sổ văn bằng thành công');
    }
  };

  const handleDeleteBook = async (id: string) => {
    await diplomaBookModel.deleteBook(id);
    message.success('Xóa sổ văn bằng thành công');
  };

  // Handlers for Graduation Decisions
  const handleAddDecision = async (values: GraduationDecisionForm) => {
    await graduationDecisionModel.addDecision(values);
    setDecisionModalVisible(false);
    message.success('Thêm quyết định tốt nghiệp thành công');
  };

  const handleEditDecision = async (decision: GraduationDecision) => {
    setEditingDecision(decision);
    setDecisionModalVisible(true);
  };

  const handleUpdateDecision = async (values: GraduationDecisionForm) => {
    if (editingDecision) {
      await graduationDecisionModel.updateDecision(editingDecision.id, values);
      setDecisionModalVisible(false);
      setEditingDecision(null);
      message.success('Cập nhật quyết định tốt nghiệp thành công');
    }
  };

  const handleDeleteDecision = async (id: string) => {
    await graduationDecisionModel.deleteDecision(id);
    message.success('Xóa quyết định tốt nghiệp thành công');
  };

  // Handlers for Diploma Fields
  const handleAddField = async (values: DiplomaFieldForm) => {
    await diplomaFieldModel.addField(values);
    setFieldModalVisible(false);
    message.success('Thêm trường thông tin thành công');
  };

  const handleEditField = async (field: DiplomaField) => {
    setEditingField(field);
    setFieldModalVisible(true);
  };

  const handleUpdateField = async (values: DiplomaFieldForm) => {
    if (editingField) {
      await diplomaFieldModel.updateField(editingField.id, values);
      setFieldModalVisible(false);
      setEditingField(null);
      message.success('Cập nhật trường thông tin thành công');
    }
  };

  const handleDeleteField = async (id: string) => {
    await diplomaFieldModel.deleteField(id);
    message.success('Xóa trường thông tin thành công');
  };

  // Handlers for Diplomas
  const handleAddDiploma = async (values: DiplomaForm) => {
    await diplomaModel.addDiploma(values);
    setDiplomaModalVisible(false);
    message.success('Thêm thông tin văn bằng thành công');
  };

  const handleEditDiploma = async (diploma: Diploma) => {
    setEditingDiploma(diploma);
    setDiplomaModalVisible(true);
  };

  const handleUpdateDiploma = async (values: DiplomaForm) => {
    if (editingDiploma) {
      await diplomaModel.updateDiploma(editingDiploma.id, values);
      setDiplomaModalVisible(false);
      setEditingDiploma(null);
      message.success('Cập nhật thông tin văn bằng thành công');
    }
  };

  const handleDeleteDiploma = async (id: string) => {
    await diplomaModel.deleteDiploma(id);
    message.success('Xóa thông tin văn bằng thành công');
  };

  // Search handler
  const handleSearch = async (values: DiplomaSearchForm) => {
    const results = diplomaModel.searchDiplomas(values);
    return results;
  };

  // Table columns for books
  const bookColumns = [
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    { title: 'Số vào sổ hiện tại', dataIndex: 'currentEntryNumber', key: 'currentEntryNumber' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: DiplomaBook) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditBook(record)}>Sửa</Button>
          <Popconfirm title="Xóa sổ văn bằng này?" onConfirm={() => handleDeleteBook(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Table columns for decisions
  const decisionColumns = [
    { title: 'Sổ văn bằng', dataIndex: 'bookId', key: 'bookId', render: (bookId: string) => {
      const book = diplomaBookModel.getBookById(bookId);
      return book ? `Năm ${book.year}` : 'N/A';
    }},
    { title: 'Đợt', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: 'Số quyết định', dataIndex: 'decisionNumber', key: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'decisionDate', key: 'decisionDate', render: (date: string) => new Date(date).toLocaleDateString('vi-VN') },
    { title: 'Trích yếu', dataIndex: 'summary', key: 'summary' },
    { title: 'Lượt tra cứu', dataIndex: 'searchCount', key: 'searchCount' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: GraduationDecision) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditDecision(record)}>Sửa</Button>
          <Popconfirm title="Xóa quyết định này?" onConfirm={() => handleDeleteDecision(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Table columns for fields
  const fieldColumns = [
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type', render: (type: string) => {
      const typeMap = { string: 'Chuỗi', number: 'Số', date: 'Ngày' };
      return typeMap[type as keyof typeof typeMap] || type;
    }},
    { title: 'Bắt buộc', dataIndex: 'required', key: 'required', render: (required: boolean) => required ? 'Có' : 'Không' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: DiplomaField) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditField(record)}>Sửa</Button>
          <Popconfirm title="Xóa trường thông tin này?" onConfirm={() => handleDeleteField(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="search" type="card">
        <TabPane tab="Tra cứu văn bằng" key="search">
          <DiplomaSearch
            onSearch={handleSearch}
            decisions={graduationDecisionModel.decisions}
            loading={diplomaModel.loading}
          />
        </TabPane>

        <TabPane tab="Quản lý sổ văn bằng" key="books">
          <Card
            title="Danh sách sổ văn bằng"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setBookModalVisible(true)}
              >
                Thêm sổ mới
              </Button>
            }
          >
            <Table
              columns={bookColumns}
              dataSource={diplomaBookModel.books}
              rowKey="id"
              loading={diplomaBookModel.loading}
            />
          </Card>
        </TabPane>

        <TabPane tab="Quyết định tốt nghiệp" key="decisions">
          <Card
            title="Danh sách quyết định tốt nghiệp"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDecisionModalVisible(true)}
              >
                Thêm quyết định
              </Button>
            }
          >
            <Table
              columns={decisionColumns}
              dataSource={graduationDecisionModel.decisions}
              rowKey="id"
              loading={graduationDecisionModel.loading}
            />
          </Card>
        </TabPane>

        <TabPane tab="Cấu hình biểu mẫu" key="fields">
          <Card
            title="Danh sách trường thông tin"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setFieldModalVisible(true)}
              >
                Thêm trường
              </Button>
            }
          >
            <Table
              columns={fieldColumns}
              dataSource={diplomaFieldModel.fields}
              rowKey="id"
              loading={diplomaFieldModel.loading}
            />
          </Card>
        </TabPane>

        <TabPane tab="Thông tin văn bằng" key="diplomas">
          <Card
            title="Danh sách văn bằng"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDiplomaModalVisible(true)}
              >
                Thêm văn bằng
              </Button>
            }
          >
            <DiplomaTable
              diplomas={diplomaModel.diplomas}
              decisions={graduationDecisionModel.decisions}
              loading={diplomaModel.loading}
              onEdit={handleEditDiploma}
              onDelete={handleDeleteDiploma}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modals */}
      <FormDiplomaBook
        visible={bookModalVisible}
        onCancel={() => {
          setBookModalVisible(false);
          setEditingBook(null);
        }}
        onSubmit={editingBook ? handleUpdateBook : handleAddBook}
        initialValues={editingBook ? { year: editingBook.year } : undefined}
        loading={diplomaBookModel.loading}
      />

      <FormGraduationDecision
        visible={decisionModalVisible}
        onCancel={() => {
          setDecisionModalVisible(false);
          setEditingDecision(null);
        }}
        onSubmit={editingDecision ? handleUpdateDecision : handleAddDecision}
        initialValues={editingDecision ? {
          bookId: editingDecision.bookId,
          batchNumber: editingDecision.batchNumber,
          decisionNumber: editingDecision.decisionNumber,
          decisionDate: editingDecision.decisionDate,
          summary: editingDecision.summary,
        } : undefined}
        loading={graduationDecisionModel.loading}
        books={diplomaBookModel.books}
      />

      <FormDiplomaField
        visible={fieldModalVisible}
        onCancel={() => {
          setFieldModalVisible(false);
          setEditingField(null);
        }}
        onSubmit={editingField ? handleUpdateField : handleAddField}
        initialValues={editingField ? {
          name: editingField.name,
          type: editingField.type,
          required: editingField.required,
        } : undefined}
        loading={diplomaFieldModel.loading}
      />

      <FormDiploma
        visible={diplomaModalVisible}
        onCancel={() => {
          setDiplomaModalVisible(false);
          setEditingDiploma(null);
        }}
        onSubmit={editingDiploma ? handleUpdateDiploma : handleAddDiploma}
        initialValues={editingDiploma ? {
          diplomaNumber: editingDiploma.diplomaNumber,
          studentId: editingDiploma.studentId,
          name: editingDiploma.name,
          birthDate: editingDiploma.birthDate,
          decisionId: editingDiploma.decisionId,
          bookId: editingDiploma.bookId,
          customFields: editingDiploma.customFields,
        } : undefined}
        loading={diplomaModel.loading}
        decisions={graduationDecisionModel.decisions}
        fields={diplomaFieldModel.fields}
        books={diplomaBookModel.books}
      />
    </div>
  );
};

export default TH04;
