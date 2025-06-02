import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './_common/application/page/Navbar';
import logo from './resources/static/project-management.png'


// Project Pages
import ProjectList from './_subdomain/project/application/page/ProjectList';
import ProjectForm from './_subdomain/project/application/page/ProjectForm';
import Project from './_subdomain/project/domain/Project';

// Team Pages
import TeamList from './_subdomain/team/application/page/TeamList';
import TeamForm from './_subdomain/team/application/page/TeamForm';
import Team from './_subdomain/team/domain/Team';

// Team Member Pages
import TeamMemberForm from './_subdomain/team-member/application/page/TeamMemberForm';
import TeamMember from './_subdomain/team-member/domain/TeamMember';
import TicketForm from "./_subdomain/ticket/application/page/TicketForm";
import SignIn from "./_common/application/page/SignIn";
import {ToastContainer} from "react-toastify";

const Home = () => (
    <div className="container mt-5">
        <div className="text-center mb-5">
            <img src={logo} alt="Logo" style={{width: '80px'}}/>
            <h1 className="display-4 mt-3">TeamPulse</h1>
            <p className="lead">Streamline your project management with GitHub-driven collaboration.</p>
        </div>

        <div className="row">
            <div className="col-md-6">
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Projects</h5>
                        <p className="card-text">Create, edit, and track projects with full GitHub integration for
                            commits, issues, and more.</p>
                        <a href="/projects" className="btn text-white" style={{backgroundColor: '#6f42c1'}}>
                            Go to Projects
                        </a>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Teams</h5>
                        <p className="card-text">Organize and manage your teams and members. Assign roles and
                            collaborate efficiently.</p>
                        <a href="/teams" className="btn btn-success">Go to Teams</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NotFound = () => (
    <div className="container mt-4">
        <div className="alert alert-danger">
            <h4 className="alert-heading">Page Not Found</h4>
            <p>The page you are looking for does not exist.</p>
            <hr/>
            <p className="mb-0">
                <a href="/" className="alert-link">Go back to home page</a>
            </p>
        </div>
    </div>
);

function App() {
    return (
        <>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>

                    {/* Project Routes */}
                    <Route path="/projects" element={<ProjectList/>}/>
                    <Route path="/projects/new" element={<ProjectForm/>}/>
                    <Route path="/projects/edit/:id" element={<ProjectForm/>}/>
                    <Route path="/projects/:id" element={<Project/>}/>

                    <Route path="/tickets/new" element={<TicketForm/>}/>

                    {/* Team Routes */}
                    <Route path="/teams" element={<TeamList/>}/>
                    <Route path="/teams/new" element={<TeamForm/>}/>
                    <Route path="/teams/edit/:id" element={<TeamForm/>}/>
                    <Route path="/teams/:id" element={<Team/>}/>
                    <Route path="/teams/name/:teamName" element={<Team/>}/>

                    {/* Team Member Routes - no direct link in navbar, accessed through teams */}
                    <Route path="/members/new" element={<TeamMemberForm/>}/>
                    <Route path="/members/edit/:id" element={<TeamMemberForm/>}/>
                    <Route path="/members/:id" element={<TeamMember/>}/>
                    <Route path="/members/name/:memberName" element={<TeamMember/>}/>

                    <Route path="/auth/signin" element={<SignIn/>}/>

                    {/* 404 Route */}
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
                theme="colored" // colored theme supports warning colors
            />
        </>
    );
}

export default App;
