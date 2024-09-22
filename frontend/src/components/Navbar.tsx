import { Link } from "react-router-dom";
import Logo from "../../images/h-logo.jpg";

const Navbar = () => {
    return (
        <div className="text-white text-xl py-2 px-5 flex justify-between" style={{backgroundColor: "rgb(8, 19, 31)", color: "rgb(221, 251, 244)"}}>
            <div>
                <img src={Logo} alt="logo" width={40} style={{display: "inline-block"}} className="mr-4"/>
                <Link to="/" className="mr-4">Market</Link>
                <Link to="/" className="mr-4">Leaderboard</Link>
            </div>
            <div>
                <Link to="/" className="mr-4">Connect</Link>
            </div>
        </div>);
};

export default Navbar;