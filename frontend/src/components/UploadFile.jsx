import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadFile = () => {
  const [fileName, setFileName] = useState('');
  const [allowedRoles, setAllowedRoles] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', fileName);
      formData.append('allowed_roles', JSON.stringify(allowedRoles.split(','))); // Convert comma-separated string to JSON array

      console.log('Form Data:', formData);
      console.log('Form Data Entries:', [...formData.entries()]);

      const response = await axiosInstance.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`File uploaded successfully: ${response.data.name}`);
    } catch (err) {
      console.error('Upload Error:', err);
      setMessage(`Error: ${err.response ? err.response.data.error : err.message}`);
    }
  };

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            File Name:
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Allowed Roles (comma-separated):
            <input
              type="text"
              value={allowedRoles}
              onChange={(e) => setAllowedRoles(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadFile;