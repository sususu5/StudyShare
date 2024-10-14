// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import fs from 'fs';
export interface User {
  userId: number;
  token: string[];
  username: string;
  avatar: string; // thumbnail url
  password: string;
  usedPassword: string[];
}

export interface UserDetails {
  userId: number;
  username: string;
}

export interface Note {
  noteId: number;
  userId: number;
  name: string;
  courseCode: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
}

export interface Data {
  users: User[];
  notes: Note[];
}

const DATA_FILE_PATH = './dataStore.json';

// Use get() to access the data
export function getData(): Data {
  let data: Data | null = null;
  try {
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    data = JSON.parse(rawData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('dataStore.json not found, creating new dataStore.json file.');
      data = {
        users: [],
        notes: []
      };
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    }
  }

  // if data is not initialized, initialize it
  if (!data) {
    data = {
      users: [],
      notes: []
    };
  }
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
export function setData(newData: Data): void {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2));
}
