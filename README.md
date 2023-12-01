# NodeJs-Assignment

## Documentation for Backend

### 1. Connection to MongoDB
* Endpoint: Not applicable (runs when the server starts).
* Purpose: Establish a connection to the MongoDB database.
* Operations:
* Connects to the MongoDB database specified in the connection string.
* Logs a successful connection message.




### 2. User Registration
- Endpoint: POST /signup
- Purpose: Allow users to register by providing email and password.
- Operations:
- Hashes the user's password using bcrypt for secure storage.
- Saves the user's email and hashed password to the database.
- Generates a JSON Web Token (JWT) containing the user ID for authentication.
- Responds with the generated JWT.

### Request:
* POST /signup
```json

{
  "email": "user@example.com",
  "password": "secretpassword"
}
```
* Expected JSON Response (Success):
```json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY4ZDUzMmE2YTZkOTRlMDA3ZmEzZGMiLCJpYXQiOjE2MzQyOTY2ODcsImV4cCI6MTYzNDMwMzA4N30.5SthfAUfaGtUCQ9oNLdSZs6yESRpjrW7bdM-vtVZ0qU"
}

```

* Expected JSON Response (Error - Email Already Exists):

 ```json

{
  "error": "User with this email already exists."
}

```


### 3. User Login
- Endpoint: POST /login
- Purpose: Allow users to log in by providing their email and password.
- Operations:
- Finds the user in the database based on the provided email.
- Compares the provided password with the hashed password stored in the database using bcrypt.
- If successful, generates a new JWT containing the user ID for authentication.
- Stores the user ID in the session.
- Responds with the generated JWT.

### Request
* POST /login
```json


{
  "email": "user@example.com",
  "password": "secretpassword"
}


```

* Expected JSON Response (Success):


```json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY4ZDUzMmE2YTZkOTRlMDA3ZmEzZGMiLCJpYXQiOjE2MzQyOTY2ODcsImV4cCI6MTYzNDMwMzA4N30.5SthfAUfaGtUCQ9oNLdSZs6yESRpjrW7bdM-vtVZ0qU"
}

```

* Expected JSON Response (Error - Invalid Credentials):
```json
{
  "error": "Invalid email or password."
}
```





### 4. User Logout
- Endpoint: POST /logout
- Purpose: Allow users to log out, destroying the session.
- Operations:
- Clears the user ID stored in the session.
- Destroys the session.
- Responds with a successful logout message.



### 5. Check User Existence
- Endpoint: POST /checkuser
- Purpose: Check if a user with a given email already exists.
- Operations:
- Checks if a user with the provided email exists in the database.
- Responds with whether the user exists.
### 6. Create Post
- Endpoint: POST /posts
- Purpose: Allow authenticated users to create posts.
- Operations:
- Validates if a user is authenticated by checking the session.
- Creates a new post with the provided title and content.
- Associates the post with the authenticated user.
- Responds with a success message.


### Request:


* POST /posts
```json
{
  "title": "New Post",
  "content": "This is the content of the new post."
}
```
* Expected JSON Response (Success):

```json
{
  "message": "Post created successfully"
}

```

* Expected JSON Response (Error - Unauthorized):
```json
{
  "error": "Unauthorized. Please log in."
}
```

### 7. Get All Posts
- Endpoint: GET /posts
- Purpose: Retrieve all posts from the database, including user information, comments, and likes.
- Operations:
- Retrieves all posts from the database.
- Populates user information for each post.
- Populates user information for each comment in the posts.
- Responds with the retrieved posts.
### 8. Get Posts for a User
- Endpoint: GET /postsforuser
- Purpose: Retrieve posts associated with a specific user.
- Operations:
- Validates if a user is authenticated by checking the session.
- Retrieves posts from the database for the authenticated user.
- Populates user information for each post.
- Populates user information for each comment in the posts.
- Responds with the retrieved posts.
### 9. Add Comment to a Post
- Endpoint: POST /comments
- Purpose: Allow authenticated users to add comments to a post.
- Operations:
- Validates if a user is authenticated by checking the session.
- Finds the post based on the provided post ID.
- Adds the new comment to the post.
- Responds with a success message.
### 10. Get User Profile
- Endpoint: GET /profile
- Purpose: Retrieve the profile information of an authenticated user.
- Operations:
- Validates if a user is authenticated by checking the session.
- Retrieves user information from the database.
- Responds with the retrieved user profile.
### 11. Update User Profile
- Endpoint: PUT /profile/update
- Purpose: Allow authenticated users to update their profile details.
- Operations:
- Validates if a user is authenticated by checking the session.
- Retrieves the user based on the authenticated user ID.
- Compares the provided old password with the hashed password stored in the database using bcrypt.
- Updates the user's email and/or password.
- Responds with the updated user profile.
### 12. Password Security
- User passwords are securely stored in the database using bcrypt.
- Bcrypt is a one-way hashing algorithm that adds a salt to each password before hashing, making it highly resistant to rainbow table attacks.
### 13. CRUD Operations
- Create: POST /signup, POST /posts, POST /comments
- Read: POST /login, GET /posts, GET /postsforuser, GET /profile
- Update: PUT /profile/update
- Delete: Not applicable (consider adding if needed)
### 14. Error Handling
- The server provides comprehensive error handling for various scenarios.
- Each API endpoint checks for errors such as invalid input, unauthorized access, and database errors.
- Errors are logged for debugging purposes.
- Error messages are returned to the client for informative responses.