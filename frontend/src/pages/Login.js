import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/pages/Login.css';
import api from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth', { email, password });
            toast.success(response.data.message || 'Login realizado com sucesso!');
            localStorage.setItem('token', response.data.token);

            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            event.preventDefault();
            console.log('aq')
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach(errorMessages => {
                    errorMessages.forEach(message => {
                        toast.error(message);
                    });
                });
            } else if (error.response?.status === 401) {
                toast.error('Email ou senha incorretos');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="screen-login">
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

            <div className="area">
                <main className="login-container">
                    <div className='img-area'>
                        <img src='/assets/profiles/img_profile.png' alt="Profile" />
                    </div>

                    <h1>Login</h1>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder='Senha'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="forgot-password">
                            <a href="/forgot-password">Esqueci minha senha</a>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Carregando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="signup-link">
                        Não possui uma conta? <a href="/signup">Cadastre-se</a>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Login;