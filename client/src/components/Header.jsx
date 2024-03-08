import { useEffect, useState } from "react";
import axios from "axios";
import { IoNotificationsSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { BiSolidMessageDetail } from "react-icons/bi";
import useCurrentUser from "../hooks/useCurrentUser";
import Loading from '../components/Loading';
import { URL } from "../App";

function Header({ loggedInUser }) {
    const { userData, isLoading } = useCurrentUser(loggedInUser);
    const token = localStorage.getItem('token');

    const [unreadMessages, setUnreadMessages] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (loggedInUser) {
            axios.get(`${URL}/messages/unread?user=${loggedInUser.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUnreadMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching unread messages:', error);
            });
        }
    }, [loggedInUser]);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    if (isLoading) {
        return <div><Loading/></div>;
    }

    return (
        <header>
            <Link to='/home'>
                <div className="header-logo-container">
                    <BiSolidMessageDetail/>
                    <h1>Messaging App</h1>
                </div>
            </Link>
            <div className="user-container">
                <div style={{ position: 'relative' }}>
                    <button onClick={toggleDropdown}>
                        <IoNotificationsSharp />
                        {unreadMessages.length > 0 && <span className="notification-badge">{unreadMessages.length}</span>}
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            {unreadMessages.length > 0 ? (
                                unreadMessages.map(message => (
                                    <Link to="/home" key={message._id} className="dropdown-item-link">
                                        <div className="dropdown-item">
                                            <img className="notification-image" src={message.from.image} alt={`${message.from.firstName} ${message.from.lastName}`} />
                                            <div className="notification-desc">
                                                <h3>{message.from.firstName} {message.from.lastName} <span>sent you a message:</span></h3>
                                                <p>{message.text}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="dropdown-item">
                                    <p>You have no new notifications.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Link to='/profile'>
                    <button>
                        <img src={userData?.image} alt={userData?.firstName} />
                    </button>
                </Link>
            </div>
        </header>
    )
}

export default Header;
