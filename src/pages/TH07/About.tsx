import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, MailOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Author } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import styles from './About.less';

const BlogAbout: React.FC = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthor();
  }, []);

  const loadAuthor = async () => {
    setLoading(true);
    try {
      const response = await blogService.getAuthor();
      if (response.success) {
        setAuthor(response.data);
      }
    } catch (error) {
      console.error('Error loading author:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !author) {
    return <Card loading={loading} bodyStyle={{ height: '400px' }} />;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.aboutCard}>
        <div className={styles.header}>
          <Avatar
            size={120}
            src={author.avatar}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          <div className={styles.info}>
            <h1>{author.name}</h1>
            <p className={styles.bio}>{author.bio}</p>
          </div>
        </div>

        <Divider />

        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Kỹ năng</h2>
            <div className={styles.skills}>
              {author.skills.map(skill => (
                <Tag key={skill} color="blue" className={styles.skillTag}>
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Liên kết</h2>
            <div className={styles.socialLinks}>
              {author.socialLinks.github && (
                <a
                  href={author.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <GithubOutlined />
                  <span>GitHub</span>
                </a>
              )}
              {author.socialLinks.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <LinkedinOutlined />
                  <span>LinkedIn</span>
                </a>
              )}
              {author.socialLinks.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <span>Twitter</span>
                </a>
              )}
              {author.socialLinks.email && (
                <a
                  href={`mailto:${author.socialLinks.email}`}
                  className={styles.socialLink}
                >
                  <MailOutlined />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlogAbout;