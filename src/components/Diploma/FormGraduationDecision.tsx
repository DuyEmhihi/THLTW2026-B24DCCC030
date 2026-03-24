import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import type { GraduationDecisionForm } from '../../services/TH04/typings';
import type { DiplomaBook } from '../../services/TH04/typings';

interface FormGraduationDecisionProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: GraduationDecisionForm) => Promise<void>;
  initialValues?: Partial<GraduationDecisionForm>;
  loading?: boolean;
  books: DiplomaBook[];
}

const FormGraduationDecision: React.FC<FormGraduationDecisionProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
  books,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          decisionDate: initialValues.decisionDate ? new Date(initialValues.decisionDate) : undefined,
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitValues: GraduationDecisionForm = {
        ...values,
        decisionDate: values.decisionDate.format('YYYY-MM-DD'),
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

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa quyết định tốt nghiệp" : "Thêm quyết định tốt nghiệp mới"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
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

        <Form.Item
          name="batchNumber"
          label="Đợt tốt nghiệp"
          rules={[
            { required: true, message: 'Vui lòng nhập số đợt' },
            { type: 'number', min: 1, message: 'Số đợt phải lớn hơn 0' }
          ]}
        >
          <InputNumber
            placeholder="Nhập số đợt"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="decisionNumber"
          label="Số quyết định"
          rules={[
            { required: true, message: 'Vui lòng nhập số quyết định' },
            { pattern: /^[A-Z0-9/-]+$/, message: 'Số quyết định chỉ chứa chữ cái, số, gạch ngang và gạch chéo' }
          ]}
        >
          <Input placeholder="Ví dụ: 1234/QĐ-ĐH" />
        </Form.Item>

        <Form.Item
          name="decisionDate"
          label="Ngày ban hành"
          rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
        >
          <DatePicker
            placeholder="Chọn ngày ban hành"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="summary"
          label="Trích yếu"
          rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
        >
          <Input.TextArea
            placeholder="Nhập trích yếu quyết định"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormGraduationDecision;