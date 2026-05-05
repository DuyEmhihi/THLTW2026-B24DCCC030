import { Task, TaskStats } from '@/models/task';

const STORAGE_KEY = 'kanban_tasks';

// Initialize with sample data if localStorage is empty
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Thiết kế UI mockup',
    description: 'Tạo mockup cho trang chủ',
    status: 'done',
    priority: 'high',
    tags: ['design', 'ui'],
    deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Phát triển API backend',
    description: 'Xây dựng các API endpoints',
    status: 'inProgress',
    priority: 'high',
    tags: ['backend', 'api'],
    deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Viết unit tests',
    description: 'Viết test cho các component',
    status: 'todo',
    priority: 'medium',
    tags: ['testing'],
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Cập nhật tài liệu',
    description: 'Viết README và documentation',
    status: 'todo',
    priority: 'low',
    tags: ['documentation'],
    deadline: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Quá hạn
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Review code',
    description: 'Review pull requests',
    status: 'inProgress',
    priority: 'medium',
    tags: ['review'],
    deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class TaskService {
  /**
   * Lấy tất cả tasks
   */
  getAllTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveTasks(initialTasks);
        return initialTasks;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  /**
   * Lưu danh sách tasks xuống localStorage
   */
  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  /**
   * Thêm task mới
   */
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const tasks = this.getAllTasks();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  /**
   * Cập nhật task
   */
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      id: tasks[index].id, // Không cho phép thay đổi ID
      createdAt: tasks[index].createdAt, // Không cho phép thay đổi createdAt
      updatedAt: new Date().toISOString(),
    };
    this.saveTasks(tasks);
    return tasks[index];
  }

  /**
   * Xóa task
   */
  deleteTask(id: string): boolean {
    const tasks = this.getAllTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    this.saveTasks(filtered);
    return true;
  }

  /**
   * Lấy task theo ID
   */
  getTaskById(id: string): Task | null {
    const tasks = this.getAllTasks();
    return tasks.find((t) => t.id === id) || null;
  }

  /**
   * Lấy tasks theo status
   */
  getTasksByStatus(status: Task['status']): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter((t) => t.status === status);
  }

  /**
   * Tính toán thống kê
   */
  getStats(): TaskStats {
    const tasks = this.getAllTasks();
    const now = new Date().toISOString().split('T')[0];
    const overdueTasks = tasks.filter(
      (t) => t.status !== 'done' && t.deadline < now,
    );

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'done').length,
      overdueTasks: overdueTasks.length,
    };
  }

  /**
   * Cập nhật status task (dùng cho drag & drop)
   */
  updateTaskStatus(id: string, status: Task['status']): Task | null {
    return this.updateTask(id, { status });
  }

  /**
   * Xóa tất cả tasks (reset)
   */
  clearAllTasks(): void {
    this.saveTasks([]);
  }

  /**
   * Reset về dữ liệu mặc định
   */
  resetToDefault(): void {
    this.saveTasks(initialTasks);
  }
}

export default new TaskService();
