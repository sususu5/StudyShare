import express, { json, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { register } from './auth/register';
import { login } from './auth/login';
import { logout } from './auth/logout';
import { showUserDetails } from './user/showUserDetails';
import { updateUserDetails } from './user/updateUserDetails';
import { getData } from './dataStore';
import { changeUserPassword } from './user/changeUserPassword';

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
  const { username, password, avatar } = req.body;
  const resBody = register(username, password, avatar);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200).json({ message: 'User registered successfully' });
});

// User login
app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const resBody = login(username, password);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200).json({ message: 'User logged in successfully' });
});

// User logout
app.post('/api/logout', (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const user = getData().users.find(u => u.token.includes(token));
  if (!user) {
    res.status(401).json({ error: 'Token is invalid' });
    return;
  }
  const resBody = logout(token);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200).json({ message: 'User logged out successfully' });
});

// get user profile
app.get('/api/user/:username', (req: Request, res: Response) => {
  const username = req.params.username;
  const resBody = showUserDetails(username);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200);
});

// update user profile
app.put('/api/user', (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const { username, avatar } = req.body;
  const user = getData().users.find(u => u.token.includes(token));
  if (!user) {
    res.status(401).json({ error: 'Token is invalid' });
    return;
  }
  const resBody = updateUserDetails(token, username, avatar);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200);
});

// change password
app.put('/api/user/password', (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const { oldPassword, newPassword } = req.body;
  const user = getData().users.find(u => u.token.includes(token));
  if (!user) {
    res.status(401).json({ error: 'Token is invalid' });
    return;
  }
  const resBody = changeUserPassword(token, oldPassword, newPassword);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200).json({ message: 'Password changed successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
