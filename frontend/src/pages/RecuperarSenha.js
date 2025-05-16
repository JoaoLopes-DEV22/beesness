import React, { useState } from 'react';
import '../css/pages/Login.css';

function Recuperar() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password, confirmPassword, });
    };

    return (
        <div className="screen-login">
            <div className="area">
                <main className="login-container">
                    <div className="img-area">
                        <img src="/assets/profiles/img_profile.png" alt="Perfil" />
                    </div>

                    <h1 style={{ textAlign: 'center', width: '100%' }}>Recuperar Senha</h1>

                    <form className="login-form" onSubmit={handleSubmit}>
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
                            <input
                                type="password"
                                id="new-password"
                                name="password"
                                placeholder="Nova Senha"
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

                        <button type="submit" className="login-button">Enviar</button>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default Recuperar;
