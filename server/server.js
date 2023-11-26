const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

const usersdb = lowDb(new FileSync('users.json', { defaultValue: [] }));
const infodb = lowDb(new FileSync('superhero_info.json'));
const powersdb = lowDb(new FileSync('superhero_powers.json'));

app.use(express.json());
app.use(cors());

// Adding a user to the DB
app.put('/api/users', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nickname = req.body.nickname;

    // Check if username exists 
    const existingUser = usersdb.find({ "username": username }).value();

    if (existingUser) {
        return res.status(400).send('User already signed up!');
    }

    // Create a new user 
    const newUser = {
        username: username,
        password: password,
        nickname: nickname
    }

    usersdb.push(newUser).write();
    res.status(200).send('User added successfully: ' + newUser.username);
});

// Custom search 
app.post('/api/superheros/all', (req, res) => {
    const name = req.body.name;
    const race = req.body.race;
    const power = req.body.power;
    const publisher = req.body.publisher;
    console.log(name)
    // First, filter infodb based on name, race, and publisher
    let allMatches = infodb.filter((item) => (
        (!name || item.name === name) &&
        (!race || item.Race === race) &&
        (!publisher || item.Publisher === publisher)
    ));

    if (!allMatches || allMatches.length === 0) {
        return res.status(404).send("Not Found: No matches found.");
    }

    // If power is provided, further filter through powersdb
    if (power) {
        allMatches = allMatches.forEach((item) =>
            powersdb.filter((hero) => hero.name === item.name && hero.powers.includes(power))
        );
    }

    res.json(allMatches.value());
});

// Creating List
app.put('/api/superheros', (req, res) => {
    const listName = req.body.name
    const description = req.body.description
    const names = req.body.superheros 
    const visibility = req.body.visibility
    const last_edited = req.body.time

    // Error checking first

    // Check if listname exists 
    const existingList = infodb.find({"listName": listName }).value();

    if (existingList) {
        return res.status(400).send('A list with this name already exists!');
    }

    // Check every Superhero name exists 
    try {
        names.forEach(name => {
          const found = db.get('infodb').find({ name }).value();
          if (!found) {
            throw new Error(`Superhero name not found in the DB: ${name}`);
          }
        });
      } catch (error) {
        return res.status(400).send('You entered a superhero name not in our DB');
      }

    // Create a new list 
    const newList = {
        listName: listName,
        description: description,
        superheros: names,
        visibility: visibility,
        last_edited: last_edited
    }
    
    infodb.push(newList).write();
    res.status(200).send('List updated successfully');
});

// JWT Authentication 

// Creating a token
app.post('/login', (req, res) => {
    // Only call for authenticated users
    const username = req.body.username
    const user = { name: username }

    usersdb.find({ "username": username }).assign({ "access": "authenticated user" }).write();

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})

});

// Authenticate token do u hv the right token to be a user??
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // No token sent 
    if(token == null) return res.status(401)

    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Invalid token
        if(err) return res.status(403)

        req.user = user
        next()
    })
}

app.get('/posts', authenticateToken, (req, res) => {
    res.json(usersdb.filter(user => user.username === req.body.username).value())
})




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
