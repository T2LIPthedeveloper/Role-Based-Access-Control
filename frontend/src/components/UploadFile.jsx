import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadFile = () => {
  const [fileName, setFileName] = useState('');
  const [allowedRoles, setAllowedRoles] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/upload/', {
        name: fileName,
        allowed_roles: allowedRoles,
      });
      setMessage(`File uploaded successfully: ${response.data.name}`);
    } catch (err) {
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
              value={allowedRoles.join(',')}
              onChange={(e) => setAllowedRoles(e.target.value.split(','))}
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