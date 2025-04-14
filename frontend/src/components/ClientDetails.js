import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClientDetails() {
  const { id } = useParams();
  const clientId = parseInt(id);
  const [client, setClient] = useState(null);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const clientResponse = await axios.get(`${process.env.REACT_APP_API_URL}/clients/${id}`);
        setClient(clientResponse.data);

        const clientsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/clients`);
        setTotalClients(clientsResponse.data.length);

        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Client not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const prevId = clientId > 1 ? clientId - 1 : null;
  const nextId = clientId < totalClients ? clientId + 1 : null;

  const handleImageError = () => {
    console.error(`Failed to load image for client ${clientId}: ${client?.image}`);
    setImageError(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/clients/${clientId}`);
      setSuccessMessage('Client deleted successfully!');
      setShowDeleteModal(false);
      setTimeout(() => {
        navigate('/customers');
      }, 2000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete client. Please try again.');
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className="loading">Loading client details...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}{' '}
        <div className="button-container">
          <Link to="/customers" className="button-link">Back to List</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Client Details</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="action-button-container">
        <Link to="/customers/create" className="create-button">
          Create Client
        </Link>
        <button className="delete-button" onClick={handleDeleteClick}>
          Delete Client
        </button>
      </div>
      <div className="client-details-table-container">
        <table className="client-details-table">
          <tbody>
            <tr>
              <td><strong>ID:</strong></td>
              <td>{client.id}</td>
            </tr>
            <tr>
              <td><strong>First Name:</strong></td>
              <td>{client.first_name}</td>
            </tr>
            <tr>
              <td><strong>Last Name:</strong></td>
              <td>{client.last_name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{client.email}</td>
            </tr>
            <tr>
              <td><strong>Gender:</strong></td>
              <td>{client.gender}</td>
            </tr>
            <tr>
              <td><strong>Image:</strong></td>
              <td>
                {imageError ? (
                  <span className="image-error">Failed to load image</span>
                ) : (
                  <img
                    src={client.image}
                    alt={`${client.first_name} ${client.last_name}`}
                    className="client-image"
                    onError={handleImageError}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this client?</p>
            <div className="modal-buttons">
              <button className="modal-cancel-button" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="modal-delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="button-container">
        {prevId ? (
          <Link to={`/customers/${prevId}`} className="nav-button">Previous</Link>
        ) : (
          <span className="nav-button disabled">Previous</span>
        )}
        <Link to="/customers" className="button-link">Back to List</Link>
        {nextId ? (
          <Link to={`/customers/${nextId}`} className="nav-button">Next</Link>
        ) : (
          <span className="nav-button disabled">Next</span>
        )}
      </div>
    </div>
  );
}

export default ClientDetails;