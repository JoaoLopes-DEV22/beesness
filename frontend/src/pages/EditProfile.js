import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../api';
import '../css/pages/Perfil.css';

function EditProfile() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                if (response.data.status) {
                    const { name, email, birth } = response.data.data;
                    setName(name);
                    setEmail(email);
                    setBirthDate(birth);
                } else {
                    toast.error(response.data.message || 'Erro ao buscar usuário.');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao conectar com o servidor.');
            }
        };

        fetchUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {};
        if (name) payload.name = name;
        if (email) payload.email = email;
        if (birthDate) payload.birth = birthDate;
        if (password) payload.password = password;

        try {
            const response = await api.put('/profile', payload);
            toast.success(response.data.message || 'Perfil atualizado com sucesso!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao atualizar perfil.');
        }
    };

    return (
        <div className="screen">
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
            <div className="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div className="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div className="title_area">
                        <button onClick={handleBack} className="back_button">
                            <FiArrowLeft className="back_icon" />
                        </button>
                        <h1>Configurações da Conta</h1>
                    </div>
                    <div className="card_perfil_edit">
                        <form onSubmit={handleSave} className="profile_form">
                            <div className="form-group">
                                <label htmlFor="name">Nome</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
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
                                <label htmlFor="birthDate">Data de Nascimento</label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Nova Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Nova Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="save_button">
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditProfile;