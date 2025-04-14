const validator = require('validator');

// Middleware to validate incoming client data
const validateClient = (req, res, next) => {
  const { first_name, last_name, email, gender, image } = req.body;

  // Check for missing fields
  if (!first_name || !last_name || !email || !gender || !image) {
    return res.status(400).json({
      message: 'All fields (first_name, last_name, email, gender, image) are required',
    });
  }

  // Validate first_name
  if (typeof first_name !== 'string' || first_name.trim().length === 0) {
    return res.status(400).json({ message: 'First name must be a non-empty string' });
  }

  // Validate last_name
  if (typeof last_name !== 'string' || last_name.trim().length === 0) {
    return res.status(400).json({ message: 'Last name must be a non-empty string' });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate gender
  const allowedGenders = ['Male', 'Female'];
  if (!allowedGenders.includes(gender)) {
    return res.status(400).json({ message: 'Gender must be either "Male" or "Female"' });
  }

  // Validate image URL
  if (!validator.isURL(image)) {
    return res.status(400).json({ message: 'Image must be a valid URL' });
  }

  // If all validations pass
  next();
};

module.exports = validateClient;
