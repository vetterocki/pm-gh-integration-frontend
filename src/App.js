import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './_common/application/page/Navbar';
import logo from './resources/static/project-management.png'


import ProjectList from './_subdomain/project/application/page/ProjectList';
import ProjectForm from './_subdomain/project/application/page/ProjectForm';
import Project from './_subdomain/project/domain/Project';

import TeamList from './_subdomain/team/application/page/TeamList';
import TeamForm from './_subdomain/team/application/page/TeamForm';
import Team from './_subdomain/team/domain/Team';

import TeamMemberForm from './_subdomain/team-member/application/page/TeamMemberForm';
import TeamMember from './_subdomain/team-member/domain/TeamMember';
import TicketForm from "./_subdomain/ticket/application/page/TicketForm";
import SignIn from "./_common/application/page/SignIn";
import {ToastContainer} from "react-toastify";

const Home = () => {
    const { t } = useTranslation();
    
    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <img src={logo} alt="Logo" style={{width: '80px'}}/>
                <h1 className="display-4 mt-3">{t('app.title')}</h1>
                <p className="lead">{t('app.subtitle')}</p>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{t('home.projectsTitle')}</h5>
                            <p className="card-text">{t('home.projectsDescription')}</p>
                            <a href="/projects" className="btn text-white" style={{backgroundColor: '#6f42c1'}}>
                                {t('home.goToProjects')}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{t('home.teamsTitle')}</h5>
                            <p className="card-text">{t('home.teamsDescription')}</p>
                            <a href="/teams" className="btn btn-success">{t('home.goToTeams')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotFound = () => {
    const { t } = useTranslation();
    
    return (
        <div className="container mt-4">
            <div className="alert alert-danger">
                <h4 className="alert-heading">{t('errors.pageNotFound')}</h4>
                <p>{t('errors.pageNotFoundMessage')}</p>
                <hr/>
                <p className="mb-0">
                    <a href="/" className="alert-link">{t('errors.goBackHome')}</a>
                </p>
            </div>
        </div>
    );
};

function App() {
    return (
        <>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>

                    <Route path="/projects" element={<ProjectList/>}/>
                    <Route path="/projects/new" element={<ProjectForm/>}/>
                    <Route path="/projects/edit/:id" element={<ProjectForm/>}/>
                    <Route path="/projects/:id" element={<Project/>}/>

                    <Route path="/tickets/new" element={<TicketForm/>}/>

                    <Route path="/teams" element={<TeamList/>}/>
                    <Route path="/teams/new" element={<TeamForm/>}/>
                    <Route path="/teams/edit/:id" element={<TeamForm/>}/>
                    <Route path="/teams/:id" element={<Team/>}/>
                    <Route path="/teams/name/:teamName" element={<Team/>}/>

                    <Route path="/members/new" element={<TeamMemberForm/>}/>
                    <Route path="/members/edit/:id" element={<TeamMemberForm/>}/>
                    <Route path="/members/:id" element={<TeamMember/>}/>
                    <Route path="/members/name/:memberName" element={<TeamMember/>}/>

                    <Route path="/auth/signin" element={<SignIn/>}/>

                    <Route path="/404" element={<NotFound/>}/>
                    <Route path="*" element={<Navigate to="/404"/>}/>
                </Routes>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default App;
