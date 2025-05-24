import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/Hive.css'; // Certifique-se de que este CSS existe
import api from '../api'; // Seu arquivo axios instance
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";

function Home() {
    const [isAccessories, setIsAccessories] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // Este é o único estado para controlar os acessórios possuídos e seu status.
    const [ownedAccessoriesMap, setOwnedAccessoriesMap] = useState(new Map());

    const [bee, setBee] = useState(null);
    const [sunflowers, setSunflowers] = useState(null);

    const [accessories, setAccessories] = useState([]); // Acessórios da loja
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loadingBee, setLoadingBee] = useState(true);

    const toggleSwitch = () => {
        setIsAccessories(!isAccessories);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Função para carregar acessórios da API com paginação
    const fetchAccessories = async (page = 1) => {
        try {
            const response = await api.get(`/accessories?page=${page}`);
            setAccessories(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Erro ao buscar acessórios:", error);
        }
    };

    // Função para carregar dados da abelha, girassóis e acessórios possuídos
    const fetchBee = useCallback(async () => {
        try {
            setLoadingBee(true);
            const response = await api.get(`/bee`);
            
            setBee(response.data.data.bee_data);
            setSunflowers(response.data.data.sunflowers);
            
            const ownedMap = new Map();
            response.data.data.owned_accessories.forEach(item => {
                // *** CORREÇÃO DUPLA APLICADA AQUI: ***
                // 1. Usando item.accessory.id_accessory como a chave (mais robusto)
                // 2. Verificando o status de equipado usando fk_cosmetic_status
                ownedMap.set(parseInt(item.accessory.id_accessory), { 
                    beeAccessoryId: item.id_bee_accessories,
                    // *** AQUI É A MUDANÇA MAIS IMPORTANTE: ***
                    // Assumindo que fk_cosmetic_status === 1 é 'equipped'
                    // Se o seu ID para "equipped" for outro, mude este '1'
                    isEquipped: item.fk_cosmetic_status === 1 
                });
            });
            setOwnedAccessoriesMap(ownedMap);

        } catch (error) {
            console.error("Erro ao buscar dados da abelha:", error);
        } finally {
            setLoadingBee(false);
        }
    }, []);

    // Função para lidar com a compra do acessório
    const handleBuyAccessory = async (accessoryId) => {
        try {
            const response = await api.post('/bee-accessories/buy', { fk_accessory: accessoryId });
            
            if (response.data.status) {
                alert(response.data.message);
                // Recarrega os dados da abelha e os acessórios possuídos após a compra
                fetchBee(); 
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
                // MUITO IMPORTANTE: Recarrega os dados da abelha e dos acessórios possuídos
                // para que o frontend reflita o novo estado dos botões.
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

    // Efeitos para carregar dados ao montar o componente ou mudar a página
    useEffect(() => {
        fetchBee();
    }, [fetchBee]);

    useEffect(() => {
        fetchAccessories(currentPage);
    }, [currentPage]);

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
                        {accessories.map((acc) => {
                            // Convertendo acc.id_accessory para número inteiro para buscar no Map
                            const ownedAccessoryData = ownedAccessoriesMap.get(parseInt(acc.id_accessory));

                            // Verifica se a abelha possui este acessório.
                            const isOwned = !!ownedAccessoryData; 

                            // Verifica se o acessório está equipado (só relevante se for possuído).
                            const isEquipped = isOwned ? ownedAccessoryData.isEquipped : false;

                            // Verifica as condições de compra (nível e girassóis), independentemente de já possuir.
                            const isLevelInsufficient = bee.level_bee < acc.level_accessory;
                            const isPriceInsufficient = parseFloat(sunflowers) < parseFloat(acc.price_accessory);


                            // Variáveis que vão determinar o texto, classe CSS e ação do botão.
                            let buttonText = 'Comprar';
                            let buttonClass = 'buy_button';
                            let buttonDisabled = false;
                            let buttonClickHandler = () => handleBuyAccessory(acc.id_accessory); // Ação padrão é comprar

                            if (isOwned) {
                                // Se a abelha já possui o acessório, o botão vira "Equipar" ou "Desequipar".
                                buttonText = isEquipped ? 'Desequipar' : 'Equipar';
                                buttonClass = isEquipped ? 'unequip_button' : 'equip_button'; // Classes CSS diferentes
                                // A ação agora chama a função de toggle, passando o ID do registro em bee_accessories.
                                buttonClickHandler = () => handleToggleEquipAccessory(ownedAccessoryData.beeAccessoryId);
                            } else if (isLevelInsufficient) {
                                // Se não possui e o nível é insuficiente, desabilita a compra.
                                buttonText = `Nível ${acc.level_accessory} Necessário`;
                                buttonClass = 'buy_button disabled_button';
                                buttonDisabled = true;
                                buttonClickHandler = null; // Não há ação ao clicar
                            } else if (isPriceInsufficient) {
                                // Se não possui e os girassóis são insuficientes, desabilita a compra.
                                buttonText = `Girassóis Insuficientes`;
                                buttonClass = 'buy_button disabled_button';
                                buttonDisabled = true;
                                buttonClickHandler = null; // Não há ação ao clicar
                            } else {
                                // Se não é possuído e o nível/preço são suficientes, então é "Comprar"
                                console.log(`  RESULTADO: DISPONÍVEL PARA COMPRA. Botão: ${buttonText}`); // Log do resultado
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
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;