import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            // 1. Faz o login
            const loginResponse = await api.post('/auth', { email, password });
            
            // Exibe mensagem de sucesso
            toast.success(loginResponse.data.message || 'Login realizado com sucesso!');
            
            // Armazena token e dados do usuário
            localStorage.setItem('token', loginResponse.data.token);
            
            if (loginResponse.data.user) {
                const userData = loginResponse.data.user;
                localStorage.setItem('user', JSON.stringify(userData));

                // 2. Busca a conta do usuário usando o ID do usuário
                try {
                    const accountResponse = await api.get(`/accounts/user/${userData.id}`, {
                        headers: {
                            Authorization: `Bearer ${loginResponse.data.token}`
                        }
                    });

                    if (accountResponse.data.success && accountResponse.data.id_account) {
                        // 3. Atualiza os valores da conta
                        await api.post(
                            `/accounts/${accountResponse.data.id_account}/update-values`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${loginResponse.data.token}`
                                }
                            }
                        );
                        
                        // Atualiza os dados do usuário com a conta se necessário
                        const updatedUser = {
                            ...userData,
                            account: accountResponse.data.account
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                } catch (accountError) {
                    console.error('Erro ao buscar/atualizar conta:', accountError);
                    // Não impede o login se houver erro na conta
                }

                // Redireciona após 1.5 segundos
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            }
        } catch (error) {
            // Tratamento de erros
            if (error.response) {
                switch (error.response.status) {
                    case 422:
                        const errors = error.response.data.errors;
                        Object.values(errors).forEach(errorMessages => {
                            errorMessages.forEach(message => {
                                toast.error(message);
                            });
                        });
                        break;
                    case 401:
                        toast.error('Email ou senha incorretos');
                        break;
                    case 404:
                        toast.error('Usuário não encontrado');
                        break;
                    default:
                        toast.error('Ocorreu um erro durante o login');
                }
            } else {
                toast.error('Não foi possível conectar ao servidor');
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>

                        {/*<div className="forgot-password">
                            <a href="/forgot-password">Esqueci minha senha</a>
                        </div>*/}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only">Carregando...</span>
                                </>
                            ) : 'Entrar'}
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