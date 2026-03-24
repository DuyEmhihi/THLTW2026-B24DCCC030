import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, message, Divider } from 'antd';
import type { DiplomaForm, DiplomaField, GraduationDecision, DiplomaBook } from '../../services/TH04/typings';

interface FormDiplomaProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: DiplomaForm) => Promise<void>;
  initialValues?: Partial<DiplomaForm>;
  loading?: boolean;
  decisions: GraduationDecision[];
  fields: DiplomaField[];
  books: DiplomaBook[];
}

const FormDiploma: React.FC<FormDiplomaProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
  decisions,
  fields,
  books,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        const formValues = {
          ...initialValues,
          birthDate: initialValues.birthDate ? new Date(initialValues.birthDate) : undefined,
        };

        // Set customFields as flat fields for form
        if (initialValues.customFields) {
          Object.keys(initialValues.customFields).forEach(fieldId => {
            formValues[`customFields.${fieldId}`] = initialValues.customFields[fieldId];
          });
        }

        form.setFieldsValue(formValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Extract and process customFields from nested structure
      const customFields: Record<string, any> = {};
      Object.keys(values).forEach(key => {
        if (key.startsWith('customFields.')) {
          const fieldId = key.replace('customFields.', '');
          const value = values[key];

          // Convert DatePicker values to string
          if (value && typeof value === 'object' && value.format) {
            customFields[fieldId] = value.format('YYYY-MM-DD');
          } else {
            customFields[fieldId] = value;
          }

          delete values[key];
        }
      });

      // Handle date conversion safely
      let birthDateStr: string;
      if (values.birthDate) {
        if (typeof values.birthDate === 'string') {
          birthDateStr = values.birthDate;
        } else if (values.birthDate.format) {
          birthDateStr = values.birthDate.format('YYYY-MM-DD');
        } else {
          birthDateStr = new Date(values.birthDate).toISOString().split('T')[0];
        }
      } else {
        throw new Error('Ngày sinh là bắt buộc');
      }

      const submitValues: DiplomaForm = {
        ...values,
        birthDate: birthDateStr,
        customFields,
      };
      await onSubmit(submitValues);
      form.resetFields();
    } catch (error: any) {
      // Handle validation errors and API errors
      if (error.errorFields) {
        // Form validation error - let Antd handle it
        return;
      }
      // API error - show message
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const renderFieldInput = (field: DiplomaField) => {
    const fieldName = `customFields.${field.id}`;

    switch (field.type) {
      case 'string':
        return (
          <Input
            placeholder={`Nhập ${field.name.toLowerCase()}`}
          />
        );
      case 'number':
        return (
          <InputNumber
            placeholder={`Nhập ${field.name.toLowerCase()}`}
            style={{ width: '100%' }}
          />
        );
      case 'date':
        return (
          <DatePicker
            placeholder={`Chọn ${field.name.toLowerCase()}`}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        );
      default:
        return <Input placeholder={`Nhập ${field.name.toLowerCase()}`} />;
    }
  };

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa thông tin văn bằng" : "Thêm thông tin văn bằng mới"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="decisionId"
          label="Quyết định tốt nghiệp"
          rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp' }]}
        >
          <Select placeholder="Chọn quyết định tốt nghiệp">
            {decisions.map(decision => (
              <Select.Option key={decision.id} value={decision.id}>
                {decision.decisionNumber} - Đợt {decision.batchNumber} ({decision.summary})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="bookId"
          label="Sổ văn bằng"
          rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
        >
          <Select placeholder="Chọn sổ văn bằng">
            {books.map(book => (
              <Select.Option key={book.id} value={book.id}>
                Sổ năm {book.year}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Divider>Thông tin cơ bản</Divider>

        <Form.Item
          name="diplomaNumber"
          label="Số hiệu văn bằng"
          rules={[
            { required: true, message: 'Vui lòng nhập số hiệu văn bằng' },
            { pattern: /^[A-Z0-9/-]+$/, message: 'Số hiệu văn bằng chỉ chứa chữ cái, số, gạch ngang và gạch chéo' }
          ]}
        >
          <Input placeholder="Ví dụ: ĐH-2024-001" />
        </Form.Item>

        <Form.Item
          name="studentId"
          label="Mã sinh viên"
          rules={[
            { required: true, message: 'Vui lòng nhập mã sinh viên' },
            { pattern: /^[A-Z0-9]+$/, message: 'Mã sinh viên chỉ chứa chữ cái và số' }
          ]}
        >
          <Input placeholder="Ví dụ: SV2024001" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Họ tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
          ]}
        >
          <Input placeholder="Nhập họ tên đầy đủ" />
        </Form.Item>

        <Form.Item
          name="birthDate"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            style={{ width: '100%' }}
          />
        </Form.Item>

        {fields.length > 0 && (
          <>
            <Divider>Thông tin bổ sung</Divider>
            {fields.map(field => (
              <Form.Item
                key={field.id}
                name={`customFields.${field.id}`}
                label={field.name}
              >
                {renderFieldInput(field)}
              </Form.Item>
            ))}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FormDiploma;