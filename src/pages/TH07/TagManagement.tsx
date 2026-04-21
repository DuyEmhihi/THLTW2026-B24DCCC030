import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Tag as AntTag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Tag } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import TagForm from '@/components/Blog/TagForm';
import styles from './TagManagement.less';

const BlogTagManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagFormVisible, setTagFormVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>();

  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await blogService.getTags();
      if (response.success) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      message.error('Lỗi tải danh sách thẻ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleAddTag = () => {
    setEditingTag(undefined);
    setTagFormVisible(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setTagFormVisible(true);
  };

  const handleDeleteTag = async (tag: Tag) => {
    try {
      const response = await blogService.deleteTag(tag.id);
      if (response.success) {
        message.success('Xóa thẻ thành công');
        loadTags();
      } else {
        message.error(response.message || 'Xóa thẻ thất bại');
      }
    } catch (error) {
      message.error('Lỗi xóa thẻ');
    }
  };

  const handleTagFormSuccess = () => {
    loadTags();
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <AntTag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
          {name}
        </AntTag>
      ),
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
      sorter: (a: Tag, b: Tag) => a.postCount - b.postCount,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Tag) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTag(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thẻ này?"
            description={record.postCount > 0 ? `Thẻ này đang được sử dụng bởi ${record.postCount} bài viết.` : ''}
            onConfirm={() => handleDeleteTag(record)}
            okText="Xóa"
            cancelText="Hủy"
            disabled={record.postCount > 0}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.postCount > 0}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ height: '100%' }}>
      <div className={styles.header}>
        <h1>Quản lý thẻ</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddTag}
        >
          Thêm thẻ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} thẻ`,
        }}
      />

      <TagForm
        visible={tagFormVisible}
        onCancel={() => setTagFormVisible(false)}
        onSuccess={handleTagFormSuccess}
        tag={editingTag}
      />
    </Card>
  );
};

export default BlogTagManagement;