import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>File List</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.name} (Uploaded by: {file.uploaded_by.username})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;