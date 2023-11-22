const express = require("express");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const cors = require('cors');
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

// Custom search with no powers
app.get('/api/superheros/all/:field/:pattern/:n/:sort', (req, res) => {
    const field = req.params.field;
    const pattern = req.params.pattern;
    const n = parseInt(req.params.n);

    // Iterate over each array element and checl if field value  = pattern
    let allMatches = infodb.filter((item) => item[field] === pattern).value();

    if (!allMatches || allMatches.length === 0) {
        return res.status(404).send("Not Found: No matches found.");
    }

    if (n > 0 && n < (allMatches.length)){
        allMatches =allMatches.slice(0, n);
        res.json(allMatches);
    }

    if (n === 0 || n >= allMatches.length) {
        // If n is not provided or is greater than or equal to the number of matches, return all matches.
        res.json(allMatches);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
