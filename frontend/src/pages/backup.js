import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/Hive.css'; // Certifique-se de que este CSS existe
import api from '../api'; // Seu arquivo axios instance
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";

function Home() {
    // Controla qual seção está ativa: true para Acessórios, false para Decorações
    const [isAccessories, setIsAccessories] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Estados para dados da abelha e girassóis
    const [bee, setBee] = useState(null);
    const [sunflowers, setSunflowers] = useState(null);
    const [loadingBee, setLoadingBee] = useState(true);

    // *** ACESSÓRIOS ***
    const [accessories, setAccessories] = useState([]); // Acessórios da loja
    const [ownedAccessoriesMap, setOwnedAccessoriesMap] = useState(new Map()); // Mapeia acessórios possuídos e seu status (equipado/não equipado)
    const [equippedDisplay, setEquippedDisplay] = useState({ // Acessórios equipados para exibição visual da abelha
        head: '',
        face: '',
        body: ''
    });

    // *** DECORAÇÕES ***
    const [decorations, setDecorations] = useState([]); // Decorações da loja
    const [ownedDecorationsMap, setOwnedDecorationsMap] = useState(new Map()); // Mapeia decorações possuídas

    // Paginação para ambos (o estado currentPage e lastPage será compartilhado e resetado ao trocar a categoria)
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Função para alternar entre Acessórios e Decorações
    const toggleSwitch = () => {
        setIsAccessories(prev => !prev);
        setCurrentPage(1); // Sempre resetar para a primeira página ao trocar a categoria
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // --- Funções de Carregamento de Dados ---

    // Função para carregar acessórios da API com paginação
    const fetchAccessories = async (page = 1) => {
        try {
            const response = await api.get(`/accessories?page=${page}`);
            setAccessories(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar acessórios:", error);
            setAccessories([]); // Garante que a lista fique vazia em caso de erro
            setLastPage(1);
        }
    };

    // Função para carregar decorações da API com paginação
    const fetchDecorations = async (page = 1) => {
        try {
            const response = await api.get(`/decorations?page=${page}`);
            setDecorations(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar decorações:", error);
            setDecorations([]); // Garante que a lista fique vazia em caso de erro
            setLastPage(1);
        }
    };

    // Função para carregar dados da abelha, girassóis, acessórios e decorações possuídos
    const fetchBee = useCallback(async () => {
        try {
            setLoadingBee(true);
            const response = await api.get(`/bee`);

            setBee(response.data.data.bee_data);
            setSunflowers(response.data.data.sunflowers);

            // Acessórios possuídos
            const ownedAccMap = new Map();
            response.data.data.owned_accessories.forEach(item => {
                ownedAccMap.set(parseInt(item.accessory.id_accessory), {
                    beeAccessoryId: item.id_bee_accessories,
                    isEquipped: item.fk_cosmetic_status === 1
                });
            });
            setOwnedAccessoriesMap(ownedAccMap);

            // Decorações possuídas (NOVO)
            const ownedDecoMap = new Map();
            // AQUI: Assumindo que a API para /bee também retorna 'owned_decorations'
            // Se não retornar, você precisará de um endpoint separado para buscar isso
            if (response.data.data.owned_decorations) {
                response.data.data.owned_decorations.forEach(item => {
                    ownedDecoMap.set(parseInt(item.decoration.id_decoration), {
                        beeDecorationId: item.id_bee_decoration,
                        isEquipped: item.fk_cosmetic_status === 1 // Se decorações também têm status de equipar/desequipar
                    });
                });
            }
            setOwnedDecorationsMap(ownedDecoMap);

            // Definindo os acessórios equipados para exibição
            // Garante que equipped_accessories_display seja um objeto, mesmo que venha nulo/indefinido
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
    }, []); // Dependências: array vazio porque fetchBee só é criado uma vez.

    // --- Funções de Ação (Comprar/Equipar) ---

    // Função para lidar com a compra do acessório
    const handleBuyAccessory = async (accessoryId) => {
        try {
            const response = await api.post('/bee-accessories/buy', { fk_accessory: accessoryId });

            if (response.data.status) {
                alert(response.data.message);
                fetchBee(); // Recarrega os dados da abelha e acessórios
                fetchAccessories(currentPage); // Recarrega a lista de acessórios da página atual
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

    // Função para lidar com o equipar/desequipar do acessório
    const handleToggleEquipAccessory = async (beeAccessoryId) => {
        try {
            const response = await api.put(`/bee-accessories/${beeAccessoryId}/toggle-equip`);

            if (response.data.status) {
                alert(response.data.message);
                fetchBee(); // Recarrega os dados da abelha e acessórios
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

    // Função para lidar com a compra da decoração
    const handleBuyDecoration = async (decorationId) => {
        try {
            // Ajuste o endpoint da API conforme o seu backend para compra de decorações
            const response = await api.post('/bee-decorations/buy', { fk_decoration: decorationId });

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

    // Função para lidar com o equipar/desequipar da decoração (se aplicável)
    // Adapte ou remova se as decorações não têm um status de equipar/desequipar
    const handleToggleEquipDecoration = async (beeDecorationId) => {
        try {
            // Este endpoint depende se você tem um sistema de "equipar" decorações ou apenas "possuir"
            const response = await api.put(`/bee-decorations/${beeDecorationId}/toggle-equip`);

            if (response.data.status) {
                alert(response.data.message);
                fetchBee(); // Recarrega os dados da abelha e posses
            } else {
                alert(`Erro: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erro ao equipar/desequipar decoração:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Erro ao equipar/desequipar decoração: ${error.response.data.message}`);
            } else {
                alert('Erro desconhecido ao tentar equipar/desequipar decoração.');
            }
        }
    };

    // --- Efeitos para Carregar Dados ---

    // Efeito para carregar dados da abelha ao montar o componente
    useEffect(() => {
        fetchBee();
    }, [fetchBee]); // Apenas recarrega quando fetchBee muda (que é pouco provável)

    // Efeito para carregar Acessórios OU Decorações quando a página ou o tipo de item muda
    useEffect(() => {
        // Zera a paginação ao trocar de categoria, garantindo que o fetch comece na página 1.
        // Já fazemos isso no toggleSwitch, então aqui é apenas para o carregamento inicial.
        setCurrentPage(1);

        if (isAccessories) {
            fetchAccessories(1); // Começa na página 1 ao mudar para Acessórios
        } else {
            fetchDecorations(1); // Começa na página 1 ao mudar para Decorações
        }
    }, [isAccessories]); // Este efeito agora depende apenas de isAccessories

    // Novo useEffect para lidar apenas com a mudança de página dentro da categoria atual
    useEffect(() => {
        if (isAccessories) {
            fetchAccessories(currentPage);
        } else {
            fetchDecorations(currentPage);
        }
    }, [currentPage]); // Este efeito agora depende apenas de currentPage

    // Tela de carregamento
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

    // Cálculo da porcentagem de XP
    const xpPercent = Math.min(100, (bee.experience_bee % 1000) / 10);

    // Funções de paginação
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

    // --- Renderização Principal ---
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
                                    {/* Estes componentes devem SEMPRE ser renderizados,
                                        pois representam o que está equipado na abelha,
                                        independentemente da loja estar em Acessórios ou Decorações. */}
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
                            <select name="hive-section" id="hive-section" className='hive-select'>
                                <option value="loja" selected >Loja</option>
                                <option value="conquistas">Conquistas</option>
                            </select>

                            <div className="switch_filter_hive">
                                <p className={isAccessories ? 'on_gray' : 'off_gray'} onClick={toggleSwitch}>Acessórios</p>
                                <p className={isAccessories ? 'off_gray' : 'on_gray'} onClick={toggleSwitch}>Decorações</p>
                            </div>
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
                        {isAccessories ? (
                            // --- Renderização de Acessórios ---
                            accessories.map((acc) => {
                                const ownedAccessoryData = ownedAccessoriesMap.get(parseInt(acc.id_accessory));
                                const isOwned = !!ownedAccessoryData;
                                const isEquipped = isOwned ? ownedAccessoryData.isEquipped : false;
                                const isLevelInsufficient = bee.level_bee < acc.level_accessory;
                                const isPriceInsufficient = parseFloat(sunflowers) < parseFloat(acc.price_accessory);

                                let buttonText;
                                let buttonClass;
                                let buttonDisabled = false;
                                let buttonClickHandler;

                                if (isOwned) {
                                    buttonText = isEquipped ? 'Desequipar' : 'Equipar';
                                    buttonClass = isEquipped ? 'unequip_button' : 'equip_button';
                                    buttonClickHandler = () => handleToggleEquipAccessory(ownedAccessoryData.beeAccessoryId);
                                } else if (isLevelInsufficient) {
                                    buttonText = `Nível ${acc.level_accessory} Necessário`;
                                    buttonClass = 'buy_button disabled_button';
                                    buttonDisabled = true;
                                    buttonClickHandler = null;
                                } else if (isPriceInsufficient) {
                                    buttonText = `Girassóis Insuficientes`;
                                    buttonClass = 'buy_button disabled_button';
                                    buttonDisabled = true;
                                    buttonClickHandler = null;
                                } else {
                                    buttonText = `Comprar`;
                                    buttonClass = 'buy_button';
                                    buttonDisabled = false;
                                    buttonClickHandler = () => handleBuyAccessory(acc.id_accessory);
                                }

                                return (
                                    <div key={acc.id_accessory} className="shop_card">
                                        <div className="title_shop_card">
                                            <div className="accessory_title">
                                                <div className="accessory_icon">
                                                    {acc.icon_accessory}
                                                </div>
                                                <p className="accessory_text">{acc.name_accessory}</p>
                                            </div>
                                            <div className="accessory_level">
                                                <p className='level_text'>Nível {acc.level_accessory}</p>
                                            </div>
                                        </div>

                                        <div className="content_shop_card">
                                            <div className="accessory_price">
                                                <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                                <p className="acessory_value">{parseInt(acc.price_accessory)}</p>
                                            </div>
                                            <button
                                                className={buttonClass}
                                                disabled={buttonDisabled}
                                                onClick={buttonClickHandler}
                                            >
                                                {buttonText}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // --- Renderização de Decorações ---
                            decorations.map((deco) => {
                                const ownedDecorationData = ownedDecorationsMap.get(parseInt(deco.id_decoration));
                                const isOwned = !!ownedDecorationData;
                                const isEquipped = isOwned ? ownedDecorationData.isEquipped : false; // Manter se decorações têm status de equipar
                                const isLevelInsufficient = bee.level_bee < deco.level_decoration;
                                const isPriceInsufficient = parseFloat(sunflowers) < parseFloat(deco.price_decoration);

                                let buttonText;
                                let buttonClass;
                                let buttonDisabled = false;
                                let buttonClickHandler;

                                if (isOwned) {
                                    // Se decorações também têm status de "equipar", use esta lógica:
                                    // buttonText = isEquipped ? 'Remover' : 'Colocar';
                                    // buttonClass = isEquipped ? 'unequip_button' : 'equip_button';
                                    // buttonClickHandler = () => handleToggleEquipDecoration(ownedDecorationData.beeDecorationId);
                                    // Caso contrário, use esta:
                                    buttonText = 'Adquirido';
                                    buttonClass = 'acquired_button disabled_button'; // Geralmente desabilitado se já adquirido e não tem "equipar"
                                    buttonDisabled = true;
                                    buttonClickHandler = null;
                                } else if (isLevelInsufficient) {
                                    buttonText = `Nível ${deco.level_decoration} Necessário`;
                                    buttonClass = 'buy_button disabled_button';
                                    buttonDisabled = true;
                                    buttonClickHandler = null;
                                } else if (isPriceInsufficient) {
                                    buttonText = `Girassóis Insuficientes`;
                                    buttonClass = 'buy_button disabled_button';
                                    buttonDisabled = true;
                                    buttonClickHandler = null;
                                } else {
                                    buttonText = `Comprar`;
                                    buttonClass = 'buy_button';
                                    buttonDisabled = false;
                                    buttonClickHandler = () => handleBuyDecoration(deco.id_decoration);
                                }

                                return (
                                    <div key={deco.id_decoration} className="shop_card">
                                        <div className="title_shop_card">
                                            <div className="accessory_title">
                                                <div className="accessory_icon">
                                                    {deco.icon_decoration}
                                                </div>
                                                <p className="accessory_text">{deco.name_decoration}</p>
                                            </div>
                                            <div className="accessory_level">
                                                <p className='level_text'>Nível {deco.level_decoration}</p>
                                            </div>
                                        </div>

                                        <div className="content_shop_card">
                                            <div className="accessory_price">
                                                <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                                <p className="acessory_value">{parseInt(deco.price_decoration)}</p>
                                            </div>
                                            <button
                                                className={buttonClass}
                                                disabled={buttonDisabled}
                                                onClick={buttonClickHandler}
                                            >
                                                {buttonText}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;