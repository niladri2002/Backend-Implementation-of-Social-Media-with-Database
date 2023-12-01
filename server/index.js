const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;


app.use(session({
    secret: 'ajhbjhab',
    resave: false,
    saveUninitialized: true,
  }));
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/NodeJs', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connection successful");
}

userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
 User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

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
    result=  await newUser.save();
    console.log('User saved to the database:', result);
    res.status(201).json({ message: 'User registered successfully' });
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

      req.session.userId = user._id;
  
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error during login' });
    }
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



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});