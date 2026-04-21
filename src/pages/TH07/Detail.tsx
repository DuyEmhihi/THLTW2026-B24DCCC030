import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { useParams, useHistory } from 'umi';
import { Post } from '@/models/blog';
import { blogService } from '@/services/Blog/service';
import PostDetail from '@/components/Blog/PostDetail';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const response = await blogService.getPostBySlug(slug);
      if (response.success) {
        setPost(response.data);
        loadRelatedPosts(response.data);
      } else {
        message.error('Không tìm thấy bài viết');
        history.push('/th07');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      message.error('Lỗi tải bài viết');
      history.push('/th07');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (currentPost: Post) => {
    try {
      // Get posts with same tags (excluding current post)
      const tagIds = currentPost.tags.map(tag => tag.id);
      const relatedPromises = tagIds.map(tagId =>
        blogService.getPosts({
          tagId,
          pageSize: 5,
          status: 'published'
        })
      );

      const responses = await Promise.all(relatedPromises);
      const allRelatedPosts: Post[] = [];

      responses.forEach(response => {
        if (response.success) {
          response.data.posts.forEach(post => {
            if (post.id !== currentPost.id && !allRelatedPosts.find(p => p.id === post.id)) {
              allRelatedPosts.push(post);
            }
          });
        }
      });

      // Limit to 3 related posts
      setRelatedPosts(allRelatedPosts.slice(0, 3));
    } catch (error) {
      console.error('Error loading related posts:', error);
    }
  };

  const handleBack = () => {
    history.push('/th07');
  };

  const handleRelatedPostClick = (relatedPost: Post) => {
    history.push(`/th07/detail/${relatedPost.slug}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <PostDetail
      post={post}
      relatedPosts={relatedPosts}
      onBack={handleBack}
      onRelatedPostClick={handleRelatedPostClick}
    />
  );
};

export default BlogDetail;