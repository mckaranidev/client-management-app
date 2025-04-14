import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function CreateClient() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.gender || formData.gender === '') {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!/^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+(\/[\w\d-./?%&=]*)?$/.test(formData.image)) {
      newErrors.image = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/clients`;
      console.log('Posting to:', url, formData);
      const response = await axios.post(url, formData);
      const newClientId = response.data.id; // Get the new client's ID from the response
      setSuccessMessage('Client created successfully!'); // Show success message
      setTimeout(() => {
        navigate('/customers', { state: { newClientId } }); // Redirect after 2 seconds with the new client's ID
      }, 2000);
    } catch (err) {
      console.error('Post error:', err);
      setServerError(err.response?.data?.message || 'Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Client</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {serverError && <p className="error">{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" disabled hidden>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Client'}
        </button>
      </form>
      <div className="button-container">
        <Link to="/customers" className="button-link">Back to List</Link>
      </div>
    </div>
  );
}

export default CreateClient;