import { useState, useEffect } from 'react';
import axios from 'axios';

const useCurrentUser = (loggedInUser) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loggedInUser) {
            const token = localStorage.getItem('token');
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
    }, [loggedInUser]);

    return { userData, isLoading };
};

export default useCurrentUser;
