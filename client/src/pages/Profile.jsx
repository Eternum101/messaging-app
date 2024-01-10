import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Profile.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaPenToSquare } from "react-icons/fa6";

function Profile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');

    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isEditingRoles, setIsEditingRoles] = useState(false);

    const [editedData, setEditedData] = useState({});
    const [isHovered, setIsHovered] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

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
    
    const handleEditClickInfo = () => {
        if (!isEditingInfo) {
            setEditedData(userData);
        }
        setIsEditingInfo(!isEditingInfo);
    };

    const handleEditClickAbout = () => {
        if (!isEditingAbout) {
            setEditedData(userData);
        }
        setIsEditingAbout(!isEditingAbout);
    };

    const handleEditClickRoles = () => {
        if (!isEditingRoles) {
            setEditedData(userData);
        }
        setIsEditingRoles(!isEditingRoles);
    };

    const handleInputChange = (event) => {
        if (editedData) {
            setEditedData({
                ...editedData,
                [event.target.name]: event.target.value,
            });
        }
    };
    
    const handleMouseOver = () => {
        setIsHovered(true);
    };
    
    const handleMouseOut = () => {
        setIsHovered(false);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        Object.keys(editedData).forEach(key => formData.append(key, editedData[key]));
        
        axios.put('/users/current', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            setUserData(response.data);
            setIsEditingInfo(false);
            setIsEditingAbout(false);
            setIsEditingRoles(false);
            URL.revokeObjectURL(editedData.imageUrl);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error updating user data:', error);
            setIsLoading(false);
        })
    }

    const fileInputRef = React.createRef();

    const handleAvatarClick = () => {
        if (!isEditingInfo) {
            return;
        }
        fileInputRef.current.click();
    };    

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setEditedData({
                ...editedData,
                image: file,
                imageUrl: imageUrl,
            });
        }
    };    
    
    return (
        <section className="profile-layout-container">
            <Header loggedInUser={loggedInUser}/>
            <Sidebar loggedInUser={loggedInUser}/>
            <div className="profile-container">
    <div className="profile-info">
    <div className="edit-icon" onClick={handleEditClickInfo}><FaPenToSquare /></div>
        <div className="profile-avatar" onClick={handleAvatarClick}>
        <img 
            src={isEditingInfo ? (editedData.imageUrl || userData?.image) : userData?.image}
            alt={userData?.firstName} 
            style={isEditingInfo ? (isHovered ? { cursor: 'pointer', transform: 'translateY(-1rem)', opacity: '0.5' } : { cursor: 'pointer', opacity: '1' }) : { opacity: '1' }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        />
    </div>
        <div className='profile-titles'>
                    {isEditingInfo ? (
                        <form className="profile-form" onSubmit={handleFormSubmit}>
                            <input type="text" name="firstName" value={editedData.firstName} onChange={handleInputChange} />
                            <input type="text" name="lastName" value={editedData.lastName} onChange={handleInputChange} />
                            <input type="email" name="email" value={editedData.email} onChange={handleInputChange} />
                            <input type="file" name='image' ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                            <button type="submit">{isLoading ? 'Saving...' : 'Save'}</button>
                        </form>
                    ) : (
                        <>
                            <h2>{userData?.firstName} {userData?.lastName}</h2>
                            <p>{userData?.email}</p>
                        </>
                    )}
                </div>
            </div>
    <div className="profile-about">
        <div className='profile-about-info'>
        <div className="edit-icon" onClick={handleEditClickAbout}><FaPenToSquare /></div>
            <h3>About Me</h3>
            {isEditingAbout  ? (
            <form className="profile-form" onSubmit={handleFormSubmit}>
                <textarea name="about" placeholder="Enter about info..." value={editedData.about || ''} onChange={handleInputChange} />
                <button type="submit">{isLoading ? 'Loading...' : 'Save'}</button>
            </form>
        ) : (
            <p>{userData?.about || 'No about info provided.'}</p>
        )}
    </div>
    <div className="profile-roles">
    <div className="edit-icon" onClick={handleEditClickRoles}><FaPenToSquare /></div>
        <h3>Latest Roles</h3>
        {isEditingRoles ? (
        <form className="profile-form" onSubmit={handleFormSubmit}>
            <textarea name="roles" placeholder="Enter roles info..." value={editedData.roles || ''} onChange={handleInputChange} />
            <h4>Main Apps</h4>
            <input name="apps" placeholder="Enter apps info..." value={editedData.apps || ''} onChange={handleInputChange} />
            <button type="submit">{isLoading ? 'Loading...' : 'Save'}</button>
        </form>
    ) : (
        <>
            <p>{userData?.roles || 'No roles info provided.'}</p>
            <h4>Main Apps</h4>
            <p>{userData?.apps || 'No apps info provided.'}</p>
        </>
    )}
</div>
</div>
</div>
</section>
    );
}

export default Profile;
