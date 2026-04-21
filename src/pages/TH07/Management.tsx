import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Space,
  Modal
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Post, Tag as TagType } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import PostForm from '@/components/Blog/PostForm';
import styles from './Management.less';

const { Option } = Select;

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [postFormVisible, setPostFormVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await blogService.getPosts({
        search: searchText || undefined,
        status: statusFilter as 'draft' | 'published' || undefined,
        pageSize: 1000 // Load all for management
      });

      if (response.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      message.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await blogService.getTags();
      if (response.success) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  useEffect(() => {
    loadPosts();
    loadTags();
  }, [searchText, statusFilter]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleAddPost = () => {
    setEditingPost(undefined);
    setPostFormVisible(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setPostFormVisible(true);
  };

  const handleDeletePost = async (post: Post) => {
    try {
      const response = await blogService.deletePost(post.id);
      if (response.success) {
        message.success('Xóa bài viết thành công');
        loadPosts();
      } else {
        message.error(response.message || 'Xóa bài viết thất bại');
      }
    } catch (error) {
      message.error('Lỗi xóa bài viết');
    }
  };

  const handlePostFormSuccess = () => {
    loadPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusText = (status: string) => {
    return status === 'published' ? 'Đã đăng' : 'Nháp';
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'green' : 'orange';
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: TagType[]) => (
        <div>
          {tags.map(tag => (
            <Tag key={tag.id} style={{ marginBottom: 4 }}>
              {tag.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: Post, b: Post) => a.views - b.views,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: Post, b: Post) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Post) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPost(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDeletePost(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ height: '100%' }}>
      <div className={styles.header}>
        <h1>Quản lý bài viết</h1>

        <div className={styles.actions}>
          <div className={styles.filters}>
            <Input
              placeholder="Tìm kiếm theo tiêu đề..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />

            <Select
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{ width: 120 }}
              allowClear
              placeholder="Trạng thái"
            >
              <Option value="draft">Nháp</Option>
              <Option value="published">Đã đăng</Option>
            </Select>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddPost}
          >
            Thêm bài viết
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bài viết`,
        }}
      />

      <PostForm
        visible={postFormVisible}
        onCancel={() => setPostFormVisible(false)}
        onSuccess={handlePostFormSuccess}
        post={editingPost}
        tags={tags}
      />
    </Card>
  );
};

export default BlogManagement;