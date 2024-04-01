const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controllers/userController');
const db = require('./db');
require('./dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');

const musicRouter = require('./musicRouter');

const app = express();
const port = 3000;

app.use('/', musicRouter);

// Serve the 'uploads' folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(cookieParser());

const allowedOrigin = 'http://localhost:5173';
app.use(cors(
  {
    origin: allowedOrigin,
    credentials: true
  }
));

// User registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await userController.registerUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  // const token = req.headers.authorization;
  const tokens = req.cookies.authToken;

  if (tokens) {
    try {
      const decoded = jwt.verify(tokens, process.env.JWT_SECRET)
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Missing token.' });
    }
  }
    next();
};


// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await userController.loginUser(email, password);
        res.cookie('authToken', result.token, { httpOnly: true, secure: true, sameSite: 'none' });
        res.json(result);
    } catch (error) {
        res.status(401).json({ error });
    }
});

// set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.filename + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Music upload
app.post('/upload', upload.single('musicFile'), async (req, res) => {
    const { title, artist, genre, country } = req.body;
    const filename = req.file.filename;

    try {
        // Insert music metadata into database
        db.run('INSERT INTO music (title, artist, genre, country, filename) VALUES (?, ?, ?, ?, ?)',
            [title, artist, genre, country, filename],
            (err) => {
                if (err) {
                    console.error('Error during music upload:', err);
                    return res.status(500).json({ error: 'Failed to upload music.' });
                }

                // Return the music metadata in the response
                res.json({
                  message: 'Music upload successfully.',
                  music: { title, artist, genre, country, filename }
              });
            });
    } catch (error) {
        console.error('Error during music upload:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Set user prefernces
app.post('/preferences', authenticateUser, async (req, res) => {
    const userId = req.user.userId;
    const { title, artist, genre, country, dataThreshold} = req.body;

    try {
      // Check if preferences already exist for the user
      const existingPreferences = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM preferences WHERE userId = ?', [userId], (err, preferences) => {
          if (err) {
            console.error('Error checking existing preferences:', err);
            reject('Error checking existing preferences.');
          } else {
            console.log('Before sending response');
            resolve(preferences);
          }
        });
      });
  
      if (existingPreferences) {
        // Preferences already exist, update them
        db.run(
          'UPDATE preferences SET title = ?, artist = ?, genre = ?, country = ?, dataThreshold = ? WHERE userId = ?',
          [title, artist, genre, country, dataThreshold, userId],
          (err) => {
            if (err) {
              console.error('Error updating preferences:', err);
              return res.status(500).json({ error: 'Failed to update preferences.' });
            }
  
            res.json({ message: 'Preferences updated successfully.' });
          }
        );
      } else {
        // Preferences don't exist, insert new preferences
        db.run(
          'INSERT INTO preferences (userId, title, artist, genre, country, dataThreshold) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, title, artist, genre, country, dataThreshold],
          (err) => {
            if (err) {
              console.error('Error setting preferences:', err);
              return res.status(500).json({ error: 'Failed to set preferences.' });
            }
  
            console.log('Before sending response');
            res.json({ message: 'Preferences set successfully.' });
            console.log('After sending response');
          }
        );
      }
    } catch (error) {
      console.error('Error setting preferences:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }


    // try {
    //     // Insert new preferences
    //     db.run('INSERT INTO preferences (userId, title, artist, genre, country, dataThreshold) VALUES (?, ?, ?, ?, ?, ?)',
    //       [userId, title, artist, genre, country, dataThreshold],
    //       (err) => {
    //         if (err) {
    //           console.error('Error setting preferences:', err);
    //           return res.status(500).json({ error: 'Failed to set preferences.' });
    //         }
    
    //         res.json({ message: 'Preferences set successfully.' });
    //       });
    //   } catch (error) {
    //     console.error('Error setting preferences:', error);
    //     res.status(500).json({ error: 'Internal server error.' });
    //   }

});

// Get user preferences
app.get('/preferences', authenticateUser, async (req, res) => {
    const userId = req.user.userId;

    try {
        const preferences = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM preferences WHERE userId = ?', [userId], (err, preferences) => {
                if (err) {
                    reject('Error getting preferences.');
                } else {
                    console.log('get preferences', preferences);
                    resolve(preferences);
                }
            });
        });

        if (!preferences) {
      return res.status(404).json({ error: 'Preferences not found for the user.' });
    }

        res.json(preferences);
    } catch (error) {
        console.error('Error retrieving preferences:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Recommendations route based on user preferences
app.get('/recommendations', authenticateUser, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Retrieve user preferences
        const preferences = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM preferences WHERE userId = ?', [userId], (err, preferences) => {
              if (err) {
                console.error('Error retrieving preferences:', err);
                reject('Error retrieving preferences.');
              } else {
                resolve(preferences);
              }
            });
          });
      
          if (!preferences) {
            return res.status(400).json({ error: 'User preferences not set.' });
          }

        //   Retrieve music recommendations based on user preferences
        const recommendations = await new Promise((resolve, reject) => {
            // Replace this query with your actual logic to fetch music recommendations based on preferences
            db.all('SELECT * FROM music WHERE artist = ? OR genre = ? OR country = ?', [preferences.artist, preferences.genre, preferences.country], (err, rows) => {
              if (err) {
                console.error('Error retrieving music recommendations:', err);
                reject('Error retrieving music recommendations.');
              } else {
                resolve(rows);
              }
            });
          });
      
          if (!recommendations || recommendations.length === 0) {
            return res.json({ message: 'No recommendations available.' });
          }
      
          res.json(recommendations);
    } catch (error) {
        console.error('Error retrieving recommendations:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get all music in recommendations
app.get('/recommendations/music', authenticateUser, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Retrieve user preferences
    const preferences = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM preferences WHERE userId = ?', [userId], (err, preferences) => {
        if (err) {
          console.error('Error retrieving preferences:', err);
          reject('Error retrieving preferences.');
        } else {
          resolve(preferences);
        }
      });
    });

    if (!preferences) {
      return res.status(400).json({ error: 'User preferences not set.' });
    }

    // Retrieve all music in recommendations based on user preferences
    const recommendations = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM music WHERE artist = ? OR genre = ? OR country = ?', [preferences.artist, preferences.genre, preferences.country], (err, rows) => {
        if (err) {
          console.error('Error retrieving music recommendations:', err);
          reject('Error retrieving music recommendations.');
        } else {
          resolve(rows);
        }
      });
    });

    if (!recommendations || recommendations.length === 0) {
      return res.json({ message: 'No music in recommendations.' });
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Error retrieving music in recommendations:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get details about a particular music in recommendations
app.get('/recommendations/music/:musicId', authenticateUser, async (req, res) => {
  const musicId = req.params.musicId;

  try {
    // Validate that the specified musicId exists in the recommendations for the user
    const isValidRecommendation = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM music WHERE id = ?', [musicId], (err, music) => {
        if (err) {
          console.error('Error validating music recommendation:', err);
          reject('Error validating music recommendation.');
        } else {
          resolve(!!music);
        }
      });
    });

    if (!isValidRecommendation) {
      return res.status(404).json({ error: 'Invalid music recommendation.' });
    }

    // Fetch details about the particular music in recommendations
    const musicDetails = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM music WHERE id = ?', [musicId], (err, music) => {
        if (err) {
          console.error('Error fetching music details:', err);
          reject('Error fetching music details.');
        } else {
          resolve(music);
        }
      });
    });

    res.json(musicDetails);
  } catch (error) {
    console.error('Error fetching music details:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get all music in the music table
app.get('/music', async (req, res) => {
  try {
    // Retrieve all music in the music table
    const allMusic = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM music', (err, rows) => {
        if (err) {
          console.error('Error retrieving all music:', err);
          reject('Error retrieving all music.');
        } else {
          resolve(rows);
        }
      });
    });

    if (!allMusic || allMusic.length === 0) {
      return res.json({ message: 'No music available.' });
    }

    res.json(allMusic);
  } catch (error) {
    console.error('Error retrieving all music:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get details about a particular music in the music table
app.get('/music/:musicId', async (req, res) => {
  const musicId = req.params.musicId;

  try {
    // Fetch details about the particular music in the music table
    const musicDetails = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM music WHERE id = ?', [musicId], (err, music) => {
        if (err) {
          console.error('Error fetching music details:', err);
          reject('Error fetching music details.');
        } else {
          resolve(music);
        }
      });
    });

    if (!musicDetails) {
      return res.status(404).json({ error: 'Music not found.' });
    }

    res.json(musicDetails);
  } catch (error) {
    console.error('Error fetching music details:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Search for music based on title, artist, or genre
app.get('/search', async (req, res) => {
  const { title, artist, genre } = req.query;

  // Build the SQL query based on the provided search criteria
  let sqlQuery = 'SELECT * FROM music WHERE 1=1';
  const params = [];

  if (title) {
    sqlQuery += ' AND title LIKE ?';
    params.push(`%${title}%`);
  }

  if (artist) {
    sqlQuery += ' AND artist LIKE ?';
    params.push(`%${artist}%`);
  }

  if (genre) {
    sqlQuery += ' AND genre LIKE ?';
    params.push(`%${genre}%`);
  }

  try {
    // Fetch music based on the constructed query
    const searchResults = await new Promise((resolve, reject) => {
      db.all(sqlQuery, params, (err, rows) => {
        if (err) {
          console.error('Error searching for music:', err);
          reject('Error searching for music.');
        } else {
          resolve(rows);
        }
      });
    });

    if (!searchResults || searchResults.length === 0) {
      return res.json({ message: 'No matching music found.' });
    }

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for music:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});