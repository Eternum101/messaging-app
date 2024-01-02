import { BiSolidMessageDetail } from "react-icons/bi";
import { IoNotificationsSharp, IoPersonCircleSharp } from "react-icons/io5";

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
                <button><IoPersonCircleSharp /></button>
            </div>
        </header>
    )
}

export default Header;