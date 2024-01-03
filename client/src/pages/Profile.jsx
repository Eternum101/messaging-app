import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Profile.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Profile() {
    return (
        <section className="profile-layout-container">
            <Header />
            <Sidebar />
            <div className="profile-container">
    <div className="profile-info">
        <div className="profile-avatar">
            <img src="/images/default-profile-picture.jpg" alt="Profile" />
        </div>
    <div className='profile-titles'>
        <h2>John Doe</h2>
        <p>johndoe@gmail.com</p>
    </div>
    </div>
    <div className="profile-about">
        <div className='profile-about-info'>
            <h3>About Me</h3>
            <p>Visual Designer with 7+ years of experience...</p>
        </div>
    <div className="profile-roles">
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