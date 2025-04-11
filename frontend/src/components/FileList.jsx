import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessMessage, setAccessMessage] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get('/files/');
        setFiles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const checkAccess = async (fileId) => {
    try {
      const response = await axiosInstance.get(`/files/${fileId}/access/`);
      setAccessMessage(response.data.message);
    } catch (err) {
      setAccessMessage(err.response ? err.response.data.error : err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>File List</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id} onClick={() => checkAccess(file.id)} style={{ cursor: 'pointer' }}>
            {file.name} (Uploaded by: {file.uploaded_by.username})
          </li>
        ))}
      </ul>
      {accessMessage && <p>{accessMessage}</p>}
    </div>
  );
};

export default FileList;