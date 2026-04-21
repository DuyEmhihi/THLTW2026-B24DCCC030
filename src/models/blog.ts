export interface Author {
  name: string;
  bio: string;
  avatar: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  postCount: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage: string;
  tags: Tag[];
  author: Author;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage: string;
  tagIds: string[];
  status: 'draft' | 'published';
}

export interface TagFormData {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

import { useState, useEffect } from 'react';

export default function useBlogModel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [author, setAuthor] = useState<Author>({
    name: 'Nguyễn Văn A',
    bio: 'Tôi là một lập trình viên đam mê công nghệ và chia sẻ kiến thức.',
    avatar: 'https://via.placeholder.com/150',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    socialLinks: {
      github: 'https://github.com/example',
      linkedin: 'https://linkedin.com/in/example',
      email: 'example@email.com'
    }
  });
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    loadPosts();
    loadTags();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('blog-posts');
      if (stored) {
        const parsedPosts = JSON.parse(stored);
        setPosts(parsedPosts);
      } else {
        // Initialize with sample data
        const samplePosts: Post[] = [
          {
            id: '1',
            title: 'Chào mừng đến với Blog cá nhân',
            slug: 'chao-mung-den-voi-blog-ca-nhan',
            content: '# Chào mừng đến với Blog cá nhân\n\nĐây là bài viết đầu tiên của tôi...',
            summary: 'Giới thiệu về blog cá nhân và những gì bạn sẽ tìm thấy ở đây.',
            coverImage: 'https://via.placeholder.com/400x200',
            tags: [{ id: '1', name: 'Giới thiệu', postCount: 1 }],
            author,
            status: 'published',
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setPosts(samplePosts);
        localStorage.setItem('blog-posts', JSON.stringify(samplePosts));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const stored = localStorage.getItem('blog-tags');
      if (stored) {
        setTags(JSON.parse(stored));
      } else {
        // Initialize with sample tags
        const sampleTags: Tag[] = [
          { id: '1', name: 'Giới thiệu', postCount: 1 },
          { id: '2', name: 'React', postCount: 0 },
          { id: '3', name: 'TypeScript', postCount: 0 }
        ];
        setTags(sampleTags);
        localStorage.setItem('blog-tags', JSON.stringify(sampleTags));
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('blog-posts', JSON.stringify(newPosts));
  };

  const saveTags = (newTags: Tag[]) => {
    setTags(newTags);
    localStorage.setItem('blog-tags', JSON.stringify(newTags));
  };

  const createPost = async (data: PostFormData): Promise<ApiResponse<Post>> => {
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        ...data,
        tags: tags.filter(tag => data.tagIds.includes(tag.id)),
        author,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newPosts = [...posts, newPost];
      savePosts(newPosts);

      // Update tag post counts
      updateTagPostCounts();

      return { success: true, data: newPost };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tạo bài viết' };
    }
  };

  const updatePost = async (id: string, data: PostFormData): Promise<ApiResponse<Post>> => {
    try {
      const updatedPosts = posts.map(post =>
        post.id === id
          ? {
              ...post,
              ...data,
              tags: tags.filter(tag => data.tagIds.includes(tag.id)),
              updatedAt: new Date().toISOString()
            }
          : post
      );
      savePosts(updatedPosts);

      // Update tag post counts
      updateTagPostCounts();

      const updatedPost = updatedPosts.find(p => p.id === id)!;
      return { success: true, data: updatedPost };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi cập nhật bài viết' };
    }
  };

  const deletePost = async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const newPosts = posts.filter(post => post.id !== id);
      savePosts(newPosts);

      // Update tag post counts
      updateTagPostCounts();

      return { success: true, data: true };
    } catch (error) {
      return { success: false, data: false, message: 'Lỗi xóa bài viết' };
    }
  };

  const incrementViews = (id: string) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, views: post.views + 1 } : post
    );
    savePosts(updatedPosts);
  };

  const createTag = async (data: TagFormData): Promise<ApiResponse<Tag>> => {
    try {
      const newTag: Tag = {
        id: Date.now().toString(),
        name: data.name,
        postCount: 0
      };

      const newTags = [...tags, newTag];
      saveTags(newTags);

      return { success: true, data: newTag };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tạo thẻ' };
    }
  };

  const updateTag = async (id: string, data: TagFormData): Promise<ApiResponse<Tag>> => {
    try {
      const updatedTags = tags.map(tag =>
        tag.id === id ? { ...tag, name: data.name } : tag
      );
      saveTags(updatedTags);

      const updatedTag = updatedTags.find(t => t.id === id)!;
      return { success: true, data: updatedTag };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi cập nhật thẻ' };
    }
  };

  const deleteTag = async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      // Check if tag is being used
      const postsUsingTag = posts.filter(post => post.tags.some(tag => tag.id === id));
      if (postsUsingTag.length > 0) {
        return { success: false, data: false, message: 'Không thể xóa thẻ đang được sử dụng' };
      }

      const newTags = tags.filter(tag => tag.id !== id);
      saveTags(newTags);

      return { success: true, data: true };
    } catch (error) {
      return { success: false, data: false, message: 'Lỗi xóa thẻ' };
    }
  };

  const updateTagPostCounts = () => {
    const updatedTags = tags.map(tag => ({
      ...tag,
      postCount: posts.filter(post => post.tags.some(t => t.id === tag.id)).length
    }));
    saveTags(updatedTags);
  };

  return {
    posts,
    tags,
    author,
    loading,
    loadPosts,
    loadTags,
    createPost,
    updatePost,
    deletePost,
    incrementViews,
    createTag,
    updateTag,
    deleteTag
  };
}