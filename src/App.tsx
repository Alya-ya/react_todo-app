/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { TodoContext } from './Context';

export const App: React.FC = () => {
  const context = useContext(TodoContext);
  const [newTodo, setNewTodo] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [redact, setRedact] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const cancelEditing = () => {
    setEditingTodoId(null);
    setRedact('');
  };

  type Filter = 'all' | 'active' | 'completed';
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!editingTodoId) {
      return;
    }

    const timer = setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [editingTodoId]);

  if (context === null) {
    return null;
  }

  const { todos, setTodos } = context;
  const visibleTodos = {
    all: todos,
    active: todos.filter(todo => !todo.completed),
    completed: todos.filter(todo => todo.completed),
  };

  const handleSave = (id: string) => {
    const trimmedTitle = redact.trim();

    if (!trimmedTitle) {
      setTodos(todos.filter(todoItem => todoItem.id !== id));
      inputRef.current?.focus();
    } else {
      setTodos(
        todos.map(todoItem =>
          todoItem.id === id ? { ...todoItem, title: trimmedTitle } : todoItem,
        ),
      );
    }

    setEditingTodoId(null);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={
                todos.every(todo => todo.completed)
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              onClick={() => {
                setTodos(
                  todos.map(todo => ({
                    ...todo,
                    completed: !todos.every(todoItem => todoItem.completed),
                  })),
                );
              }}
              data-cy="ToggleAllButton"
            />
          )}

          <form
            onSubmit={event => {
              event.preventDefault();
              const todo = {
                id: `${newTodo}  ${new Date()}`,
                title: newTodo.trim(),
                completed: false,
              };

              setTodos([...todos, todo]);
              setNewTodo('');
            }}
          >
            <input
              data-cy="NewTodoField"
              ref={inputRef}
              type="text"
              value={newTodo}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => {
                setNewTodo(event.target.value);
              }}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos[filter].map(todo => (
              <div
                data-cy="Todo"
                key={todo.id}
                className={todo.completed ? 'todo completed' : 'todo'}
              >
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => {
                    setTodos(
                      todos.map(todoItem =>
                        todoItem.id === todo.id
                          ? { ...todoItem, completed: !todoItem.completed }
                          : todoItem,
                      ),
                    );
                  }}
                />

                {editingTodoId === todo.id ? (
                  <form
                    onSubmit={event => {
                      event.preventDefault();
                      handleSave(todo.id);
                    }}
                  >
                    <input
                      ref={editInputRef}
                      autoFocus
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={redact}
                      onChange={event => {
                        setRedact(event.target.value);
                      }}
                      onBlur={() => handleSave(todo.id)}
                      onKeyUp={event => {
                        if (event.key === 'Escape') {
                          cancelEditing();
                        }
                      }}
                    />
                  </form>
                ) : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setRedact(todo.title);
                      setEditingTodoId(todo.id);
                    }}
                  >
                    {todo.title}
                  </span>
                )}
                {editingTodoId !== todo.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      setTodos(
                        todos.filter(todoItem => todoItem.id !== todo.id),
                      );
                      inputRef.current?.focus();
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                onClick={() => {
                  setFilter('active');
                }}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                onClick={() => {
                  setFilter('completed');
                }}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.filter(todo => todo.completed).length === 0}
              onClick={() => {
                setTodos(todos.filter(todo => !todo.completed));
                inputRef.current?.focus();
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
