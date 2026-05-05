// Task Model
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done'; // Cần làm, Đang làm, Hoàn thành
  priority: 'high' | 'medium' | 'low'; // Cao, Trung bình, Thấp
  tags: string[];
  deadline: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}
