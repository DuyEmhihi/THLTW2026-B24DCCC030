import React, { useEffect } from 'react';
import { Card, Tag, Avatar, Button, Spin } from 'antd';
import { UserOutlined, EyeOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import styles from './PostDetail.less';

interface PostDetailProps {
  post: Post;
  relatedPosts?: Post[];
  onBack?: () => void;
  onRelatedPostClick?: (post: Post) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post,
  relatedPosts = [],
  onBack,
  onRelatedPostClick
}) => {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // Increment view count
    const incrementViews = async () => {
      setLoading(true);
      try {
        await blogService.incrementViews(post.id);
      } catch (error) {
        console.error('Error incrementing views:', error);
      } finally {
        setLoading(false);
      }
    };

    incrementViews();
  }, [post.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      {onBack && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className={styles.backButton}
        >
          Quay lại danh sách
        </Button>
      )}

      <Card className={styles.postCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.meta}>
            <div className={styles.author}>
              <Avatar size="small" src={post.author.avatar} icon={<UserOutlined />} />
              <span>{post.author.name}</span>
            </div>
            <div className={styles.date}>
              <CalendarOutlined />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className={styles.views}>
              <EyeOutlined />
              <span>{post.views + (loading ? 0 : 1)} lượt xem</span>
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

        {post.coverImage && (
          <div className={styles.coverImage}>
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        <div className={styles.content}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </Card>

      {relatedPosts.length > 0 && (
        <Card title="Bài viết liên quan" className={styles.relatedPosts}>
          <div className={styles.relatedList}>
            {relatedPosts.map(relatedPost => (
              <div
                key={relatedPost.id}
                className={styles.relatedItem}
                onClick={() => onRelatedPostClick?.(relatedPost)}
              >
                <img src={relatedPost.coverImage} alt={relatedPost.title} />
                <div className={styles.relatedContent}>
                  <h4>{relatedPost.title}</h4>
                  <p>{relatedPost.summary}</p>
                  <div className={styles.relatedMeta}>
                    <span>{formatDate(relatedPost.createdAt)}</span>
                    <span>{relatedPost.views} lượt xem</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PostDetail;