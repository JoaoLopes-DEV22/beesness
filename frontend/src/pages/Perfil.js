import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/Perfil.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from '../api';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";

function Perfil() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState('');
    const [profileImage, setProfileImage] = useState('/assets/profiles/img_profile.png');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                if (response.data.status) {
                    const { birth, email, profile_picture } = response.data.data;
                    setBirth(birth);
                    setEmail(email);

                    if (profile_picture) {
                        // Monta a URL completa da imagem
                        setProfileImage(`http://localhost:8000/storage/profiles/${profile_picture}`);
                    } else {
                        setProfileImage('/assets/profiles/img_profile.png');
                    }
                }
            } catch (error) {
                toast.error('Erro ao carregar perfil');
            }
        };

        fetchUser();
    }, []);

    function reformatarData(data) {
        if (!data) return '';
        const partes = data.split('-');
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const handleLogout = async () => {
        try {
            const response = await api.post('/logout');
            toast.success(response.data.message || 'Logout realizado com sucesso!');

            localStorage.removeItem('token');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao realizar logout.');
        }
    };

    const redirectPageEdit = () => {
        navigate('/edit-profile');
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Verifica se o usuário está logado
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Você precisa estar logado para alterar a imagem');
            return;
        }

        // Verificações do arquivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Por favor, selecione uma imagem (JPEG, PNG ou GIF)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('A imagem deve ter no máximo 2MB');
            return;
        }

        // Cria preview temporária
        const reader = new FileReader();
        reader.onload = (event) => {
            setProfileImage(event.target.result);
        };
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('profile_picture', file);

            const response = await api.post('/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                toast.success(response.data.message);
                // Usa a URL retornada pelo servidor
                setProfileImage(response.data.image_url);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || error.message || 'Erro ao enviar imagem.');

            // Reverte para a imagem anterior
            try {
                const userResponse = await api.get('/user');
                if (userResponse.data.data?.profile_picture) {
                    // Usa a URL completa do servidor
                    const fullUrl = `${process.env.REACT_APP_API_URL}/storage/${userResponse.data.data.profile_picture}`;
                    setProfileImage(fullUrl);
                } else {
                    setProfileImage('/assets/profiles/img_profile.png');
                }
            } catch (fetchError) {
                setProfileImage('/assets/profiles/img_profile.png');
            }
        }
    };

    return (
        <div className="screen">
            <div className="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div className="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div className="title_area">
                        <h1 className='perfil_h1'>Perfil</h1>
                    </div>

                    <div className="card_perfil">
                        <div className="background_perfil">
                            <img src="/assets/camera.png" className="icon_background_perfil" alt="Background" />
                        </div>

                        <img
                            src={profileImage}
                            className="foto_perfil"
                            alt="Foto de perfil"
                            onClick={handleImageClick}
                            onError={(e) => {
                                e.target.src = '/assets/profiles/img_profile.png';
                            }}
                        />

                        <div className="camera_perfil" onClick={handleImageClick}>
                            <img src="/assets/camera.png" className="icon_perfil" alt="Alterar foto" />
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />

                        <div className="content_perfil">
                            <div className="info_perfil">
                                <div className="title_butao_perfil">
                                    <h1 className="usuario_perfil">Usuário</h1>
                                    <button className="botao_editar_perfil" onClick={redirectPageEdit}>Editar perfil</button>
                                </div>
                                <h1 className="email_perfil">Email: {email}</h1>
                                <h1 className="nasc_perfil">Data de Nascimento: {reformatarData(birth)}</h1>
                            </div>

                            <div className="info_perfil">
                                <h1 className="saldo_perfil">Saldo Total</h1>
                                <h1 className="dinheiro_perfil">R$ 7.050,63</h1>
                            </div>

                            <button onClick={handleLogout} className="botao_sair_perfil">Sair da conta</button>
                        </div>
                    </div>
                </main>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Perfil;