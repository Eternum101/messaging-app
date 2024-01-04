import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Profile.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaPenToSquare } from "react-icons/fa6";

function Profile({ loggedInUser }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (loggedInUser) {
            axios.get(`/users/${loggedInUser.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
        }
    }, [loggedInUser]);    

    if (!user) {
        return null; 
    }

    return (
        <section className="profile-layout-container">
            <Header />
            <Sidebar />
            <div className="profile-container">
    <div className="profile-info">
    <div className="edit-icon"><FaPenToSquare /></div>
        <div className="profile-avatar">
            <img src={`/${user.image}`} alt={user.name} />
        </div>
    <div className='profile-titles'>
        <h2>{user.firstName} {user.lastName}</h2>
        <p>{user.email}</p>
    </div>
    </div>
    <div className="profile-about">
        <div className='profile-about-info'>
        <div className="edit-icon"><FaPenToSquare /></div>
            <h3>About Me</h3>
            <p>Visual Designer with 7+ years of experience...</p>
        </div>
    <div className="profile-roles">
    <div className="edit-icon"><FaPenToSquare /></div>
        <h3>Latest Roles</h3>
        <p>UI Designer at Specialized Bicycle</p>
        <p>Interaction Designer at Critical Mass / On-Site Apple</p>
        <h4>Main Apps</h4>
        <p>Figma, Sketch, Photoshop, Framer</p>
    </div>
</div>
</div>
</section>
    );
}

export default Profile;
<button>Download CV</button>