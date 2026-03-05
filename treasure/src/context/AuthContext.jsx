import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const s = localStorage.getItem('financeUser');
        return s ? JSON.parse(s) : null;
    });

    const login = (userData, token, isNew = false) => {
        const u = { ...userData, isNew };
        setUser(u);
        localStorage.setItem('financeUser', JSON.stringify(u));
        localStorage.setItem('financeToken', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('financeUser');
        localStorage.removeItem('financeToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
