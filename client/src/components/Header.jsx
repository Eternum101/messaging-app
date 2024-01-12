import { useEffect, useState } from "react";
import axios from "axios";
import { IoNotificationsSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { BiSolidMessageDetail } from "react-icons/bi";
import useCurrentUser from "../hooks/useCurrentUser";
import Loading from '../components/Loading';

function Header({ loggedInUser }) {

    const { userData, isLoading } = useCurrentUser(loggedInUser);
    const token = localStorage.getItem('token');

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (loggedInUser && unreadCount === null) {
            axios.get(`/messages/unread?user=${loggedInUser.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUnreadCount(response.data.length);
            })
            .catch(error => {
                console.error('Error fetching unread messages:', error);
            });
        }
    }, [loggedInUser, unreadCount]);
    

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
            <div style={{ position: 'relative'}}>
                <button>
                    <IoNotificationsSharp />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
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