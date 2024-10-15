import express, { json, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '5000', 10);
app.use(json());
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

// Dummy data for notes
interface Note {
  id: number;
  title: string;
  upvotes: number;
}

const notes: Note[] = [
  { id: 1, title: 'Math 101 Notes', upvotes: 5 },
  { id: 2, title: 'History 202 Study Guide', upvotes: 3 },
  { id: 3, title: 'Computer Science 301 Cheat Sheet', upvotes: 7 },
];

app.get('/api/notes', (req: Request, res: Response) => {
  res.json(notes);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express!');
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// User registration
app.post('/api/register', (req: Request, res: Response) => {
  // TODO: Implement user registration
  // 1. Validate input
  // 2. Check if user already exists
  // 3. Hash password
  // 4. Save user to database
  res.status(201).json({ message: 'User registered successfully' });
});

// User login
app.post('/api/login', (req: Request, res: Response) => {
  // TODO: Implement user login
  // 1. Validate input
  // 2. Check if user exists
  // 3. Verify password
  // 4. Generate and send JWT token
  res.json({ token: 'dummy_token', user: { id: 1, name: 'John Doe' } });
});

// User logout
app.post('/api/logout', (req: Request, res: Response) => {
  // TODO: Implement user logout
  // 1. Invalidate token (if using token-based auth)
  // 2. Clear session (if using session-based auth)
  res.json({ message: 'Logged out successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
