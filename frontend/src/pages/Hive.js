import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import AchievementCard from '../components/AchievementCard.js';
import AccessoryCard from '../components/AccessoryCard.js'; // Importe o novo componente
import DecorationCard from '../components/DecorationCard.js'; // Importe o novo componente
import '../css/pages/Hive.css';
import api from '../api';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";

function Home() {
    // ... (Seus estados e funções de alteração de modo/filtro permanecem inalterados)
    const [isShopMode, setIsShopMode] = useState(true);
    const [isAccessories, setIsAccessories] = useState(true);
    const [selectedAchievementFilter, setSelectedAchievementFilter] = useState('all');

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [bee, setBee] = useState(null);
    const [sunflowers, setSunflowers] = useState(null);
    const [loadingBee, setLoadingBee] = useState(true);

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

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

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


    // --- Funções de Carregamento de Dados (permanecem inalteradas) ---
    const fetchAccessories = async (page = 1) => {
        try {
            const response = await api.get(`/accessories?page=${page}`);
            setAccessories(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar acessórios:", error);
            setAccessories([]);
            setLastPage(1);
        }
    };

    const fetchDecorations = async (page = 1) => {
        try {
            const response = await api.get(`/decorations?page=${page}`);
            setDecorations(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar decorações:", error);
            setDecorations([]);
            setLastPage(1);
        }
    };

    const fetchAchievements = async (page = 1) => {
        try {
            const response = await api.get(`/achievements?page=${page}`);
            setAchievements(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar conquistas:", error);
            setAchievements([]);
            setLastPage(1);
        }
    };

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
            if (response.data.data.owned_decorations) {
                response.data.data.owned_decorations.forEach(item => {
                    ownedDecoMap.set(parseInt(item.decoration.id_decoration), {
                        beeDecorationId: item.id_bee_decoration,
                        isEquipped: item.fk_cosmetic_status === 1
                    });
                });
            }
            setOwnedDecorationsMap(ownedDecoMap);

            const userAchMap = new Map();
            if (response.data.data.user_achievements) {
                response.data.data.user_achievements.forEach(item => {
                    userAchMap.set(parseInt(item.achievement.id_achievement), item);
                });
            }
            setUserAchievementsMap(userAchMap);

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


    // --- Funções de Ação (Comprar/Equipar/Resgatar - permanecem inalteradas, mas as chamadas serão movidas para os componentes) ---
    // Elas precisam ser passadas como props para os componentes de card.
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
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Erro ao comprar acessório: ${error.response.data.message}`);
            } else {
                alert('Erro desconhecido ao tentar comprar acessório.');
            }
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
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Erro ao equipar/desequipar acessório: ${error.response.data.message}`);
            } else {
                alert('Erro desconhecido ao tentar equipar/desequipar acessório.');
            }
        }
    };

     const handleBuyDecoration = async (decorationId) => {
        try {
            // MUDANÇA AQUI: Chamada para o novo endpoint no HiveDecorationController
            const response = await api.post('/hive-decorations/buy', { fk_decoration: decorationId });

            if (response.data.status) {
                alert(response.data.message);
                fetchBee(); // Recarrega os dados da abelha e posses
                fetchDecorations(currentPage); // Recarrega a lista de decorações da página atual
            } else {
                alert(`Erro: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erro ao comprar decoração:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Erro ao comprar decoração: ${error.response.data.message}`);
            } else {
                alert('Erro desconhecido ao tentar comprar decoração.');
            }
        }
    };

    const handleClaimAchievement = async (achievementId) => {
        alert("Funcionalidade de resgatar recompensa (ainda não implementada)");
        // Sua lógica de API POST aqui
    };

    // ... (UseEffects, loading state, xpPercent, paginação - tudo permanece igual)
    useEffect(() => {
        fetchBee();
    }, [fetchBee]);

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
    }, [isShopMode, isAccessories, selectedAchievementFilter]);

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
    }, [currentPage]);


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

    const xpPercent = Math.min(100, (bee.experience_bee % 1000) / 10);

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

    const filteredAchievements = achievements.filter(achievement => {
        const userAchievement = userAchievementsMap.get(parseInt(achievement.id_achievement));
        const isCompleted = userAchievement ? userAchievement.is_completed : false;
        const isClaimed = userAchievement ? userAchievement.is_claimed : false;

        if (selectedAchievementFilter === 'all') {
            return true;
        } else if (selectedAchievementFilter === 'completed') {
            return isCompleted && !isClaimed;
        } else if (selectedAchievementFilter === 'in-progress') {
            return !isCompleted;
        }
        return true;
    });


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
                                <img src="/assets/add_button.png" alt="add_button" className='add_button' />
                            </div>

                            <div className="bee_area">
                                <div className="name_area">
                                    <input
                                        type="text"
                                        name="bee_name"
                                        id="bee_name"
                                        placeholder='Nome da abelha'
                                        value={bee.name_bee}
                                        readOnly
                                    />
                                    <MdModeEdit className='edit_icon' />
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
                                <img src="/assets/add_button.png" alt="add_button" className='add_button' />
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
                                </select>
                            )}
                        </div>

                        <div className="right_filters pagination">
                            <IoIosArrowBack
                                className={`arrow arrow_first ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={prevPage}
                            />
                            {[...Array(lastPage)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <div
                                        key={pageNum}
                                        className={`pagination_item ${pageNum === currentPage ? 'selected' : ''}`}
                                        onClick={() => goToPage(pageNum)}
                                    >
                                        <p>{pageNum}</p>
                                    </div>
                                );
                            })}
                            <IoIosArrowForward
                                className={`arrow arrow_last ${currentPage === lastPage ? 'disabled' : ''}`}
                                onClick={nextPage}
                            />
                        </div>
                    </div>

                    <div className="shop_area">
                        {isShopMode ? (
                            isAccessories ? (
                                // --- Renderização de Acessórios usando AccessoryCard ---
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
                                // --- Renderização de Decorações usando DecorationCard ---
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
                            // --- Renderização de Conquistas usando AchievementCard ---
                            filteredAchievements.map((achievement) => (
                                <AchievementCard
                                    key={achievement.id_achievement}
                                    achievement={achievement}
                                    userAchievement={userAchievementsMap.get(parseInt(achievement.id_achievement))}
                                    onClaimAchievement={handleClaimAchievement}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;