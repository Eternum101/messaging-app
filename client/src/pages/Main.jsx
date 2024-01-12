import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Chats from '../components/Chats';
import Messaging from '../components/Messaging';
import '../styles/Main.css';
import { jwtDecode } from 'jwt-decode';

function Main() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setLoggedInUser(decoded);
            console.log(token); 
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }, [loggedInUser]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    }

    return (
        <section className="layout-container">
            <Header loggedInUser={loggedInUser}/>
            <Sidebar loggedInUser={loggedInUser}/>
            <Chats handleUserClick={handleUserClick} loggedInUser={loggedInUser} />
            {selectedUser && <Messaging user={selectedUser} loggedInUser={loggedInUser} />}
        </section>
    )
}

export default Main;
