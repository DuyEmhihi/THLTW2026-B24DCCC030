import React from 'react';
import { Card, Tag, Avatar } from 'antd';
import { UserOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { Post } from '@/models/blog';
import styles from './BlogCard.less';

const { Meta } = Card;

interface BlogCardProps {
  post: Post;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={post.title}
          src={post.coverImage}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      onClick={onClick}
      className={styles.card}
    >
      <Meta
        title={post.title}
        description={
          <div>
            <p className={styles.summary}>{post.summary}</p>
            <div className={styles.meta}>
              <div className={styles.author}>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{post.author.name}</span>
              </div>
              <div className={styles.date}>
                <CalendarOutlined />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className={styles.views}>
                <EyeOutlined />
                <span>{post.views}</span>
              </div>
            </div>
            <div className={styles.tags}>
              {post.tags.map(tag => (
                <Tag key={tag.id} color="blue">
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default BlogCard;