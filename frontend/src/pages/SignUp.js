import React, { useState } from 'react';
import '../css/pages/Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { RiArrowGoBackLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/register', { email, password, confirmPassword, date, name });
            toast.success(response.data.message || 'Usuário cadastrado com sucesso!');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            event.preventDefault();
            if (error.response?.status === 422) {
                const errors = error.response.data.message;
                Object.values(errors).forEach(errorMessages => {
                    errorMessages.forEach(message => {
                        toast.error(message);
                    });
                });
            }
        } finally {
            setIsLoading(false);
        }
    }
    console.log({ email, password, confirmPassword, date, name });

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
                <a href="/"><RiArrowGoBackLine className='goBack' /></a>

                <main className="login-container singup">
                    <div className="img-area">
                        <img src="/assets/profiles/img_profile.png" alt="Perfil" />
                    </div>

                    <h1 style={{ textAlign: 'center', width: '100%' }}>Cadastro</h1>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Nome Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <h3>Data de Nascimento:</h3>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                placeholder="Data de Nascimento"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="new-password"
                                name="password"
                                placeholder="Criar Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                placeholder="Confirmar Senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Carregando...' : 'Criar'}
                        </button>
                        <div className="login-link">
                            <a href="/">Já possui uma conta?</a>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default SignUp;
