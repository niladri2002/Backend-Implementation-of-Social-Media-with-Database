const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);



app.use(session({
    secret: 'ajhbjhab',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(bodyParser.json());
main().catch(err => console.log(err));
u=''
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/NodeJs', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connection successful");
}

userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
 User = mongoose.model('User', userSchema);

 const postSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  comments: {
    type: Array,
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model('Post', postSchema);


app.use(express.static('public'));


//Api to take a question as input and store it in the database
app.post('/signup', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Form Data Received:', formData);
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    
     newUser = new User({
        email : formData.email,
        password: hashedPassword,
      });
    token=1
    result=  await newUser.save();
    console.log('User saved to the database:', result);
    res.status(201).json({ token});
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/login',  async (req, res) => {
  
    try {
        const data = req.body;
        console.log(data)
        email =data.email
      const user = await User.findOne({email});
  
      if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Store user ID in the session
      const token = jwt.sign({ userId: user._id }, 'hjbhb', { expiresIn: '1h' });
      
      req.session.userId = user._id.toString();
      u=req.session.userId
      console.log(u)
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error during login' });
    }
  });




app.post('/logout', (req, res) => {
 u=''
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error during logout' });
    }

    res.status(200).json({ message: 'Logout successful' });
  });
});


  app.post('/checkuser', async (req, res) => {
    
  
    try {
        const data = req.body;
        email=data.email
      // Check if a user with the given email exists
      const existingUser = await User.findOne({ email });
  
      // Return the result
      res.json({ exists: !!existingUser }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




// Create Post
app.post('/posts',async (req, res) => {
  
  if (!u) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  try {
    const formData = req.body;
    const newPost = new Post({
      userId : u,
      title : formData.title,
      content : formData.content,
    });

   result= await newPost.save();
console.log(result)
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
});


app.get('/posts', async (req, res) => {
  try {
    // Retrieve posts from the database, including user information, comments, and likes
    const posts = await Post.find()
      .populate('userId', 'username')
      .populate({
        path: 'comments.userId',
        select: 'username',
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving posts' });
  }
});



app.get('/postsforuser', async (req, res) => {
  try {
    const userId = u;

    // Retrieve posts from the database for the specified user ID
    const posts = await Post.find({ 'userId': userId })
      .populate('userId', 'username')
      .populate({
        path: 'comments.userId',
        select: 'username',
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving posts' });
  }
});


app.post('/comments',  async (req, res) => {
  const userId = u;

  console.log(u)

  if (!u) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

 

  try {
  const formdata=req.body;

    const post = await Post.findById(formdata.postId);
    console.log("Postid=",post)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

const c=formdata.newComment
if(c!='')
{
    post.comments.push({u, c});
   const result= await post.save();
   console.log(result)

    res.status(201).json({ message: 'Comment added successfully' });
}
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});



// Assuming you have the express app and user model already defined

app.get('/profile', async (req, res) => {
  const userId = u;
  console.log(u)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Omit sensitive information from the response
    const userProfile = {
      username: u,
      email: user.email,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user profile' });
  }
});





app.put('/profile/update', async (req, res) => {
  const userId = u;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  

  try {
    const formdata = req.body;
    const user = await User.findById(userId);

    if (!user || !(await bcrypt.compare(formdata.oldPassword, user.password))) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Update user details
    user.email = formdata.email;
    if (formdata.newPassword) {
      const hashedNewPassword = await bcrypt.hash(formdata.newPassword, 10);
      user.password = hashedNewPassword;
    }

  const result=  await user.save();
console.log("Updated")
    const updatedUserProfile = {
      username: user.username,
      email: user.email,
    };

    res.status(200).json(updatedUserProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user details' });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});