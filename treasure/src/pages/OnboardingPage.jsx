import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
    {
        icon: '🎉',
        title: 'Welcome to FinTrack!',
        desc: "You've just taken the first step toward smarter money management. FinTrack is built specifically for students who want to stay on top of their finances.",
        cta: 'Next',
    },
    {
        icon: '📊',
        title: 'Track Every Naira',
        desc: 'Log your income and expenses in seconds. See exactly where your money is going with beautiful charts and breakdowns.',
        features: [
            { icon: '💰', title: 'Income Tracking', desc: 'Log scholarships, part-time pay & allowances' },
            { icon: '💸', title: 'Expense Tracking', desc: 'Categorize food, transport, books & more' },
            { icon: '📈', title: 'Analytics', desc: 'Visual charts to understand your spending' },
            { icon: '🎯', title: 'Savings Goals', desc: 'Set targets and watch your progress grow' },
        ],
        cta: 'Next',
    },
    {
        icon: '🚀',
        title: "You're All Set!",
        desc: "Your journey to financial freedom starts now. Set your first savings goal and track your spending — your future self will thank you.",
        cta: "Let's Go →",
    },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
        // Mark onboarding done
        login({ ...user, isNew: false }, localStorage.getItem('financeToken'), false);
        navigate('/dashboard');
    };

    const s = STEPS[step];

    return (
        <div className="onboarding-page">
            <div className="onboarding-card">
                <div className="onboarding-step-dots">
                    {STEPS.map((_, i) => <div key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />)}
                </div>
                <div className="onboarding-icon">{s.icon}</div>
                <h2>{s.title}</h2>
                <p>{s.desc}</p>

                {s.features && (
                    <div className="features-grid">
                        {s.features.map(f => (
                            <div className="feature-item" key={f.title}>
                                <span className="fi-icon">{f.icon}</span>
                                <div>
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} onClick={handleNext}>
                    {s.cta}
                </button>
            </div>
        </div>
    );
}
