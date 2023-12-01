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
const reviewsdb = lowDb(new FileSync('reviews.json', { defaultValue: [] }));

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
        usersdb.remove({ username: username }).write();
        const newUser = {
            username: existingUser.username,
            password: password,
            nickname: existingUser.nickname,
            access: "authenticated user"
        }
        usersdb.push(newUser).write();
       return res.status(200).send('User added successfully: ' + newUser.username);
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
app.put('/api/superheros/create', (req, res) => {
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
          const found = infodb.find({"name": name }).value();
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

// Get all the list created 
app.get('/api/superheros/lists', (req, res) => {
    const privateLists = infodb.filter({ "visibility": "Private" }).value() || [];
    const publicLists = infodb.filter({ "visibility": "Public" }).value() || [];
    
    const combinedLists = [...privateLists, ...publicLists];

    res.json(combinedLists);
});

// Get name and publisher for every superhero in list
app.get(`/api/superheros/moreInfo/:name`, (req, res) => {
    const list_name = req.params.name;

    const superherosArray = infodb.find({ "listName": list_name }).value();
  
    if (!superherosArray) {
      // Handle case where list is not found
      return res.status(404).json({ error: "List not found" });
    }
  
    const superheros = superherosArray.superheros || [];
    // Iterate over the superherosArray and find the publisher for each superhero
    const detailedInfoArray = superheros.map(superheroName => {
        // Find the corresponding document in infodb based on superheroName
        const publisher = infodb.find({ "name": superheroName }).value();
        return { superheroName, publisher: publisher.Publisher };
    });
  
    res.json(detailedInfoArray);
  });
  
  // Delete a list
app.delete('/api/superhero-list/:name', (req, res) => {
    const list_name = req.params.name;
    
    // Check if listname exists 
    const existingList = infodb.find({"listName": list_name}).value();

    if (!existingList) {
        return res.status(400).send('List name does not exists');
    }

    // If list exist delete it
    else{
        infodb.remove({ listName: list_name }).write();
        return res.status(200).send('List deleted sucesfully');
    }
});

// Edit an exisitng list 
app.put('/api/superheros', (req, res) => {
    const listName = req.body.name
    let description = req.body.description
    let names = req.body.superheros 
    const visibility = req.body.visibility
    const last_edited = req.body.time


    // Check if listname exists 
    const existingList = infodb.find({"listName": listName }).value();

    if (!existingList) {
        return res.status(400).send('List name does not exists');
    }

    if (!description) {
        description = (infodb.find({"listName": listName }).value()).description;
    }
    if(!names){
        names = (infodb.find({"listName": listName }).value()).superheros;
    }
    
    // Check every Superhero name exists 
    try {
        names.forEach(name => {
            const found = infodb.find({"name": name }).value();
            if (!found) {
                throw new Error(`Superhero name not found in the DB: ${name}`);
            }
        });
    } catch (error) {
        return res.status(400).send('You entered a superhero name not in our DB');
    }

    // Remove old list
    infodb.remove(item => item.listName === listName).write();

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

// Get a description for a list
app.get(`/api/superheros/description/:name`, (req, res) => {
    const list_name = req.params.name;
    res.json((infodb.find({ "listName": list_name }).value()).description);
  });

//   Write a review 
app.put(`/api/superheros/list/review`, (req, res) => {
    const listName = req.body.listName;
    const rating = req.body.rating;
    const comment = req.body.comment;

    // Check if listname exists
    const existingList = infodb.find({ "listName": listName }).value();

    if (!existingList) {
        return res.status(400).send('List name does not exist');
    }

    // Check if list is public
    if (existingList.visibility === "Private") {
        return res.status(400).send('The list provided is not public');
    }

    // Does list already have reviews?
    const existingReviews = reviewsdb.find({ "listName": listName }).value();

    if (!existingReviews) {
        // Create a new list
        const newList = {
            listName: listName,
            reviews: [[rating, comment]]
        };

        reviewsdb.push(newList).write();
        res.status(200).send('List updated successfully');
    } else {
        // Update existing reviews
        existingReviews.reviews.push([rating, comment]);
        reviewsdb.remove({ "listName": listName }).write();
        const newList = {
            listName: listName,
            reviews: existingReviews.reviews
        };

        reviewsdb.push(newList).write();
        res.status(200).send('List updated successfully');
    }
});

// Get all the powers for a superhero list of names
app.get('/api/superhero-list/all_powers/:name', (req, res) => {
    const list_name = req.params.name;

    // Check if listname exists
    const existingList = infodb.find({ "listName": list_name }).value();

    if (!existingList) {
        return res.status(400).send('List name does not exist');
    }

    // Retrieve all Names from the list
    const names = infodb.find({ "listName": list_name }).get('superheros').value();
    const result = [];

    // Iterate over each ID and retrieve superhero information
    names.forEach((name) => {
        const powers = powersdb.find({ "hero_names": name }).value();

        // Filter powers to include only true ones
        const filteredPowers = {};
        for (const power in powers) {
            if (powers[power] === 'True') {
                filteredPowers[power] = powers[power];
            }
        }

        result.push({
            name: name,
            powers: filteredPowers,
        });
    });

    // Format the response to include name, info, and powers
    const formattedResult = result.map(({ name, powers }) => ({
        name,
        powers,
    }));

    res.json({
        result: formattedResult,
    });
});

// Get all the info for a superheros name list
app.get('/api/superhero-list/all/:name', (req, res) => {
    const list_name = req.params.name;

    // Check if listname exists
    const existingList = infodb.find({ "listName": list_name }).value();

    if (!existingList) {
        return res.status(400).send('List name does not exist');
    }

    // Retrieve all Names from the list
    const names = infodb.find({ "listName": list_name }).get('superheros').value();
    const result = [];

    // Iterate over each ID and retrieve superhero information
    names.forEach((name) => {
        result.push(infodb.find({ "name": name }).value());
    });

    res.json({
        result: result,
    });
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

app.get('/posts/:username', authenticateToken, (req, res) => {
    res.json(usersdb.filter(user => user.username === req.params.username).value())
})




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
