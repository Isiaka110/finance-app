// src/pages/SubmissionPage.jsx
import React, { useState } from 'react';
import api from '../api/api';

const SubmissionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '', // Comma separated string
    authors: '', // JSON string, simplified for now
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    setError('');

    // 1. Create FormData object for multipart/form-data
    const data = new FormData();
    data.append('title', formData.title);
    data.append('abstract', formData.abstract);
    data.append('keywords', formData.keywords);
    // IMPORTANT: Even though 'authors' is an array of objects in Mongoose, 
    // it must be sent as a JSON string within the multipart form data.
    data.append('authors', formData.authors); 

    // 2. Append all selected files
    files.forEach(file => {
      data.append('manuscriptFiles', file); // Use the key expected by Multer: 'manuscriptFiles'
    });
    
    // 3. Set content type header to undefined to let Axios/Browser handle the boundary correctly
    try {
      const res = await api.post('/submissions', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`Submission successful! ID: ${res.data._id}`);
      setError('');
      // Optionally reset form
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.error || 'Submission failed. Check your file size or inputs.');
      setMessage('');
    }
  };

  return (
    <div className="submission-form-container">
      <h2>New Manuscript Submission</h2>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        {/* Abstract */}
        <div>
          <label>Abstract</label>
          <textarea name="abstract" value={formData.abstract} onChange={handleChange} required rows="5"></textarea>
        </div>

        {/* Keywords */}
        <div>
          <label>Keywords (comma-separated)</label>
          <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} />
        </div>
        
        {/* Authors (Simplified JSON Input) */}
        <div>
          <label>Authors (JSON String: [{'name':'J. Doe', 'email':'j@d.com'}])</label>
          <textarea name="authors" value={formData.authors} onChange={handleChange} required rows="2"></textarea>
        </div>

        {/* Files */}
        <div>
          <label>Manuscript Files (PDF, DOCX, Figures)</label>
          <input type="file" multiple onChange={handleFileChange} required />
        </div>
        
       <button type="submit">Submit Manuscript</button>
      </form>
    </div>
  );
};

export default SubmissionPage;