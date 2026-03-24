import React from 'react';
import { Modal, Form, InputNumber, message } from 'antd';
import type { DiplomaBookForm } from '../../services/TH04/typings';

interface FormDiplomaBookProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: DiplomaBookForm) => Promise<void>;
  initialValues?: Partial<DiplomaBookForm>;
  loading?: boolean;
}

const FormDiplomaBook: React.FC<FormDiplomaBookProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
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
      title={initialValues ? "Chỉnh sửa sổ văn bằng" : "Thêm sổ văn bằng mới"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="year"
          label="Năm"
          rules={[
            { required: true, message: 'Vui lòng nhập năm' },
            { type: 'number', min: 2000, max: new Date().getFullYear() + 10, message: 'Năm không hợp lệ' }
          ]}
        >
          <InputNumber
            placeholder="Nhập năm"
            style={{ width: '100%' }}
            disabled={!!initialValues} // Không cho chỉnh sửa năm nếu đang edit
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormDiplomaBook;