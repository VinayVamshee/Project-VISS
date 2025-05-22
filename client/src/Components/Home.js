import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [loggedInAdmin, setLoggedInAdmin] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginType, setLoginType] = useState(null); // 'user' or 'admin'
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [userLoginData, setUserLoginData] = useState({ name: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminData = localStorage.getItem("admin");
        if (token && adminData) {
            setLoggedInAdmin(JSON.parse(adminData));
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("user");
        if (token && userData) {
            setLoggedInUser(JSON.parse(userData));
        }
    }, []);

    const handleProceed = () => {
        if (loggedInAdmin || loggedInUser) {
            navigate('/index');
        } else {
            setShowLoginModal(true);
        }
    };

    const handleAdminLogin = async () => {
        try {
            const res = await axios.post("http://localhost:3001/admin-login", {
                username: loginForm.username,
                password: loginForm.password,
            });
            if (res.data.admin && res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("admin", JSON.stringify(res.data.admin));
                setLoggedInAdmin(res.data.admin);
                alert("Login successful");
                setLoginType(null);
                setShowLoginModal(false);
                navigate('/index');
            } else {
                alert("Login failed: No token or admin data returned");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const handleUserLogin = async () => {
        try {
            const res = await axios.post("http://localhost:3001/user-login", {
                username: userLoginData.name,
                password: userLoginData.password,
            });
            if (res.data.user && res.data.token) {
                const { password, ...safeUserData } = res.data.user;
                localStorage.setItem("user", JSON.stringify(safeUserData));
                localStorage.setItem("userToken", res.data.token);
                setLoggedInUser(safeUserData);
                alert("Logged in successfully");
                setLoginType(null);
                setShowLoginModal(false);
                navigate('/index');
            } else {
                alert("Login failed: Missing user or token");
            }
        } catch (err) {
            alert("Login error: " + (err.response?.data?.message || err.message));
        }
    };

    const items = Array(5).fill('🚨 VISS - Vigilance Information Sharing System');

    return (
        <div className="mainPage">
            {/* Marquee */}
            <div className="marquee-wrapper">
                <div className="marquee">
                    {items.map((text, i) => (
                        <span key={`original-${i}`} className="marquee-item">{text}</span>
                    ))}
                    {items.map((text, i) => (
                        <span key={`duplicate-${i}`} className="marquee-item">{text}</span>
                    ))}
                </div>
            </div>

            {/* Vigilance Feature Section */}
            <div className="vigilance-feature">
                <h2 className="text-center">Welcome to VISS</h2>
                <p><strong>VISS</strong> is a secure and centralized digital platform designed to streamline vigilance information exchange, enhance operational efficiency, and bolster transparency across departments. It allows seamless communication and real-time data sharing to help authorized users identify and mitigate risks proactively.</p>
                <ul style={{ listStyle: 'none' }}>
                    <li>Centralized complaint monitoring</li>
                    <li>Real-time analytics and alerts</li>
                    <li>Role-based secure access</li>
                    <li>Audit trails for all actions</li>
                </ul>
                <div className="blink-box py-1 border border-2 rounded d-inline-block">
                    <button onClick={handleProceed} className="fw-bold text-dark btn btn-link">Proceed</button>
                </div>
            </div>

            {/* Login Modal Selector */}
            {showLoginModal && !loginType && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Please log in to continue</h5>
                                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
                            </div>
                            <div className="modal-body text-center">
                                <button className="btn btn-primary me-3" onClick={() => setLoginType('user')}>User Login</button>
                                <button className="btn btn-danger" onClick={() => setLoginType('admin')}>Admin Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Form Modal */}
            {showLoginModal && loginType && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{loginType === 'admin' ? 'Admin' : 'User'} Login</h5>
                                <button type="button" className="btn-close" onClick={() => setLoginType(null)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Username"
                                    value={loginType === 'admin' ? loginForm.username : userLoginData.name}
                                    onChange={(e) => loginType === 'admin'
                                        ? setLoginForm({ ...loginForm, username: e.target.value })
                                        : setUserLoginData({ ...userLoginData, name: e.target.value })}
                                />
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    placeholder="Password"
                                    value={loginType === 'admin' ? loginForm.password : userLoginData.password}
                                    onChange={(e) => loginType === 'admin'
                                        ? setLoginForm({ ...loginForm, password: e.target.value })
                                        : setUserLoginData({ ...userLoginData, password: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-success"
                                    onClick={loginType === 'admin' ? handleAdminLogin : handleUserLogin}
                                >
                                    Login
                                </button>
                                <button className="btn btn-outline-secondary" onClick={() => setLoginType(null)}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Explore More */}
            <div className="explore-more">
                <p style={{ fontSize: '2rem', color: 'black' }}> Explore More Applications Here...</p>
                <div className="websites">
                    <a href="https://vigilance-secr.vercel.app/" target="_blank" rel="noreferrer" className="website">
                        <img src="https://i.ibb.co/G3FGV4WJ/Whats-App-Image-2025-02-01-at-17-51-50.jpg" alt="IRWSI" />
                        <div>IRWSI</div>
                    </a>
                    <a href="https://vss-secr.vercel.app/" target="_blank" rel="noreferrer" className="website">
                        <img src="https://www.presentations.gov.in/wp-content/uploads/2020/06/CVC_Preview.png" alt="IRWSI" />
                        <div>VSS</div>
                    </a>
                </div>
            </div>
        </div>
    );
}
