import React, { useState } from "react";
import axios from 'axios';
import '../styles/Login.css';
import accessImage from '../assets/images/access.svg';
import { BiSolidMessageDetail } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { URL } from "../App";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate(); 

    const handleSignupClick = () => {
        setIsLogin(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const handleLoginClick = () => {
        setIsLogin(true);
        setEmail('');
        setPassword('');
    };

    const handleDemoClick = () => {
        setIsLoading(true);
        const demoEmail = 'johndoe@gmail.com'; 
        const demoPassword = 'johndoe123';

        axios.post(`${URL}/users/login`, { email: demoEmail, password: demoPassword })
        .then(response => {
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
    };

    const handleSubmit = (event) => {
        setIsLoading(true);
        event?.preventDefault();
        if (isLogin) {
            axios.post(`${URL}/users/login`, { email, password })
                .then(response => {
                    localStorage.setItem('token', response.data.token);
                    navigate('/home');
                    setIsLoading(false);
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        setError('Email or Password is incorrect. Please try again.');
                    } else {
                        console.error('Error during login:', error);
                    }
                    setIsLoading(false);
                });
        } else {
            axios.post(`${URL}/users/signup`, { firstName, lastName, email, password })
                .then(response => {
                    localStorage.setItem('token', response.data.token);
                    navigate('/home');
                })
                .catch(error => {
                    console.error('Error during signup:', error);
                });
        }
    };

    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <main className="welcome-container">
            <section className="access-container">
                <div className="access-header">
                    <div className="logo-container">
                        <BiSolidMessageDetail/>
                        <h1>Messaging App</h1>
                    </div>
                    <div className="access-desc">
                        <h2>{isLogin ? "Welcome Back." : "Sign Up"}</h2>
                        {isLogin && <h3>Please enter your details or 
                            <span onClick={handleDemoClick}> try a demo account.</span>
                        </h3>}
                        {!isLogin && <h3>Already have an account? 
                            <span onClick={handleLoginClick}> Login</span>
                        </h3>}
                    </div>
                </div>
                <div className="access-form-container">
                <form onSubmit={handleSubmit}>
                        {!isLogin && <input required className="input-firstname" type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}></input>}
                        {!isLogin && <input required className="input-lastname" type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}></input>}
                        <input required className="input-email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
                        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
                        {error && <div className="error-message">{error}</div>}
                        <div className="btn-access-container">
                            <button className="btn-login" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
                            {isLogin && <button className="btn-sign-up" onClick={handleSignupClick}>Sign Up</button>}
                        </div>
                    </form>
                </div>
            </section>
            <section className="image-container">
                <img src={accessImage}></img>
            </section>
        </main>
    )
}

export default Login;
