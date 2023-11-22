const express = require("express");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const cors = require('cors');
const app = express();

const usersdb = lowDb(new FileSync('users.json', { defaultValue: [] }));

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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
