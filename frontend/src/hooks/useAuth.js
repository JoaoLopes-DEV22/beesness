import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuth = (required = true) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (required && !token) {
            toast.error('Você precisa fazer login');
            navigate('/login');
        }
    }, [navigate, required, token]);

    return { isAuthenticated: !!token };
};