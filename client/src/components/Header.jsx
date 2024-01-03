import { BiSolidMessageDetail } from "react-icons/bi";
import { IoNotificationsSharp, IoPersonCircleSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <div className="header-logo-container">
                <BiSolidMessageDetail/>
                <h1>Messaging App</h1>
            </div>
            <div className="user-container">
                <input type="text" placeholder="Search" name="search"></input>
                <button><IoNotificationsSharp /></button>
                <Link to='/profile'><button><IoPersonCircleSharp /></button></Link>
            </div>
        </header>
    )
}

export default Header;