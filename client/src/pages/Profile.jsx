import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Profile.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaPenToSquare } from "react-icons/fa6";

function Profile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
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
        <section className="profile-layout-container">
            <Header loggedInUser={loggedInUser}/>
            <Sidebar loggedInUser={loggedInUser}/>
            <div className="profile-container">
    <div className="profile-info">
    <div className="edit-icon"><FaPenToSquare /></div>
        <div className="profile-avatar">
            <img src={`/${userData?.image}`} alt={userData?.firstName} />
        </div>
    <div className='profile-titles'>
        <h2>{userData?.firstName} {userData?.lastName}</h2>
        <p>{userData?.email}</p>
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
