import { RiMessage3Fill, RiSettingsFill, RiAdminFill, RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";

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
                <NavLink to='/home' activeClassName='active'>
                <li>
                    <RiMessage3Fill/>
                </li>
                </NavLink>
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