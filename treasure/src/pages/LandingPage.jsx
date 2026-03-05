import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <Link to="/" className="logo">
                    <div className="logo-box">💎</div>
                    FinTrack
                </Link>
                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#about" className="nav-link">About</a>
                    <Link to="/auth" className="btn btn-ghost">Login</Link>
                    <Link to="/auth?mode=signup" className="btn btn-primary">Start for Free</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Master Your Money, <span>Student Edition</span></h1>
                    <p>
                        The all-in-one financial dashboard designed specifically for students.
                        Track allowances, monitor spending, and reach your savings goals with ease.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth?mode=signup" className="btn btn-primary btn-lg" style={{ padding: '14px 28px', fontSize: '16px' }}>
                            Get Started Now — It's Free
                        </Link>
                        <Link to="/auth" className="btn btn-ghost btn-lg" style={{ padding: '14px 28px', fontSize: '16px' }}>
                            View Demo
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Using the generated image */}
                    <img
                        src="/landing_hero.png"
                        alt="FinTrack Dashboard"
                    />
                    <div className="floating-card card-1">
                        <span style={{ fontSize: '24px' }}>📈</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>+12% Savings</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>This month</div>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <span style={{ fontSize: '24px' }}>💰</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>Goal Reached!</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Laptop Fund 💻</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-title">
                    <h2>Everything a Student Needs</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Powerful tools to keep your finances in check without the complexity.</p>
                </div>
                <div className="features-grid-landing">
                    <div className="feature-card-landing">
                        <div className="feature-icon-landing">📅</div>
                        <h3>Income Tracking</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Log your allowances, part-time jobs, and scholarships in one structured place.</p>
                    </div>
                    <div className="feature-card-landing">
                        <div className="feature-icon-landing">💸</div>
                        <h3>Smart Expenses</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Categorize your spending on food, transit, and books. Know where every cent goes.</p>
                    </div>
                    <div className="feature-card-landing">
                        <div className="feature-icon-landing">🎯</div>
                        <h3>Savings Goals</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Set targets for that new gadget or trip. Track your progress with visual growth bars.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-box">
                    <div className="cta-bg"></div>
                    <h2>Ready to Take Control?</h2>
                    <p>Join thousands of students managing their finances smarter with FinTrack.</p>
                    <Link to="/auth?mode=signup" className="btn btn-success" style={{ background: 'white', color: 'var(--primary)', padding: '16px 32px', fontSize: '18px' }}>
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    <span style={{ color: 'var(--primary)' }}>💎</span> FinTrack
                </div>
                <div>&copy; {new Date().getFullYear()} FinTrack for Students. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <a href="#" className="nav-link">Privacy</a>
                    <a href="#" className="nav-link">Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
