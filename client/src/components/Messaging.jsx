import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";

function Messaging({ user, loggedInUser }) {
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState(''); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user && loggedInUser) {
            axios.get(`/messages?user=${user._id}&from=${loggedInUser.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
        }
    }, [user, loggedInUser]);

    const handleSendClick = () => {
        if (user) {
            const message = { text: newMessage, to: user._id, from: loggedInUser.userId };
            console.log('Sending new message:', message);
            
            axios.post('/messages', message, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setMessages(oldMessages => [...oldMessages, response.data]);
                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
        }
    };     

    if (!user) {
        return null; 
    }

    return (
        <div className="messaging-container">
            <div className="messaging-header">
                <h3>Messaging with {user.firstName} {user.lastName}</h3>
            </div>
    <div className="messaging-content">
            {messages.map((message, index) => {
    const fromUserId = typeof message.from === 'string' ? message.from : message.from._id;
    return (
        <div className="messaging-user-container">
            <div 
                key={index} 
                className={`message ${fromUserId === loggedInUser.userId ? 'from-user' : 'to-user'}`}
            >
                <p>{message.text}</p>
            </div>
        </div>
    );
})}
</div>
    <div className="messaging-input-container">
        <div className="messaging-input-content">
            <button><RiImageAddFill /></button>
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Write a message..."/>
            <button onClick={handleSendClick}><IoSend /></button>
        </div>
    </div>
</div>
    ); 
}

export default Messaging;
