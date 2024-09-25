import './App.css';
import "./components/Home";
import Home from './components/Home';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';

function App() {
    return(
        <Router>
            <Navbar />
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </Router>
    )
}

export default App
