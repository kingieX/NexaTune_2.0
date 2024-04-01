const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

// User registration
const registerUser = async (email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run('INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err) => {
            if (err) {
                console.log('Error during registration:', err);
                return Promise.reject('Failed to register user.');
            }
        });

        return Promise.resolve('User registered successfully.');
    } catch (error) {
        console.error('Error during registration:', error);
        return Promise.reject('Internal server error.');
    }
}

// User login
const loginUser = async (email, password) => {
    try {
        // retrieve user from the database based on the email
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) =>{
                if (err) {
                    reject('Error during login. check email');
                } else {
                    resolve(user);
                }
            });
        });

        if (!user) {
            return Promise.reject('Invalid credentials.')
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return Promise.reject('Invalid credentials.');
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return Promise.resolve({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        return Promise.reject('Internal server error.');
    }
}

module.exports = {
    registerUser,
    loginUser,
};