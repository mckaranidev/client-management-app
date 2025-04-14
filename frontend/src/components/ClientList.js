import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const location = useLocation();
  const newClientId = location.state?.newClientId || null;

  // Create a ref to store the reference to the new client's row
  const newClientRowRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const url = `${process.env.REACT_APP_API_URL}/clients`;
        console.log('Fetching clients from:', url);
        const response = await axios.get(url);
        setClients(response.data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to fetch clients: ${err.message}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Scroll to the new client's row when the clients list updates and a newClientId exists
  useEffect(() => {
    if (newClientId && newClientRowRef.current) {
      newClientRowRef.current.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'center', // Center the row in the viewport
      });
    }
  }, [clients, newClientId]); // Trigger when clients or newClientId changes

  const handleImageError = (clientId) => {
    console.error(`Failed to load image for client ${clientId}`);
    setImageErrors((prev) => ({ ...prev, [clientId]: true }));
  };

  if (loading) {
    return <div className="loading">Loading clients...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Client List</h2>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr
                  key={client.id}
                  className={client.id === newClientId ? 'highlight' : ''}
                  ref={client.id === newClientId ? newClientRowRef : null} // Attach ref to the new client's row
                >
                  <td>{client.id}</td>
                  <td>
                    {imageErrors[client.id] ? (
                      <div className="image-error">Failed to load</div>
                    ) : (
                      <img
                        src={client.image}
                        alt={`${client.first_name} ${client.last_name}`}
                        className="client-image"
                        onError={() => handleImageError(client.id)}
                      />
                    )}
                  </td>
                  <td>{client.first_name}</td>
                  <td>{client.last_name}</td>
                  <td>{client.email}</td>
                  <td>{client.gender}</td>
                  <td>
                    <Link to={`/customers/${client.id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="button-container">
        <Link to="/customers/create" className="button-link">Create New Client</Link>
      </div>
    </div>
  );
}

export default ClientList;