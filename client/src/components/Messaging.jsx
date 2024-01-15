import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import Loading from '../components/Loading';

function Messaging({ user, loggedInUser, isChatSelected, setIsChatSelected }) {
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState('');
    const token = localStorage.getItem('token');

    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && loggedInUser && isChatSelected) {
            axios.get(`/messages?user=${user._id}&from=${loggedInUser.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setMessages(response.data);
                setIsLoading(false);
                if (isChatSelected) {
                    response.data.forEach(message => {
                        if (message.unread && message.to === loggedInUser.userId) { // Check if the logged-in user is the recipient
                            axios.put(`/messages/${message._id}/read`, {}, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                            .then(response => {
                                console.log('Message marked as read:', response.data);
                            })
                            .catch(error => {
                                console.error('Error marking message as read:', error);
                            });
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                setIsLoading(false);
            });
        }
    }, [user, loggedInUser, isChatSelected]);
    
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
    
    const toggleEmojiPicker = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    };

    const onEmojiClick = (emojiObject, event) => {
        setNewMessage(newMessage + emojiObject.emoji);
    };
    
    const handleBackClick = () => {
        setIsChatSelected(false);
    };
      
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className={`messaging-container ${isChatSelected ? '' : 'hide-on-mobile'}`}>
            <div className="messaging-header">
                <button className='btn-back' onClick={handleBackClick}><IoArrowBackCircleOutline /></button>
                <img src={user.image} alt={user.name} />
            <div className="messaging-header-info">
                <h3>{user.firstName} {user.lastName}</h3>
                <h4>{user.email}</h4>
            </div>
            </div>
            <div className="messaging-content">
    {messages.map((message) => {
        const fromUserId = typeof message.from === 'string' ? message.from : message.from._id;
        return (
            <div key={message._id} className="messaging-user-container"> {/* Use message._id as the key */}
                <div 
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
        <div style={{ position: 'relative' }}>
            <button onClick={toggleEmojiPicker}><MdOutlineEmojiEmotions /></button> 
            {isEmojiPickerVisible && <div style={{ position: 'absolute', left: 20, bottom: '100%' }}><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
        </div>
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Write a message..."/>
            <button className='btn-send' onClick={handleSendClick} disabled={newMessage === ''} style={{ opacity: newMessage === '' ? 0.5 : 1 }}><IoSend /></button>
        </div>
    </div>
</div>
    ); 
}

export default Messaging;
