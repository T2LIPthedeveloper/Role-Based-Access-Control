import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const CheckAccess = () => {
  const [fileId, setFileId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get(`/files/${fileId}/access/`);
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div>
      <h1>Check Access</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            File ID:
            <input
              type="number"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Check Access</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckAccess;