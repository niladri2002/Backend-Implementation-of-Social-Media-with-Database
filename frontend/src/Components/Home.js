import React, { useState, useEffect } from 'react';
import { Link, Navigate ,useNavigate} from 'react-router-dom';

const Home = ({onLogout}) => {
  const [newComment, setNewComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/posts');
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        console.error('Error fetching posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Comment added successfully:', data);
        setNewComment('');
        setShowCommentBox(false);
        // Refresh posts after adding a comment
        fetchPosts();
      } else {
        console.error(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        //alert("Logged Out successfully")
        onLogout();
      } else {
        console.error(data.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="container">
      <div className="posts">
        <h1>All posts</h1>
        {posts.map((post, index) => (
          <div key={post._id} className="post">
            <p>User ID: {post.userId}</p>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <div>
              <p>Comments:</p>
              <ul>
                {post.comments.map((comment, commentIndex) => (
                  <li key={commentIndex}>
                    <span>User ID: {comment.u}</span>
                    <p>{comment.c}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p>Likes: {post.likes}</p>

            <button onClick={handleCommentClick}>
              {showCommentBox ? 'Cancel' : 'Add Comment'}
            </button>

            {showCommentBox && (
              <div>
                <input
                  type="text"
                  placeholder="Type your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleCommentSubmit(post._id)}>Submit Comment</button>
              </div>
            )}

            {index !== posts.length - 1 && <hr />}
          </div>
        ))}
      </div>

      <div className="sidebar">
        <Link to="#" onClick={handleLogout}>Logout</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/add-post">Add Post</Link>
      </div>
    </div>
  );
};

export default Home;
