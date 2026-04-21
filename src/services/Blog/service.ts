import { Post, Tag, Author, PostFormData, TagFormData, ApiResponse } from '@/models/blog';
import { BlogService } from './typings.d';

const POSTS_KEY = 'blog-posts';
const TAGS_KEY = 'blog-tags';
const AUTHOR_KEY = 'blog-author';

const getStoredPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredTags = (): Tag[] => {
  try {
    const stored = localStorage.getItem(TAGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredAuthor = (): Author => {
  try {
    const stored = localStorage.getItem(AUTHOR_KEY);
    return stored ? JSON.parse(stored) : {
      name: 'Nguyễn Văn A',
      bio: 'Tôi là một lập trình viên đam mê công nghệ và chia sẻ kiến thức.',
      avatar: 'https://via.placeholder.com/150',
      skills: ['React', 'TypeScript', 'Node.js', 'Python'],
      socialLinks: {
        github: 'https://github.com/example',
        linkedin: 'https://linkedin.com/in/example',
        email: 'example@email.com'
      }
    };
  } catch {
    return {
      name: 'Nguyễn Văn A',
      bio: 'Tôi là một lập trình viên đam mê công nghệ và chia sẻ kiến thức.',
      avatar: 'https://via.placeholder.com/150',
      skills: ['React', 'TypeScript', 'Node.js', 'Python'],
      socialLinks: {
        github: 'https://github.com/example',
        linkedin: 'https://linkedin.com/in/example',
        email: 'example@email.com'
      }
    };
  }
};

const savePosts = (posts: Post[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

const saveTags = (tags: Tag[]) => {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};

const saveAuthor = (author: Author) => {
  localStorage.setItem(AUTHOR_KEY, JSON.stringify(author));
};

export const blogService: BlogService = {
  // Post operations
  getPosts: async (params = {}): Promise<ApiResponse<{ posts: Post[]; total: number }>> => {
    try {
      const posts = getStoredPosts();
      const tags = getStoredTags();

      // Add tags to posts
      const postsWithTags = posts.map(post => ({
        ...post,
        tags: post.tags.map(tagId => tags.find(t => t.id === tagId.id)!).filter(Boolean)
      }));

      let filteredPosts = postsWithTags;

      // Filter by status
      if (params.status) {
        filteredPosts = filteredPosts.filter(post => post.status === params.status);
      }

      // Filter by tag
      if (params.tagId) {
        filteredPosts = filteredPosts.filter(post =>
          post.tags.some(tag => tag.id === params.tagId)
        );
      }

      // Search by title
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.summary.toLowerCase().includes(searchLower)
        );
      }

      // Sort by created date (newest first)
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Pagination
      const page = params.page || 1;
      const pageSize = params.pageSize || 9;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          posts: paginatedPosts,
          total: filteredPosts.length
        }
      };
    } catch (error) {
      return {
        success: false,
        data: { posts: [], total: 0 },
        message: 'Lỗi tải danh sách bài viết'
      };
    }
  },

  getPostById: async (id: string): Promise<ApiResponse<Post>> => {
    try {
      const posts = getStoredPosts();
      const tags = getStoredTags();
      const post = posts.find(p => p.id === id);

      if (!post) {
        return { success: false, data: null as any, message: 'Không tìm thấy bài viết' };
      }

      const postWithTags = {
        ...post,
        tags: post.tags.map(tagId => tags.find(t => t.id === tagId.id)!).filter(Boolean)
      };

      return { success: true, data: postWithTags };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tải bài viết' };
    }
  },

  getPostBySlug: async (slug: string): Promise<ApiResponse<Post>> => {
    try {
      const posts = getStoredPosts();
      const tags = getStoredTags();
      const post = posts.find(p => p.slug === slug);

      if (!post) {
        return { success: false, data: null as any, message: 'Không tìm thấy bài viết' };
      }

      const postWithTags = {
        ...post,
        tags: post.tags.map(tagId => tags.find(t => t.id === tagId.id)!).filter(Boolean)
      };

      return { success: true, data: postWithTags };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tải bài viết' };
    }
  },

  createPost: async (data: PostFormData): Promise<ApiResponse<Post>> => {
    try {
      const posts = getStoredPosts();
      const tags = getStoredTags();
      const author = getStoredAuthor();

      const newPost: Post = {
        id: Date.now().toString(),
        ...data,
        tags: tags.filter(tag => data.tagIds.includes(tag.id)),
        author,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedPosts = [...posts, newPost];
      savePosts(updatedPosts);

      // Update tag post counts
      const updatedTags = tags.map(tag => ({
        ...tag,
        postCount: updatedPosts.filter(p => p.tags.some(t => t.id === tag.id)).length
      }));
      saveTags(updatedTags);

      return { success: true, data: newPost };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tạo bài viết' };
    }
  },

  updatePost: async (id: string, data: PostFormData): Promise<ApiResponse<Post>> => {
    try {
      const posts = getStoredPosts();
      const tags = getStoredTags();

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
      const updatedTags = tags.map(tag => ({
        ...tag,
        postCount: updatedPosts.filter(p => p.tags.some(t => t.id === tag.id)).length
      }));
      saveTags(updatedTags);

      const updatedPost = updatedPosts.find(p => p.id === id)!;
      return { success: true, data: updatedPost };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi cập nhật bài viết' };
    }
  },

  deletePost: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const posts = getStoredPosts();
      const newPosts = posts.filter(post => post.id !== id);
      savePosts(newPosts);

      // Update tag post counts
      const tags = getStoredTags();
      const updatedTags = tags.map(tag => ({
        ...tag,
        postCount: newPosts.filter(p => p.tags.some(t => t.id === tag.id)).length
      }));
      saveTags(updatedTags);

      return { success: true, data: true };
    } catch (error) {
      return { success: false, data: false, message: 'Lỗi xóa bài viết' };
    }
  },

  incrementViews: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const posts = getStoredPosts();
      const updatedPosts = posts.map(post =>
        post.id === id ? { ...post, views: post.views + 1 } : post
      );
      savePosts(updatedPosts);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, data: false, message: 'Lỗi cập nhật lượt xem' };
    }
  },

  // Tag operations
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    try {
      const tags = getStoredTags();
      return { success: true, data: tags };
    } catch (error) {
      return { success: false, data: [], message: 'Lỗi tải danh sách thẻ' };
    }
  },

  createTag: async (data: TagFormData): Promise<ApiResponse<Tag>> => {
    try {
      const tags = getStoredTags();
      const newTag: Tag = {
        id: Date.now().toString(),
        name: data.name,
        postCount: 0
      };

      const updatedTags = [...tags, newTag];
      saveTags(updatedTags);

      return { success: true, data: newTag };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tạo thẻ' };
    }
  },

  updateTag: async (id: string, data: TagFormData): Promise<ApiResponse<Tag>> => {
    try {
      const tags = getStoredTags();
      const updatedTags = tags.map(tag =>
        tag.id === id ? { ...tag, name: data.name } : tag
      );
      saveTags(updatedTags);

      const updatedTag = updatedTags.find(t => t.id === id)!;
      return { success: true, data: updatedTag };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi cập nhật thẻ' };
    }
  },

  deleteTag: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const tags = getStoredTags();
      const posts = getStoredPosts();

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
  },

  // Author
  getAuthor: async (): Promise<ApiResponse<Author>> => {
    try {
      const author = getStoredAuthor();
      return { success: true, data: author };
    } catch (error) {
      return { success: false, data: null as any, message: 'Lỗi tải thông tin tác giả' };
    }
  }
};