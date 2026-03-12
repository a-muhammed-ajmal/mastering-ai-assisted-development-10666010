import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = 3000;

app.use(express.json());

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Get list of available features
 */
app.get('/features', (req: Request, res: Response) => {
  const features = [
    { id: 1, name: 'User Authentication', enabled: true },
    { id: 2, name: 'Dark Mode', enabled: true },
    { id: 3, name: 'Real-time Notifications', enabled: false }
  ];
  res.status(200).json(features);
});

/**
 * Create a new task
 */
app.post('/tasks', (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = {
    id: Date.now(),
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  res.status(201).json(task);
});

/**
 * Get task by ID
 */
app.get('/tasks/:id', (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // Mock task
  const task = {
    id: taskId,
    title: 'Sample Task',
    description: 'This is a sample task',
    completed: false,
    createdAt: new Date().toISOString()
  };

  res.status(200).json(task);
});

export default app;
