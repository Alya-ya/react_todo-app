import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoContextType = {
  todos: Todo[];

  setTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const getInitialTodos = (): Todo[] => {
    const savedTodos = localStorage.getItem('todos');

    if (savedTodos) {
      return JSON.parse(savedTodos);
    }

    return [];
  };

  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
};
