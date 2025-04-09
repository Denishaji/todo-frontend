import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './App.css';
import TaskList from './components/TaskList';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const backendUrl = 'http://localhost:5050/api/todos';

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(backendUrl);
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleInputChange = (event) => {
    setNewTodoText(event.target.value);
  };

  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleCompleted = async (id) => {
    try {
      const updatedTodo = { ...todos.find((todo) => todo._id === id) };
      updatedTodo.completed = !updatedTodo.completed;

      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Todo List</h1>
          <Form className="d-flex mb-3">
            <Form.Control
              type="text"
              value={newTodoText}
              onChange={handleInputChange}
              placeholder="Enter a new todo..."
            />
            <Button variant="primary" className="ms-2" onClick={handleAddTodo}>
              Add Todo
            </Button>
          </Form>
          <TaskList
            todos={todos}
            onToggleCompleted={handleToggleCompleted}
            onDeleteTodo={handleDeleteTodo}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
