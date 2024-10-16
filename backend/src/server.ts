import express, { json, Request, Response } from 'express';
import fs from 'fs';
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
import { generateRandomNoteId, getCurrentTime } from './helperFunction';
import { Note } from './interface';
dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '5000', 10);
const dataStorePath = path.join(__dirname, '../dataStore.json');
app.use(json());
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
app.use(express.json({ limit: '3mb' }));

// Dummy data for notes
// interface Note {
//   id: number;
//   title: string;
//   upvotes: number;
// }

const notes: Note[] = [
  
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

// save notes to dataStore.json
app.post('/api/saveNotes', (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const { courseCode, tag, title, description, file } = req.body;
  const user = getData().users.find(u => u.token.includes(token));
  if (!user) {
    res.status(401).json({ error: 'Token is invalid' });
    return;
  }

  if (!file) {
    res.status(400).send('File is missing');
    return;
  }

  // read dataStore.json
  fs.readFile(dataStorePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read dataStore.json:', err);
      return res.status(500).send('Server error');
    }

    let dataStore = [];
    if (data) {
      dataStore = JSON.parse(data);
    }

    const noteId = generateRandomNoteId();

    // create new note
    const newNote: Note = {
      noteId,
      userId: user.userId,
      title,
      courseCode,
      tag,
      description,
      upvoteCount: [],
      file, // base64
      timeCreated: getCurrentTime(),
      timeLastEdited: getCurrentTime(),
    };

    // add new note to dataStore
    dataStore.push(newNote);

    // write back to dataStore.json
    fs.writeFile(dataStorePath, JSON.stringify(dataStore, null, 2), (err) => {
      if (err) {
        console.error('Failed to write to dataStore.json:', err);
        return res.status(500).send('Server error');
      }
      res.json({ message: 'File saved successfully' });
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
