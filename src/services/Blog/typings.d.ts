import { Post, Tag, Author, PostFormData, TagFormData, ApiResponse } from '@/models/blog';

export interface BlogService {
  // Post operations
  getPosts(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    tagId?: string;
    status?: 'draft' | 'published';
  }): Promise<ApiResponse<{ posts: Post[]; total: number }>>;

  getPostById(id: string): Promise<ApiResponse<Post>>;
  getPostBySlug(slug: string): Promise<ApiResponse<Post>>;
  createPost(data: PostFormData): Promise<ApiResponse<Post>>;
  updatePost(id: string, data: PostFormData): Promise<ApiResponse<Post>>;
  deletePost(id: string): Promise<ApiResponse<boolean>>;
  incrementViews(id: string): Promise<ApiResponse<boolean>>;

  // Tag operations
  getTags(): Promise<ApiResponse<Tag[]>>;
  createTag(data: TagFormData): Promise<ApiResponse<Tag>>;
  updateTag(id: string, data: TagFormData): Promise<ApiResponse<Tag>>;
  deleteTag(id: string): Promise<ApiResponse<boolean>>;

  // Author
  getAuthor(): Promise<ApiResponse<Author>>;
}