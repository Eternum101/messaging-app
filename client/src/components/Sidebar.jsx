import { RiMessage3Fill, RiSettingsFill, RiAdminFill, RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get('/logout')
            .then(() => {
                localStorage.removeItem('token');
                console.log('Logged out');
                navigate('/');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <div className="sidebar">
            <ul className="icon-container">
                <li>
                    <RiMessage3Fill/>
                </li>
                <li>
                    <RiSettingsFill />
                </li>
                <li>
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