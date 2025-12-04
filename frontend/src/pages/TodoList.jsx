import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [date]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/tasks?date=${date}`);
      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await api.post("/api/tasks", {
        title: newTask,
        description,
        date,
      });
      setTasks([...tasks, res.data]);
      setNewTask("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, {
        done: !currentStatus,
      });
      setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="todo-container">
      <h2>Daily To-Do List</h2>
      
      <div className="date-picker">
        <label>Select Date: </label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
      </div>

      <form onSubmit={handleAddTask} className="todo-form">
        <input
          type="text"
          placeholder="New Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="todo-list">
          {tasks.length === 0 && <p>No tasks for this day.</p>}
          {tasks.map((task) => (
            <li key={task.id} className={`todo-item ${task.done ? "done" : ""}`}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggleTask(task.id, task.done)}
                />
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
              </div>
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
