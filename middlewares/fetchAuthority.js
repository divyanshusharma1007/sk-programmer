// Import the 'jsonwebtoken' library for working with JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// Define the JWT secret key (should be kept secure, not hard-coded)
const Jwt_secret = "sk-programmer";

// Define a middleware function 'fetchusers' to verify and fetch user information from a JWT token
const fetchUsers = (req, res, next) => {
    // Get the JWT token from the request headers
    const token = req.header('auth-token');

    // Check if the token is missing
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        // Verify the token using the secret key
        const data = jwt.verify(token, Jwt_secret);

        // Attach the user's authority information to the request object
        req.authority = data.authority;

        // Continue with the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification errors
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

// Export the 'fetchUsers' middleware for use in other parts of the application
module.exports = fetchUsers;
