import express, { json, Request, Response } from 'express';

import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import { register } from './auth/register';
import { login } from './auth/login';
import { logout } from './auth/logout';
import { showUserDetails } from './user/showUserDetails';
import { updateUserDetails } from './user/updateUserDetails';
import { getData } from './dataStore';
import { changeUserPassword } from './user/changeUserPassword';
import { generateRandomNoteId, getCurrentTime } from './helperFunction';
import { Note, NoteDisplay } from './interface';
import { upvoteNote } from './upvoteNote';
import fsSync from 'fs'; // Add this line to import the synchronous fs module
dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '5000', 10);
const dataStorePath = path.join(__dirname, '../dataStore.json');
app.use(json());
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));
if (!fsSync.existsSync(uploadDir)) { // Use fsSync for synchronous methods
  fsSync.mkdirSync(uploadDir);
}
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    //cb(null, Date.now() + '-' + file.originalname);
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

const notes: NoteDisplay[] = [
  { 
    noteId: 1000000000, 
    title: 'Sample Note Just for frontend', 
    upvotes: 0,
    timeLastEdited: '2024-02-20',
  }
];

app.get('/api/notes', (req: Request, res: Response) => {
  res.json(notes);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express!');
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
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
app.post('/api/logout', async (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const data = await getData();
  const user = data.users.find(u => u.token.includes(token));
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

app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const data = await getData();
    console.log("data: ", data); // Consider using a logging library
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error); // Log the error
    res.status(500).json({ error: 'Internal Server Error' }); // Send a 500 response
  }
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
app.put('/api/user', async (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const { username, avatar } = req.body;
  const data = await getData();
  const user = data.users.find(u => u.token.includes(token));
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
app.put('/api/user/password', async (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const { oldPassword, newPassword } = req.body;
  const data = await getData();
  const user = data.users.find(u => u.token.includes(token));
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

// Save notes to dataStore.json with multer
app.post('/api/saveNotes', upload.single('file'), async (req: Request, res: Response) => {
  //const token = req.header('token') as string; // This will work when register and login is done
  const token = "token1";// This is used for testing when register and login have not been done
  const { courseCode, tag, title, description } = req.body;
  const data = await getData();
  const user = data.users.find(u => u.token.includes(token));
  if (!user) {
    console.log('Token is invalid');
    res.status(401).json({ error: 'Token is invalid' });
    return;
  }

  if (!req.file) {
    console.log('File is missing');
    res.status(400).send('File is missing');
    return;
  }

  const filePath = req.file.path; // Get the file path
  //console.log("filePath: ", filePath);

  try {
    // Read dataStore.json
    const data = await fs.readFile(dataStorePath, 'utf8');
    let dataStore = [];
    if (data) {
      try {
        dataStore = JSON.parse(data);
        console.log("dataStore: ", dataStore);
      } catch (parseError) {
        console.error('Failed to parse dataStore.json:', parseError);
        res.status(500).send('Server error');
        return;
      }
    }

    const noteId = await generateRandomNoteId();

    // Create new note
    const newNote: Note = {
      noteId,
      userId: user.userId,
      title,
      courseCode,
      tag,
      description,
      upvoteArray: [],
      upvoteCounter: 0,
      filePath, // Store the file path
      timeCreated: getCurrentTime().toLocaleString(),
      timeLastEdited: getCurrentTime().toLocaleString(),
    };

    // Add new note to dataStore
    dataStore.notes.push(newNote);

    // Write back to dataStore.json
    await fs.writeFile(dataStorePath, JSON.stringify(dataStore, null, 2));
    res.json({ message: 'File saved successfully', filePath, newNote });
  } catch (err) {
    console.error('Failed to read/write dataStore.json:', err);
    res.status(500).send('Server error');
  }
});

app.put('/api/upvoteNote', (req: Request, res: Response) => {
  const { noteId, userId } = req.body;
  const resBody = upvoteNote(noteId, userId);
  if ('error' in resBody) {
    res.status(400).json({ error: resBody.error });
    return; // Ensure the function exits after sending the error response
  }
  res.status(200).json({ message: 'Upvote successful' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
