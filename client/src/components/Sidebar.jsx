import { RiMessage3Fill, RiSettingsFill, RiAdminFill, RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

function Sidebar() {
    const navigate = useNavigate();

    const [showNotification, setShowNotification] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleIconClick = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
    };

    return (
        <div className="sidebar">
            {showNotification && (
                <div className="info-div">
                    <div className="info-icon">
                        <IoMdInformationCircleOutline />
                    </div>
                <div className="info-details">
                    <h3>Icon Notifcation</h3>
                    This icon is for display purposes only.
                </div>
                    </div>
            )}
            <ul className="icon-container">
                <NavLink to='/home' className='active'>
                <li>
                    <RiMessage3Fill/>
                </li>
                </NavLink>
                <li onClick={handleIconClick}>
                    <RiSettingsFill />
                </li>
                <li onClick={handleIconClick}>
                    <RiAdminFill />
                </li>
            </ul>
            <div className="logout-container">
                <button onClick={handleLogout}><RiLogoutBoxLine /></button>
            </div>
        </div>
    )
}

export default Sidebar;