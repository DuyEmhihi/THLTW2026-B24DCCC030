import React from 'react';
import { Modal, Form, Input, Select, Switch, message } from 'antd';
import type { DiplomaFieldForm } from '../../services/TH04/typings';

interface FormDiplomaFieldProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: DiplomaFieldForm) => Promise<void>;
  initialValues?: Partial<DiplomaFieldForm>;
  loading?: boolean;
}

const FormDiplomaField: React.FC<FormDiplomaFieldProps> = ({
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
      title={initialValues ? "Chỉnh sửa trường thông tin" : "Thêm trường thông tin mới"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Tên trường"
          rules={[
            { required: true, message: 'Vui lòng nhập tên trường' },
            { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Tên trường chỉ chứa chữ cái và khoảng trắng' }
          ]}
        >
          <Input placeholder="Ví dụ: Dân tộc, Điểm trung bình" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Kiểu dữ liệu"
          rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
        >
          <Select placeholder="Chọn kiểu dữ liệu">
            <Select.Option value="string">Chuỗi (String)</Select.Option>
            <Select.Option value="number">Số (Number)</Select.Option>
            <Select.Option value="date">Ngày (Date)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="required"
          label="Bắt buộc"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormDiplomaField;