import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Import the CSS file

const LandingPage = () => {
    const navigate = useNavigate();

    // Removed the automatic navigation to /login, it's not needed for a true landing page.

    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1>Real-Time Collaboration Platform</h1>
                <p className="description">
                    Experience seamless collaboration with our platform. Work together in real-time,
                    share ideas, and achieve more, faster. Whether you're brainstorming,
                    coding, or designing, our tools make it easy to connect and create.
                </p>
                
                <div className="button-group">
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="register-button" onClick={() => navigate('/register')}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;