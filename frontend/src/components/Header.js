import '../css/components/Header.css';
import { TbLayoutSidebarFilled } from 'react-icons/tb';
import { IoIosNotifications } from 'react-icons/io';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { useEffect, useState } from 'react';

function Header({ toggleSidebar }) {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState('/assets/profiles/img_profile.png');
    const url = 'http://localhost:8000'

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                if (response.data.status) {
                    const { name, profile_picture } = response.data.data;
                    setName(name);
                    if (profile_picture) {
                        setProfileImage(`${url}/storage/profiles/${profile_picture}`);
                    } else {
                        setProfileImage('/assets/profiles/img_profile.png');
                    }
                } else {
                    toast.error(response.data.message || 'Erro ao buscar usuário.');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao conectar com o servidor.');
            }
        };

        fetchUser();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsDropdownOpen(false);
    };

    return (
        <div>
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
            <header>
                <div className="left_items">
                    <TbLayoutSidebarFilled id="sb_icon" onClick={toggleSidebar} />
                </div>
                <div className="right_items">
                    <div className="profile_area">
                        <p style={{ textTransform: 'capitalize' }}>Olá, {name}</p>
                        <img
                            src={profileImage}
                            alt="Foto de Perfil"
                            onClick={toggleDropdown}
                            style={{ cursor: 'pointer' }}
                            onError={(e) => {
                                e.target.src = '/assets/profiles/img_profile.png';
                            }}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown_menu">
                                <button
                                    onClick={handleProfileClick}
                                    className="dropdown_item"
                                >
                                    <FiSettings className="dropdown_icon" />
                                    Configurações
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="dropdown_item logout_button"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;