import axios from 'axios';
import FormData from 'form-data';

// Upload scan data
export async function wiggleUploadFile(api_key, data, filename, endpoint = "https://api.wigle.net/api/v2") {
  const form = new FormData();
  form.append('donate', process.env.WIGGLE_DONATE_SCAN_DATA === 'on' ? 'on' : 'off');
  form.append('file', Buffer.from(data, 'utf8'), {
    filename: filename
  });

  return await axios.post(`${endpoint}/file/upload`, form, {
    headers: {
      "Authorization": `Basic ${api_key}`
    }
  });
}

// Account test
export async function wiggleAccountTest(api_key, endpoint = "https://api.wigle.net/api/v2") {
  return await axios.get(`${endpoint}/profile/user`, {
    headers: {
      "Authorization": `Basic ${api_key}`
    }
  });
}
