import React, { useState } from "react";
import { TodoTypes } from "../types";
import { log } from "console";
import { Input } from "postcss";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "@/constants/url";

type TodoProps = {
  todo: TodoTypes;
};

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(todo.title);
  const { todos, isLoading, error, mutate } = useTodos();

  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      const response = await fetch(
        API_URL + "/editTodo/" + String(todo.id),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle }),
        }
      );

      if (response.ok) {
        const editTodo = await response.json();
        const updateTodos = todos.map((todo: TodoTypes) =>
          todo.id === editTodo.id ? editTodo : todo
        );
        mutate(updateTodos);
        setEditTitle("");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(
      API_URL + "/deleteTodo/" + String(todo.id),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const deleteTodo = await response.json();
      const updateTodos = todos.filter((todo: TodoTypes) => todo.id !== id);
      mutate(updateTodos);
    }
  };

  const toggleTodoCompletion = async () => {
    const response = await fetch(
      API_URL + "/editTodo/" + String(todo.id),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      }
    );

    if (response.ok) {
      const editTodo = await response.json();
      console.log(editTodo);

      const updateTodos = todos.map((todo: TodoTypes) =>
        todo.id === editTodo.id ? editTodo : todo
      );
      mutate(updateTodos);
    }
  };

  return (
    <div>
      <li className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="todo1"
              name="todo1"
              type="checkbox"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500
                  border-gray-300 rounded"
              checked={todo.isCompleted ? true : false}
              onChange={toggleTodoCompletion}
            />
            <label className="ml-3 block text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  className="border rounded py-1 px-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                ></input>
              ) : (
                <span
                  className={
                    todo.isCompleted
                      ? "text-lg font-medium mr-2 line-through"
                      : "text-lg font-medium mr-2"
                  }
                >
                  {todo.title}
                </span>
              )}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
            >
              {isEditing ? "save" : "✒"}
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Todo;
