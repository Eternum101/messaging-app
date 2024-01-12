import { useState, useEffect } from 'react';
import axios from 'axios';

const useCurrentUser = (loggedInUser) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (loggedInUser && !userData) {
            axios.get('/users/current', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUserData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            });
        }
    }, [loggedInUser, userData]);

    return { userData, isLoading, setUserData };
};

export default useCurrentUser;