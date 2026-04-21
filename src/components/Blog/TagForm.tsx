import React, { useEffect } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { Tag, TagFormData } from '@/models/blog';
import { blogService } from '@/services/Blog/service';

interface TagFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  tag?: Tag;
}

const TagForm: React.FC<TagFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  tag
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible && tag) {
      form.setFieldsValue({
        name: tag.name
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, tag, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData: TagFormData = {
        name: values.name
      };

      if (tag) {
        await blogService.updateTag(tag.id, formData);
        message.success('Cập nhật thẻ thành công');
      } else {
        await blogService.createTag(formData);
        message.success('Tạo thẻ thành công');
      }

      onSuccess();
      onCancel();
    } catch (error) {
      message.error(tag ? 'Cập nhật thẻ thất bại' : 'Tạo thẻ thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={tag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Tên thẻ"
          rules={[
            { required: true, message: 'Vui lòng nhập tên thẻ' },
            { min: 2, message: 'Tên thẻ phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Tên thẻ không được vượt quá 50 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên thẻ" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {tag ? 'Cập nhật' : 'Tạo thẻ'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagForm;