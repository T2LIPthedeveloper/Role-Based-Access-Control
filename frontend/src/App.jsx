import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import FileList from './components/FileList';
import UploadFile from './components/UploadFile';
import CheckAccess from './components/CheckAccess';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/">File List</Link>
              </li>
              <li>
                <Link to="/upload">Upload File</Link>
              </li>
              <li>
                <Link to="/check-access">Check Access</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FileList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadFile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/check-access"
              element={
                <ProtectedRoute>
                  <CheckAccess />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;