import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import authService from '../service/authService'
import '../../../resources/styles/AuthForm.css'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate('/');
            window.location.reload()
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="auth-title">Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
