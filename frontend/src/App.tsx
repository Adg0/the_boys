import './App.css';
import "./components/Home";
import Home from './components/Home';

import { BrowserRouter as Router, Link } from "react-router-dom";
import Navbar from './components/Navbar';

function App() {
    return(
        <Router>
            <Navbar />
            <Link to="/" >
                <Home />
            </Link>
        </Router>
    )
}

export default App
