import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails';
import CreateClient from './components/CreateClient';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Client Management App</h1>
        <Routes>
          <Route path="/" element={<ClientList />} />
          <Route path="/customers" element={<ClientList />} />
          <Route path="/customers/:id" element={<ClientDetails />} />
          <Route path="/customers/create" element={<CreateClient />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;