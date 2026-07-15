export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  due_date: string | null;
  priority: Priority | null;
  label: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TodoCreateInput = {
  title: string;
  due_date: string | null;
  priority: Priority | null;
  label: string | null;
};

export type TodoUpdateInput = TodoCreateInput & {
  completed: boolean;
};

export type TodoFilters = {
  search: string;
  completed: 'all' | 'complete' | 'incomplete';
  priority: 'all' | Priority;
  label: string;
};
