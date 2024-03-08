import { useEffect, useState } from "react";
import axios from "axios";
import Loading from '../components/Loading';
import { URL } from '../App';

function Chats({ handleUserClick, loggedInUser, isChatSelected, setIsChatSelected }) {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const token = localStorage.getItem('token');

    const [unreadMessages, setUnreadMessages] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${URL}/users`)
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            });
    }, []);
    
    useEffect(() => {
        if (loggedInUser) {
            axios.get(`${URL}/messages/unread?user=${loggedInUser.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const latestUnreadMessages = response.data.reduce((acc, message) => {
                    const userId = message.from._id;
                    if (!acc[userId]) {
                        acc[userId] = { text: message.text, count: 1 };
                    } else {
                        acc[userId].count += 1;
                    }
                    return acc;
                }, {});
                setUnreadMessages(latestUnreadMessages);
            })
            .catch(error => {
                console.error('Error fetching unread messages:', error);
            });
        }
    }, [loggedInUser, token]);

    const handleClick = (user) => {
        setActiveUser(user);
        handleUserClick(user);
        setIsChatSelected(true);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className={`chats-container ${isChatSelected ? 'hide-on-mobile' : ''}`}>
            <h3>Chats</h3>
            {users.filter(user => user._id !== loggedInUser.userId).map((user) => {
                const unreadMessage = unreadMessages[user._id];
                const messageText = unreadMessage ? unreadMessage.text : `Chat with ${user.firstName} ${user.lastName}`;
                const unreadCount = unreadMessage ? unreadMessage.count : 0;

            return (
                <div 
                    key={user._id}
                    className={`chats-user-container ${user._id === activeUser?._id ? 'chat-active' : ''}`} 
                    onClick={() => handleClick(user)}
                >
                    <div className="user">
                        <div className="user-info">
                            <img src={user.image} alt={user.name} />
                            <div>
                                <h4>{user.firstName} <span>{user.lastName}</span></h4>
                                <p>{messageText}</p>
                            </div>
                        </div>
                        <div className="user-notification">
                            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

}

export default Chats;
