/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskChanges, setTaskChanges] = useState<Record<number, string>>({}); // Keeps track of task name changes

  const handleFetchTasks = async () => {
    const fetchedTasks = await api.get('/tasks');
    setTasks(fetchedTasks);
    setTaskChanges({}); // Reset task changes when tasks are fetched
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`); // Call API to delete task
    handleFetchTasks(); // Refresh tasks after deletion
  };

  const handleSave = async (id: number) => {
    if (taskChanges[id] !== undefined) {
      await api.put(`/tasks/${id}`, { name: taskChanges[id] }); // Call API to update task name
      handleFetchTasks(); // Refresh tasks after saving
    }
  };

  const handleTaskNameChange = (id: number, value: string) => {
    setTaskChanges((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.map((task) => {
          const hasChanged = taskChanges[task.id] !== undefined && taskChanges[task.id] !== task.name;
          return (
            <Box
              key={task.id}
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
              gap={1}
              width="100%"
            >
              <TextField
                size="small"
                value={taskChanges[task.id] !== undefined ? taskChanges[task.id] : task.name}
                onChange={(e) => handleTaskNameChange(task.id, e.target.value)}
                fullWidth
                sx={{ maxWidth: 350 }}
              />
              <Box>
                <IconButton
                  color="success"
                  disabled={!hasChanged}
                  onClick={() => handleSave(task.id)}
                >
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          );
        })}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => {
              // Add new task logic
            }}
          >
            Ajouter une tâche
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
