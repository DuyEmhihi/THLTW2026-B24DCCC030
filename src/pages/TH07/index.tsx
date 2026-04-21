import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Input, Pagination, Select, Tag as AntTag, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import { Post, Tag } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import BlogCard from '@/components/Blog/BlogCard';
import styles from './index.less';

const { Option } = Select;

const BlogHome: React.FC = () => {
  const history = useHistory();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const pageSize = 9;

  const loadPosts = useCallback(async (page = 1, search = '', tagId = '') => {
    setLoading(true);
    try {
      const response = await blogService.getPosts({
        page,
        pageSize,
        search: search || undefined,
        tagId: tagId || undefined,
        status: 'published'
      });

      if (response.success) {
        setPosts(response.data.posts);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const response = await blogService.getTags();
      if (response.success) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, []);

  useEffect(() => {
    loadTags();
    loadPosts();
  }, [loadPosts, loadTags]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      loadPosts(1, value, selectedTag);
    }, 300);

    setDebounceTimer(timer);
  };

  const handleTagFilter = (tagId: string) => {
    setSelectedTag(tagId);
    setCurrentPage(1);
    loadPosts(1, searchText, tagId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadPosts(page, searchText, selectedTag);
  };

  const handlePostClick = (post: Post) => {
    history.push(`/th07/detail/${post.slug}`);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedTag('');
    setCurrentPage(1);
    loadPosts(1, '', '');
  };

  return (
    <Card bodyStyle={{ height: '100%' }}>
      <div className={styles.header}>
        <h1>Blog Cá Nhân</h1>
        <p>Chia sẻ kiến thức và kinh nghiệm lập trình</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.search}>
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>

        <div className={styles.tagFilter}>
          <span>Thẻ: </span>
          <Select
            value={selectedTag}
            onChange={handleTagFilter}
            style={{ minWidth: 120 }}
            allowClear
            placeholder="Chọn thẻ"
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>
                {tag.name} ({tag.postCount})
              </Option>
            ))}
          </Select>
        </div>

        {(searchText || selectedTag) && (
          <div className={styles.clearFilters}>
            <a onClick={clearFilters}>Xóa bộ lọc</a>
          </div>
        )}
      </div>

      {selectedTag && (
        <div className={styles.activeFilters}>
          <span>Đang lọc thẻ: </span>
          <AntTag
            color="blue"
            closable
            onClose={() => handleTagFilter('')}
          >
            {tags.find(t => t.id === selectedTag)?.name}
          </AntTag>
        </div>
      )}

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : posts.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {posts.map(post => (
                <Col xs={24} sm={12} lg={8} key={post.id}>
                  <BlogCard
                    post={post}
                    onClick={() => handlePostClick(post)}
                  />
                </Col>
              ))}
            </Row>

            {total > pageSize && (
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} bài viết`
                  }
                />
              </div>
            )}
          </>
        ) : (
          <Empty
            description={
              searchText || selectedTag
                ? 'Không tìm thấy bài viết nào phù hợp'
                : 'Chưa có bài viết nào'
            }
          />
        )}
      </div>
    </Card>
  );
};

export default BlogHome;