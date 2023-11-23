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




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
