import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import { Post, PostFormData, Tag } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import { TinyEditor } from '@/components/TinyEditor';

const { TextArea } = Input;
const { Option } = Select;

interface PostFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  post?: Post;
  tags: Tag[];
}

const PostForm: React.FC<PostFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  post,
  tags
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible && post) {
      form.setFieldsValue({
        title: post.title,
        slug: post.slug,
        content: post.content,
        summary: post.summary,
        coverImage: post.coverImage,
        tagIds: post.tags.map(tag => tag.id),
        status: post.status
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, post, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!post) { // Only auto-generate slug for new posts
      const slug = generateSlug(title);
      form.setFieldsValue({ slug });
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData: PostFormData = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        summary: values.summary,
        coverImage: values.coverImage,
        tagIds: values.tagIds || [],
        status: values.status
      };

      if (post) {
        await blogService.updatePost(post.id, formData);
        message.success('Cập nhật bài viết thành công');
      } else {
        await blogService.createPost(formData);
        message.success('Tạo bài viết thành công');
      }

      onSuccess();
      onCancel();
    } catch (error) {
      message.error(post ? 'Cập nhật bài viết thất bại' : 'Tạo bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={post ? 'Sửa bài viết' : 'Thêm bài viết mới'}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'draft'
        }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết"
            onChange={handleTitleChange}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
        >
          <Input placeholder="nhap-tieu-de-bai-viet" />
        </Form.Item>

        <Form.Item
          name="summary"
          label="Tóm tắt"
          rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
        >
          <TextArea
            rows={3}
            placeholder="Tóm tắt ngắn gọn về bài viết"
          />
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Ảnh đại diện (URL)"
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item
          name="tagIds"
          label="Thẻ"
        >
          <Select
            mode="multiple"
            placeholder="Chọn thẻ cho bài viết"
            allowClear
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <TinyEditor
            value={form.getFieldValue('content')}
            onChange={(value) => form.setFieldsValue({ content: value })}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Option value="draft">Nháp</Option>
            <Option value="published">Đã đăng</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {post ? 'Cập nhật' : 'Tạo bài viết'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostForm;