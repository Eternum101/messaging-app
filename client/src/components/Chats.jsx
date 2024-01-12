import { useEffect, useState } from "react";
import axios from "axios";
import Loading from '../components/Loading';

function Chats({ handleUserClick, loggedInUser }) {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null); // Add this line

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/users')
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            });
    }, []);

    const handleClick = (user) => {
        setActiveUser(user);
        handleUserClick(user);
    };

    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <div className="chats-container">
            <h3>Chats</h3>
            {users.filter(user => user._id !== loggedInUser.userId).map((user) => (
                <div 
                    className={`chats-user-container ${user._id === activeUser?._id ? 'chat-active' : ''}`} 
                    onClick={() => handleClick(user)}
                >
                    <div key={user._id} className="user">
                        <img src={user.image} alt={user.name} />
                    <div className="user-info">
                        <h4>{user.firstName} <span>{user.lastName}</span></h4>
                        <p>Chat with {user.firstName} <span>{user.lastName}</span></p>
                    </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats;
