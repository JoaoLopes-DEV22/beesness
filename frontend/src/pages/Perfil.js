import React, { useEffect, useState } from 'react';
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
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                if (response.data.status) {
                    const { birth, email } = response.data.data;
                    setBirth(birth);
                    setEmail(email);
                } else {
                    toast.error(response.data.message || 'Erro ao buscar usuário.');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao conectar com o servidor.');
            }
        };

        fetchUser();
    }, []);

    function reformatarData(data) {
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
    }

    return (
        <div class="screen">
            <div class="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div class="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div class="title_area">
                        <h1 className='perfil_h1'>Perfil</h1>
                    </div>

                    <div class="card_perfil">

                        <div class="background_perfil">
                            <img src="/assets/camera.png" class="icon_background_perfil"></img>
                        </div>

                        <img src="/assets/profiles/img_profile.png" class="foto_perfil"></img>

                        <div class="camera_perfil">
                            <img src="/assets/camera.png" class="icon_perfil"></img>
                        </div>



                        <div className="content_perfil">
                            <div class="info_perfil">
                                <div class="title_butao_perfil">
                                    <h1 class="usuario_perfil">Usuário</h1>
                                    <button class="botao_editar_perfil" onClick={redirectPageEdit}>Editar perfil</button>
                                </div>
                                <h1 class="email_perfil">Email: {email}</h1>
                                <h1 class="nasc_perfil">Data de Nascimento: {reformatarData(birth)} </h1>
                            </div>

                            <div class="info_perfil">
                                <h1 class="saldo_perfil">Saldo Total</h1>
                                <h1 class="dinheiro_perfil">R$ 7.050,63</h1>
                            </div>

                            <button onClick={handleLogout} class="botao_sair_perfil">Sair da conta</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Perfil;