import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [newComment, setNewComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = async (postId) => {
    // Assuming you have an API endpoint to add a comment to a post
    try {
      const response = await fetch(`http://localhost:5000/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newComment, postId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new comment to the post in the state or fetch posts again
        // depending on your implementation
        console.log('Comment added successfully:', data);
        // Reset the newComment state and hide the comment box
        setNewComment('');
        setShowCommentBox(false);
      } else {
        console.error(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };






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

  return (
    <div className="container">
      <div className="posts">
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

          {/* Add a button to toggle the comment box */}
          <button onClick={handleCommentClick}>
            {showCommentBox ? 'Cancel' : 'Add Comment'}
          </button>

          {showCommentBox && (
            <div>
              {/* Comment input box */}
              <input
                type="text"
                placeholder="Type your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              {/* Submit button */}
              <button onClick={() => handleCommentSubmit(post._id)}>Submit Comment</button>
            </div>
          )}

          {index !== posts.length - 1 && <hr />} {/* Add a line if it's not the last post */}
        </div>
      ))}
    </div>


      <div className="sidebar">
        <Link to="/profile">Profile</Link>
        <Link to="/add-post">Add Post</Link>
      </div>
    </div>
  );
};

export default Home;
