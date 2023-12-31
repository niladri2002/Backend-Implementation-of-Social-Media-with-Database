import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddPost = async () => {
    try {
        const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Post added successfully:', data.message);
        setTitle('')
        setContent('')
        // Redirect to the home page or perform any other actions after successful post creation
      } else {
        alert(data.error)
        console.error('Error adding post:', data.error);
      }
    } catch (error) {
      console.error('Error adding post:', error.message);
    }
  };

  return (
    <div >
      <h2>Add Post</h2>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Content:</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleAddPost}>Add Post</button>
    </div>
  );
};

export default AddPost;
