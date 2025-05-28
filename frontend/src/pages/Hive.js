import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import AchievementCard from '../components/AchievementCard.js';
import AccessoryCard from '../components/AccessoryCard.js';
import DecorationCard from '../components/DecorationCard.js';
import HiveDecorationModal from '../components/DecorationModal.js';
import '../css/pages/Hive.css';
import api from '../api'; // Seu axios instance configurado
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

function Home() {
    // --- Estados para controle de UI ---
    const [isShopMode, setIsShopMode] = useState(true);
    const [isAccessories, setIsAccessories] = useState(true);
    const [selectedAchievementFilter, setSelectedAchievementFilter] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- Estados para dados da abelha e loja ---
    const [bee, setBee] = useState(null);
    const [sunflowers, setSunflowers] = useState(null);
    const [loadingBee, setLoadingBee] = useState(true);

    // --- NOVOS ESTADOS PARA RENOMEAR A ABELHA ---
    const [isEditingBeeName, setIsEditingBeeName] = useState(false);
    const [newBeeNameInput, setNewBeeNameInput] = useState('');

    // --- Estados para listagens da loja/conquistas ---
    const [accessories, setAccessories] = useState([]);
    const [ownedAccessoriesMap, setOwnedAccessoriesMap] = useState(new Map());
    const [equippedDisplay, setEquippedDisplay] = useState({
        head: '',
        face: '',
        body: ''
    });

    const [decorations, setDecorations] = useState([]);
    const [ownedDecorationsMap, setOwnedDecorationsMap] = useState(new Map());

    const [achievements, setAchievements] = useState([]);
    const [userAchievementsMap, setUserAchievementsMap] = useState(new Map());

    // --- Estados para o Modal de Decorações da Colmeia ---
    const [isDecorationModalOpen, setIsDecorationModalOpen] = useState(false);
    const [selectedDecorationSlot, setSelectedDecorationSlot] = useState(null);

    // --- Estados de Paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // --- Funções de Carregamento de Dados (USANDO useCallback) ---
    // Mova todas as funções useCallback para AQUI, antes dos useEffects
    const fetchAccessories = useCallback(async (page = 1) => {
        try {
            const response = await api.get(`/accessories?page=${page}`);
            setAccessories(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar acessórios:", error);
            setAccessories([]);
            setLastPage(1);
        }
    }, []);

    const fetchDecorations = useCallback(async (page = 1) => {
        try {
            const response = await api.get(`/decorations?page=${page}`);
            setDecorations(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar decorações:", error);
            setDecorations([]);
            setLastPage(1);
        }
    }, []);

    const fetchAchievements = useCallback(async (page = 1) => {
        try {
            const response = await api.get(`/achievements?page=${page}`);
            setAchievements(response.data.data);
            setLastPage(response.data.last_page);

            const userAchMap = new Map();
            response.data.data.forEach(achievement => {
                if (achievement.account_status) {
                    userAchMap.set(parseInt(achievement.id_achievement), achievement.account_status);
                } else {
                    userAchMap.set(parseInt(achievement.id_achievement), {
                        is_completed: false,
                        is_claimed: false,
                        current_progress: 0,
                        claimed_at: null
                    });
                }
            });
            setUserAchievementsMap(userAchMap);

        } catch (error) {
            console.error("Erro ao buscar conquistas:", error);
            setAchievements([]);
            setLastPage(1);
            setUserAchievementsMap(new Map());
        }
    }, []);

    const fetchBee = useCallback(async () => {
        try {
            setLoadingBee(true);
            const response = await api.get(`/bee`);

            setBee(response.data.data.bee_data);
            setSunflowers(response.data.data.sunflowers);

            const ownedAccMap = new Map();
            response.data.data.owned_accessories.forEach(item => {
                ownedAccMap.set(parseInt(item.accessory.id_accessory), {
                    beeAccessoryId: item.id_bee_accessories,
                    isEquipped: item.fk_cosmetic_status === 1
                });
            });
            setOwnedAccessoriesMap(ownedAccMap);

            const ownedDecoMap = new Map();
            if (response.data.data.owned_hive_decorations) {
                response.data.data.owned_hive_decorations.forEach(item => {
                    ownedDecoMap.set(parseInt(item.decoration.id_decoration), {
                        hiveDecorationId: item.id_hive_decoration,
                        isEquipped: item.fk_cosmetic_status === 1,
                        position: item.position_hive_decoration
                    });
                });
            }
            setOwnedDecorationsMap(ownedDecoMap);

            setBee(prevBee => ({
                ...response.data.data.bee_data,
                hive_decorations: response.data.data.owned_hive_decorations || []
            }));

            setEquippedDisplay(response.data.data.equipped_accessories_display || {
                head: '',
                face: '',
                body: ''
            });

        } catch (error) {
            console.error("Erro ao buscar dados da abelha:", error);
        } finally {
            setLoadingBee(false);
        }
    }, []);

    // Callback para quando uma decoração for equipada/desequipada no modal (Depende de fetchBee)
    const handleDecorationAction = useCallback(() => {
        fetchBee();
    }, [fetchBee]);

    


    // --- Funções de Manipulação de UI --- (Podem ficar aqui ou acima, mas não são useCallback)
    const handleModeChange = (event) => {
        const selectedMode = event.target.value;
        setIsShopMode(selectedMode === 'loja');
        setCurrentPage(1);
        if (selectedMode === 'loja') {
            setIsAccessories(true);
        } else {
            setSelectedAchievementFilter('all');
        }
    };

    const toggleSubFilter = () => {
        if (isShopMode) {
            setIsAccessories(prev => !prev);
            setCurrentPage(1);
        }
    };

    const handleAchievementFilterChange = (event) => {
        setSelectedAchievementFilter(event.target.value);
        setCurrentPage(1);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // --- Funções do Modal de Decoração da Colmeia ---
    const openDecorationModal = (slot) => {
        setSelectedDecorationSlot(slot);
        setIsDecorationModalOpen(true);
    };

    const closeDecorationModal = () => {
        setIsDecorationModalOpen(false);
        setSelectedDecorationSlot(null);
    };

    // --- Função para renomear a abelha ---
    const handleRenameBee = async () => {
        if (newBeeNameInput.trim() === '') {
            alert('O nome da abelha não pode ser vazio.');
            return;
        }
        if (newBeeNameInput.length > 50) {
            alert('O nome da abelha não pode ter mais de 50 caracteres.');
            return;
        }
        try {
            const response = await api.post('/bee/rename', { new_name: newBeeNameInput });
            if (response.data.status) {
                alert(response.data.message);
                setBee(prevBee => ({ ...prevBee, name_bee: response.data.new_name }));
                setIsEditingBeeName(false); // Sai do modo de edição
            } else {
                alert(`Erro: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erro ao renomear abelha:", error.response?.data || error.message);
            alert(`Erro ao renomear abelha: ${error.response?.data?.message || 'Erro desconhecido.'}`);
        }
    };

    // --- Funções de Ação (Comprar/Equipar/Resgatar) ---
    const handleBuyAccessory = async (accessoryId) => {
        try {
            const response = await api.post('/bee-accessories/buy', { fk_accessory: accessoryId });
            if (response.data.status) {
                alert(response.data.message);
                fetchBee();
                fetchAccessories(currentPage);
            } else {
                alert(`Erro: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erro ao comprar acessório:", error);
            alert(`Erro ao comprar acessório: ${error.response?.data?.message || 'Erro desconhecido.'}`);
        }
    };

    const handleToggleEquipAccessory = async (beeAccessoryId) => {
        try {
            const response = await api.put(`/bee-accessories/${beeAccessoryId}/toggle-equip`);
            if (response.data.status) {
                alert(response.data.message);
                fetchBee();
            } else {
                alert(`Erro: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erro ao equipar/desequipar acessório:", error);
            alert(`Erro ao equipar/desequipar acessório: ${error.response?.data?.message || 'Erro desconhecido.'}`);
        }
    };

    const handleBuyDecoration = async (decorationId) => {
        try {
            const response = await api.post('/hive-decorations/buy', { fk_decoration: decorationId });
            if (response.data.status) {
                alert(response.data.message);
                fetchBee();
                fetchDecorations(currentPage);
            } else {
                alert(`Erro: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erro ao comprar decoração:", error);
            alert(`Erro ao comprar decoração: ${error.response?.data?.message || 'Erro desconhecido.'}`);
        }
    };

    const handleClaimAchievement = async (achievementId) => {
        try {
            const response = await api.post(`/achievements/${achievementId}/claim`);

            if (response.status === 200 && response.data.status) {
                alert(response.data.message);

                setAchievements(prevAchievements =>
                    prevAchievements.map(ach =>
                        ach.id_achievement === achievementId
                            ? {
                                ...ach,
                                account_status: {
                                    ...ach.account_status,
                                    is_claimed: true,
                                    claimed_at: response.data.claimed_at || new Date().toISOString(),
                                },
                            }
                            : ach
                    )
                );

                setUserAchievementsMap(prevMap => {
                    const newMap = new Map(prevMap);
                    const currentStatus = newMap.get(achievementId);
                    if (currentStatus) {
                        newMap.set(achievementId, {
                            ...currentStatus,
                            is_claimed: true,
                            claimed_at: response.data.claimed_at || new Date().toISOString(),
                        });
                    }
                    return newMap;
                });

                setSunflowers(response.data.new_sunflowers);

                setBee(prevBee => ({
                    ...prevBee,
                    level_bee: response.data.new_bee_level,
                    experience_bee: response.data.new_bee_experience,
                }));

            } else {
                alert(`Erro: ${response.data.message || 'Erro desconhecido ao resgatar a recompensa.'}`);
            }
        } catch (err) {
            console.error('Erro ao resgatar a conquista:', err.response ? err.response.data : err.message);
            alert(err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Erro ao resgatar a recompensa. Tente novamente.');
        }
    };

    // --- Efeitos de Carregamento e Paginação ---
    // Efeito para carregar dados iniciais da abelha
    useEffect(() => {
        fetchBee();
    }, [fetchBee]);

    // Efeito para buscar itens da loja ou conquistas quando o modo/filtro muda
    useEffect(() => {
        setCurrentPage(1);

        if (isShopMode) {
            if (isAccessories) {
                fetchAccessories(1);
            } else {
                fetchDecorations(1);
            }
        } else {
            fetchAchievements(1);
        }
    }, [isShopMode, isAccessories, selectedAchievementFilter, fetchAccessories, fetchDecorations, fetchAchievements]);

    // Efeito para buscar itens da loja ou conquistas quando a página muda
    useEffect(() => {
        if (isShopMode) {
            if (isAccessories) {
                fetchAccessories(currentPage);
            } else {
                fetchDecorations(currentPage);
            }
        } else {
            fetchAchievements(currentPage);
        }
    }, [currentPage, isShopMode, isAccessories, fetchAccessories, fetchDecorations, fetchAchievements]);

    // --- Renderização de Loading ---
    if (loadingBee || !bee || sunflowers === null) {
        return (
            <div className="screen">
                <div className="left_area">
                    {isSidebarOpen && <Sidebar />}
                </div>
                <div className="right_area scroll">
                    <Header toggleSidebar={toggleSidebar} />
                    <main>
                        <div className="hive-card">
                            <h1 className='colmeia_h1 load'>Carregando dados da colmeia...</h1>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // --- Cálculos para a UI ---
    const xpPercent = Math.min(100, (bee.experience_bee % 1000) / 10);

    // --- Funções de Paginação ---
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < lastPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // --- Filtragem de Conquistas ---
    const filteredAchievements = achievements.filter(achievement => {
        const accountStatus = userAchievementsMap.get(parseInt(achievement.id_achievement)) || {
            is_completed: false,
            is_claimed: false,
            current_progress: 0
        };

        const isCompleted = accountStatus.is_completed;
        const isClaimed = accountStatus.is_claimed;

        if (selectedAchievementFilter === 'all') {
            return true;
        } else if (selectedAchievementFilter === 'completed') {
            return isCompleted && !isClaimed;
        } else if (selectedAchievementFilter === 'in-progress') {
            return !isCompleted;
        } else if (selectedAchievementFilter === 'claimed') {
            return isClaimed;
        }
        return true;
    });

    const leftDecoration = bee.hive_decorations?.find(d => d.position_hive_decoration === 'left');
    const rightDecoration = bee.hive_decorations?.find(d => d.position_hive_decoration === 'right');

    return (
        <div className="screen">
            <div className="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div className="right_area scroll">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div className="title_area">
                        <h1 className='colmeia_h1'>Colmeia</h1>
                    </div>

                    <div className="hive-card">
                        <div className="hive_info">
                            <div className="sunflower_info">
                                <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                <p className="acessory_value">{sunflowers}</p>
                            </div>
                            <div className="account_level">
                                <p className='account_level_text'>Nível {bee.level_bee}</p>
                            </div>
                        </div>

                        <div className="hive_main">
                            <div className="left_decoration">
                                {leftDecoration && leftDecoration.decoration ? (
                                    <div className="equipped-decoration-display">
                                        <img
                                            src={`/assets/decorations/${leftDecoration.decoration.img_decoration}`}
                                            alt="Decoração Esquerda"
                                            className="equipped_decoration_image"
                                            onClick={() => openDecorationModal('left')}
                                        />
                                    </div>
                                ) : (
                                    <img src="/assets/add_button.png" alt="Adicionar Decoração" className='add_button_image' onClick={() => openDecorationModal('left')} />
                                )}
                            </div>

                            <div className="bee_area">
                               <div className="name_area">
                                    <input
                                        type="text"
                                        name="bee_name"
                                        id="bee_name"
                                        placeholder='Nome da abelha'
                                        value={isEditingBeeName ? newBeeNameInput : (bee ? bee.name_bee : '')}
                                        onChange={(e) => setNewBeeNameInput(e.target.value)} 
                                        maxLength={50} 
                                    />
                                    <MdModeEdit className='edit_icon' onClick={() => setIsEditingBeeName(!isEditingBeeName)} />
                                    {isEditingBeeName && (
                                       <FaArrowAltCircleRight className='edit_icon' onClick={handleRenameBee}/>

                                    )}
                                </div>

                                <div className="hive_bee">
                                    {equippedDisplay.head && (
                                        <img
                                            src={`/assets/accessories/${equippedDisplay.head}`}
                                            alt="Acessório de Cabeça"
                                            className='equipped_head_accessory accessories'
                                        />
                                    )}

                                    {equippedDisplay.face && (
                                        <img
                                            src={`/assets/accessories/${equippedDisplay.face}`}
                                            alt="Acessório de Rosto"
                                            className='equipped_face_accessory accessories'
                                        />
                                    )}

                                    {equippedDisplay.body && (
                                        <img
                                            src={`/assets/accessories/${equippedDisplay.body}`}
                                            alt="Acessório de Corpo"
                                            className='equipped_body_accessory accessories'
                                        />
                                    )}

                                    <img src="/assets/bee/hive-bee.png" alt="abelha" className='main_bee' />
                                </div>
                            </div>

                            <div className="right_decoration">
                                {rightDecoration && rightDecoration.decoration ? (
                                    <div className="equipped-decoration-display">
                                        <img
                                            src={`/assets/decorations/${rightDecoration.decoration.img_decoration}`}
                                            alt="Decoração Direita"
                                            className="equipped_decoration_image"
                                            onClick={() => openDecorationModal('right')}
                                        />
                                    </div>
                                ) : (
                                    <img src="/assets/add_button.png" alt="Adicionar Decoração" className='add_button_image' onClick={() => openDecorationModal('right')} />

                                )}
                            </div>
                        </div>

                        <div className="hive_xp">
                            <div className="xp_quant">
                                <p className='xp'>XP</p>
                                <p className='quant_progress'>{bee.experience_bee % 1000}/1000</p>
                            </div>

                            <div className="progress_bar_total">
                                <div
                                    className="progress_bar"
                                    style={{ width: `${xpPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="filters">
                        <div className="left_filters">
                            <select name="hive-section" id="hive-section" className='hive-select' onChange={handleModeChange} value={isShopMode ? 'loja' : 'conquistas'}>
                                <option value="loja">Loja</option>
                                <option value="conquistas">Conquistas</option>
                            </select>

                            {isShopMode ? (
                                <div className="switch_filter_hive">
                                    <p className={isAccessories ? 'on_gray' : 'off_gray'} onClick={toggleSubFilter}>Acessórios</p>
                                    <p className={isAccessories ? 'off_gray' : 'on_gray'} onClick={toggleSubFilter}>Decorações</p>
                                </div>
                            ) : (
                                <select name="achievement-filter" id="achievement-filter" className='hive-select' onChange={handleAchievementFilterChange} value={selectedAchievementFilter}>
                                    <option value="all">Todos</option>
                                    <option value="in-progress">Em Andamento</option>
                                    <option value="completed">Concluídas</option>
                                    <option value="claimed">Resgatadas</option>
                                </select>
                            )}
                        </div>

                        <div className="right_filters pagination">
                            <IoIosArrowBack
                                className={`arrow arrow_first ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={prevPage}
                            />
                            {Array.from({ length: lastPage }, (_, i) => i + 1)
                                .filter(pageNum =>
                                    pageNum === 1 ||
                                    pageNum === lastPage ||
                                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                                )
                                .map((pageNum) => (
                                    <div
                                        key={pageNum}
                                        className={`pagination_item ${pageNum === currentPage ? 'selected' : ''}`}
                                        onClick={() => goToPage(pageNum)}
                                    >
                                        <p>{pageNum}</p>
                                    </div>
                                ))
                            }
                            <IoIosArrowForward
                                className={`arrow arrow_last ${currentPage === lastPage ? 'disabled' : ''}`}
                                onClick={nextPage}
                            />
                        </div>
                    </div>

                    <div className="shop_area">
                        {isShopMode ? (
                            isAccessories ? (
                                accessories.map((acc) => (
                                    <AccessoryCard
                                        key={acc.id_accessory}
                                        accessory={acc}
                                        ownedAccessoryData={ownedAccessoriesMap.get(parseInt(acc.id_accessory))}
                                        beeLevel={bee.level_bee}
                                        sunflowers={sunflowers}
                                        onBuyAccessory={handleBuyAccessory}
                                        onToggleEquipAccessory={handleToggleEquipAccessory}
                                    />
                                ))
                            ) : (
                                decorations.map((deco) => (
                                    <DecorationCard
                                        key={deco.id_decoration}
                                        decoration={deco}
                                        ownedDecorationData={ownedDecorationsMap.get(parseInt(deco.id_decoration))}
                                        beeLevel={bee.level_bee}
                                        sunflowers={sunflowers}
                                        onBuyDecoration={handleBuyDecoration}
                                    />
                                ))
                            )
                        ) : (
                            filteredAchievements.map((achievement) => (
                                <AchievementCard
                                    key={achievement.id_achievement}
                                    achievement={achievement}
                                    onClaimAchievement={handleClaimAchievement}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>

            <HiveDecorationModal
                isOpen={isDecorationModalOpen}
                onClose={closeDecorationModal}
                selectedSlot={selectedDecorationSlot}
                onDecorationEquipped={handleDecorationAction}
                onDecorationUnequipped={handleDecorationAction}
            />
        </div>
    );
}

export default Home;