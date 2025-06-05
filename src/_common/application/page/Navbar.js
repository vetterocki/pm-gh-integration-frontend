import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../service/authService';
import logo from '../../../resources/static/project-management.png';
import LanguageToggle from './LanguageToggle';
import "../../../resources/styles/App.css";

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const user = authService.getCurrentUser();
        console.log(user)
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#6f42c1'}}>
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <img
                        src={logo}
                        alt="PulseHub Logo"
                        style={{
                            width: '30px',
                            height: '30px',
                            objectFit: 'contain'
                        }}
                        className="me-2"
                    />
                    <span className="fw-bold">{t('app.title')}</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/projects">{t('navigation.projects')}</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/teams">{t('navigation.teams')}</Link>
                        </li>
                    </ul>
                </div>
                <ul className="navbar-nav ms-auto d-flex align-items-center">
                    <li className="nav-item d-flex align-items-center me-3">
                        <LanguageToggle />
                    </li>
                    {currentUser ? (
                        <>
                            <li className="nav-item d-flex align-items-center text-white px-3">
                                <span className="me-2 fw-semibold d-flex align-items-center gap-2">
                                    {currentUser.avatarUrl && (
                                        <img
                                            src={currentUser.avatarUrl}
                                            alt="Avatar preview"
                                            className="avatar-preview-img"
                                            style={{width: '32px', height: '32px', borderRadius: '50%'}}
                                        />
                                    )}
                                    {currentUser.firstName + ' ' + currentUser.lastName}
                                   </span>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>{t('navigation.signOut')}
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item d-flex align-items-center">
                            <Link className="nav-link nav-link-custom" to="/auth/signin">{t('navigation.signIn')}</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
