import './App.css';
import "./components/Home";
import Home from './components/Home';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import VaultDetails from './components/VaultDetails';

function App() {
    return(
        <Router>
            <Navbar />
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/vault_details" element={<VaultDetails />} />
            </Routes>
        </Router>
    )
}

export default App
