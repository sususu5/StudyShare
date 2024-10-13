const fs = require('fs');
const DATA_FILE_PATH = './dataStore.json';

// TODO: add interface for data



export function getData() {
    let data = null;
    try {
      const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      data = JSON.parse(rawData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('dataStore.json not found, creating new dataStore.json file.');
        data = {
            // TODO: initialize data
        };
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
      }
    }
  
    // TODO: if data is not initialized, initialize it
  
    return data;
  }
export function setData(newData) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2));
}