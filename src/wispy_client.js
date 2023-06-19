import axios from 'axios';

// Get list of csv files
export async function getCsvFiles(endpoint) {
  const result = await axios.get(endpoint, {
    timeout: 5000
  });

  const matches = result.data.matchAll(/href="\/download\?fn=\/(.*?\.csv)"/g);
  let data = [];

  for (const match of matches) {

    // omit files that start with ._
    if(match[1].indexOf('._') !== 0) {
      data.push(match[1]);
    }
  }

  return data;
}

// Download File
export async function getCsvFile(endpoint, filename) {
  const result = await axios.get(`${endpoint}/download?fn=/${filename}`);

  return result.data;
}

// Delete File
export async function deleteFile(endpoint, filename) {
  return await axios.get(`${endpoint}/confirmdelete?fn=/${filename}`);
}
