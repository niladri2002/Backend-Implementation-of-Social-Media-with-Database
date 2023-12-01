import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState({}); // User data state
  const [updateData, setUpdateData] = useState({}); // Updated data state
  const [isUpdateMode, setIsUpdateMode] = useState(false); // Update mode state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming you have an API endpoint to fetch user profile
        const response = await fetch('http://localhost:5000/profile');
        const user = await response.json();

        setUserData(user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch user profile data when the component mounts
    fetchUserData();
  }, []);

  const handleUpdateClick = () => {
    setIsUpdateMode(true);
    // Set the initial values for the update form
    setUpdateData({
      email: userData.email,
      newPassword: '',
      oldPassword: '',
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      // Assuming you have an API endpoint to update user details
      const response = await fetch('http://localhost:5000/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
       alert("Details Updated Successfully");
        setUserData(result);
        setIsUpdateMode(false);
        setUpdateData({});
      } else {
       
        console.error('Error updating user details:', result.error);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {userData.username}</p>
      <p>Email: {userData.email}</p>

      {isUpdateMode ? (
        <div>
          <h3>Update Details</h3>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updateData.email || ''}
            onChange={handleInputChange}
          />
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={updateData.newPassword || ''}
            onChange={handleInputChange}
          />
          <label>Old Password:</label>
          <input
            type="password"
            name="oldPassword"
            value={updateData.oldPassword || ''}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateSubmit}>Update</button>
        </div>
      ) : (
        <button onClick={handleUpdateClick}>Update Details</button>
      )}
    </div>
  );
};

export default Profile;
