import { useEffect, useState } from "react";
import axios from "axios";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoNotificationsSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

function Header({ loggedInUser }) {

    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (loggedInUser) {
            axios.get('/users/current', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }, [loggedInUser]);

    return (
        <header>
        <Link to='/home'>
            <div className="header-logo-container">
                <BiSolidMessageDetail/>
                <h1>Messaging App</h1>
            </div>
        </Link>
            <div className="user-container">
                <input type="text" placeholder="Search" name="search"></input>
                <button><IoNotificationsSharp /></button>
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