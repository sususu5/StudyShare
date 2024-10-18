// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import fs from 'fs';
import { Data } from './interface';

const DEFAULT_DATA_FILE_PATH = './dataStore.json';

// Use get() to access the data
export async function getData(): Promise<Data> {
  let data: Data | null = null;
  try {
    const rawData = await fs.promises.readFile(DEFAULT_DATA_FILE_PATH, 'utf8');
    data = JSON.parse(rawData);
  } catch (error) {
    console.log("Error reading data: ", error);
    if (error.code === 'ENOENT') {
      console.log(`${DEFAULT_DATA_FILE_PATH} not found, creating new dataStore.json file.`);
      data = {
        users: [],
        notes: []
      };
      await fs.promises.writeFile(DEFAULT_DATA_FILE_PATH, JSON.stringify(data, null, 2));
    }
  }

  // if data is not initialized, initialize it
  if (!data) {
    console.log("data is not initialized");
    data = {
      users: [],
      notes: []
    };
  }
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
export async function setData(newData: Data): Promise<void> {
  try {
    await fs.promises.writeFile(DEFAULT_DATA_FILE_PATH, JSON.stringify(newData, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}
