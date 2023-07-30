const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Secret key for JWT (You should use a strong secret in production)
const secretKey = 'shalla123';

// Sample user data (Replace this with your actual user authentication)
const users = [
  { id: 1, username: 'shaik', password: 'shalla' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Sample login route (Replace this with your actual login route)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace this with your actual user authentication logic
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    // Create and return the JWT token if the user is authenticated
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
      expiresIn: '1h', // Token expiration time (optional)
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Sample protected route (Replace this with your actual protected routes)
app.get('/protected/:id', authenticateToken, (req, res) => {
  console.log('req user',req.user); // Log the decoded token payload
  res.json({ message: 'This is a protected route' });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {

 
 const authHeader = req.header('Authorization');
// Split the authHeader to remove the "Bearer " prefix
  const token = authHeader.split(' ')[1];

   const decodedToken = jwt.decode(token);
console.log(decodedToken); // Log the decoded token payload
   

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
      if (err) {
       console.log('Invalid token');
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;

    // Check if the user ID from the token matches the requested profile ID
    const profileId = parseInt(req.params.id); // Assuming the profile ID is part of the URL
    if (user.id !== profileId) {
      return res.status(403).json({ message: 'You do not have permission to modify this profile' });
    }
    next();
  });
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
