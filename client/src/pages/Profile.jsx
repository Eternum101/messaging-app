import React, { useState } from "react";
import axios from "axios";
import '../styles/Profile.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaPenToSquare } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail, MdClose } from "react-icons/md";
import { CountryDropdown } from 'react-country-region-selector';
import imageCompression from 'browser-image-compression';

import useCurrentUser from "../hooks/useCurrentUser";

function Profile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = localStorage.getItem('token');
    const { userData, setUserData } = useCurrentUser(loggedInUser);

    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isEditingRoles, setIsEditingRoles] = useState(false);
    const [isImageEdited, setIsImageEdited] = useState(false);

    const [editedData, setEditedData] = useState({});
    const [editedImage, setEditedImage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

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
    
        if (isImageEdited && editedImage) {
            formData.append('image', editedImage.image);
        }
    
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
            if (editedImage) {
                URL.revokeObjectURL(editedImage.imageUrl);
                setEditedImage(null);
            }
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

    const handleImageChange = async (event) => {
        if (event.target.files[0]) {
            setIsImageEdited(true);
            const file = event.target.files[0];
    
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 200,
                useWebWorker: true,
            };
    
            try {
                const compressedFile = await imageCompression(file, options);
                const imageUrl = URL.createObjectURL(compressedFile);
                setEditedImage({
                    image: compressedFile,
                    imageUrl: imageUrl,
                });
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };
    
    return (
        <section className="profile-layout-container">
            <Header loggedInUser={loggedInUser}/>
            <Sidebar loggedInUser={loggedInUser}/>
            <div className="profile-container">
    <div className="profile-info">
    <div className="edit-icon" onClick={handleEditClickInfo}>{isEditingInfo ? <MdClose /> : <FaPenToSquare />}</div>
<div className="profile-avatar" onClick={handleAvatarClick}>
    <img 
        src={isEditingInfo ? (editedImage?.imageUrl || editedData.imageUrl || userData?.image) : userData?.image}
        alt={userData?.firstName} 
        style={isEditingInfo ? (isHovered ? { cursor: 'pointer', transform: 'translateY(-1rem)', opacity: '0.5' } : { cursor: 'pointer', opacity: '1' }) : { opacity: '1' }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
    />
</div>
        <div className='profile-titles'>
    {isEditingInfo ? (
        <form className="profile-form" onSubmit={handleFormSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" type="text" name="firstName" value={editedData.firstName} onChange={handleInputChange} />
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" type="text" name="lastName" value={editedData.lastName} onChange={handleInputChange} />
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={editedData.email} onChange={handleInputChange} />
            <label htmlFor="location">Location</label>
    <CountryDropdown
        id="location"
        value={editedData.location}
        onChange={(val) => handleInputChange({ target: { name: 'location', value: val } })}
    />
            <input type="file" name='image' ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
            <button type="submit">{isLoading ? 'Saving...' : 'Save'}</button>
        </form>
    ) : (
    <>
        <h2>{userData?.firstName} {userData?.lastName}</h2>
        <p><MdEmail/>{userData?.email}</p>
        <p><FaLocationDot/>{userData?.location || 'No location provided.'}</p>
        </>
    )}
        </div>
    </div>
    <div className="profile-about">
        <div className='profile-about-info'>
        <div className="edit-icon" onClick={handleEditClickAbout}>{isEditingAbout ? <MdClose /> : <FaPenToSquare />}</div>
            <h3>About Me</h3>
            {isEditingAbout  ? (
            <form className="profile-form" onSubmit={handleFormSubmit}>
                <textarea name="about" placeholder="Enter about info..." value={editedData.about || ''} onChange={handleInputChange} />
                <button type="submit">{isLoading ? 'Saving...' : 'Save'}</button>
            </form>
        ) : (
            <p>{userData?.about || 'No about info provided.'}</p>
        )}
    </div>
    <div className="profile-roles">
    <div className="edit-icon" onClick={handleEditClickRoles}>{isEditingRoles ? <MdClose /> : <FaPenToSquare />}</div>
        <h3>Latest Roles</h3>
        {isEditingRoles ? (
        <form className="profile-form" onSubmit={handleFormSubmit}>
            <textarea name="roles" placeholder="Enter roles info..." value={editedData.roles || ''} onChange={handleInputChange} />
            <h4>Main Apps</h4>
            <input name="apps" placeholder="Enter apps info..." value={editedData.apps || ''} onChange={handleInputChange} />
            <button type="submit">{isLoading ? 'Saving...' : 'Save'}</button>
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
