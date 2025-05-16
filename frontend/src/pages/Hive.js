import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/Hive.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";



function Home() {

    const [isAcessorires, setIsAcessorires] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSwitch = () => {
        setIsAcessorires(!isAcessorires);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div class="screen">
            <div class="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div class="right_area scroll">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div class="title_area">
                        <h1 className='colmeia_h1'>Colmeia</h1>

                    </div>

                    

                    <div class="hive-card">

                        <div className="hive_info">

                            <div className="sunflower_info">
                                <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                <p className="acessory_value">50</p>
                            </div>

                            <div className="account_level">
                                <p className='account_level_text'>Nível 1</p>
                            </div>

                        </div>

                       <div className="hive_main">

                        <div className="left_decoration">
                            <img src="/assets/add_button.png" alt="add_button" className='add_button'/>
                        </div>

                        <div className="bee_area">

                            <div className="name_area">
                                <input type="text" name="bee_name" id="bee_name" placeholder='Nome da abelha' value={'Mel'} />
                                <MdModeEdit className='edit_icon'/>

                            </div>

                             <div className="hive_bee">
                            <img src="/assets/bee/hive-bee.png" alt="abelha" className='main_bee'/>
                        </div>

                        </div>

                       

                        <div className="right_decoration">
                            <img src="/assets/add_button.png" alt="add_button" className='add_button'/>

                        </div>

                       </div>

                       <div className="hive_xp">
                            <div className="xp_quant">
                                <p className='xp'>XP</p>
                                <p className='quant_progress'>850/1000</p>
                            </div>

                            <div className="progress_bar_total">
                                <div className="progress_bar"></div>
                            </div>
                       </div>
                    </div>

                    <div className="filters">

                        <div className="left_filters">
                            <select name="hive-section" id="hive-section" className='hive-select'>
                                <option value="loja" selected >Loja</option>
                                <option value="conquistas">Conquistas</option>
                            </select>

                            <div class="switch_filter_hive">
                                {/* <p class='on' id='m'>Mensal</p>
                                    <p class='off'id='t'>Total</p> */}
                                <p className={isAcessorires ? 'on_gray' : 'off_gray'} onClick={toggleSwitch}>Acessórios</p>
                                <p className={isAcessorires ? 'off_gray' : 'on_gray'} onClick={toggleSwitch}>Decorações</p>
                            </div>

                        </div>

                        <div className="right_filters pagination">
                            <IoIosArrowBack className='arrow arrow_first' />
                            <div className="pagination_item selected">
                                <p>1</p>
                            </div>

                            <div className="pagination_item ">
                                <p>2</p>
                            </div>

                            <div className="pagination_item ">
                                <p>3</p>
                            </div>

                            <IoIosArrowForward className='arrow arrow_last' />
                        </div>



                    </div>
                    <div class="shop_area">

                        <div className="shop_card">

                            <div className="title_shop_card">

                                <div className="accessory_title">
                                    <div className="accessory_icon">
                                        🕶️
                                    </div>
                                    <p className="accessory_text">Óculos de Sol</p>
                                </div>

                                <div className="accessory_level">
                                    <p className='level_text'>Nível 1</p>
                                </div>

                            </div>

                            <div className="content_shop_card">

                                <div className="accessory_price">

                                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                    <p className="acessory_value">50</p>

                                </div>

                                <button className="buy_button">
                                    Comprar
                                </button>
                            </div>

                        </div>

                        <div className="shop_card">

                            <div className="title_shop_card">

                                <div className="accessory_title">
                                    <div className="accessory_icon">
                                        🕶️
                                    </div>
                                    <p className="accessory_text">Óculos de Sol</p>
                                </div>

                                <div className="accessory_level">
                                    <p className='level_text'>Nível 1</p>
                                </div>

                            </div>

                            <div className="content_shop_card">

                                <div className="accessory_price">

                                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                    <p className="acessory_value">50</p>

                                </div>

                                <button className="buy_button">
                                    Comprar
                                </button>
                            </div>

                        </div>

                        <div className="shop_card">

                            <div className="title_shop_card">

                                <div className="accessory_title">
                                    <div className="accessory_icon">
                                        🕶️
                                    </div>
                                    <p className="accessory_text">Óculos de Sol</p>
                                </div>

                                <div className="accessory_level">
                                    <p className='level_text'>Nível 1</p>
                                </div>

                            </div>

                            <div className="content_shop_card">

                                <div className="accessory_price">

                                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                    <p className="acessory_value">50</p>

                                </div>

                                <button className="buy_button">
                                    Comprar
                                </button>
                            </div>

                        </div>

                        <div className="shop_card">

                            <div className="title_shop_card">

                                <div className="accessory_title">
                                    <div className="accessory_icon">
                                        🕶️
                                    </div>
                                    <p className="accessory_text">Óculos de Sol</p>
                                </div>

                                <div className="accessory_level">
                                    <p className='level_text'>Nível 1</p>
                                </div>

                            </div>

                            <div className="content_shop_card">

                                <div className="accessory_price">

                                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                    <p className="acessory_value">50</p>

                                </div>

                                <button className="buy_button">
                                    Comprar
                                </button>
                            </div>

                        </div>

                        <div className="shop_card">

                            <div className="title_shop_card">

                                <div className="accessory_title">
                                    <div className="accessory_icon">
                                        🕶️
                                    </div>
                                    <p className="accessory_text">Óculos de Sol</p>
                                </div>

                                <div className="accessory_level">
                                    <p className='level_text'>Nível 1</p>
                                </div>

                            </div>

                            <div className="content_shop_card">

                                <div className="accessory_price">

                                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                    <p className="acessory_value">50</p>

                                </div>

                                <button className="buy_button">
                                    Comprar
                                </button>
                            </div>

                        </div>

                        <div className="shop_card">

                            <div className="title_shop_card">

                                <div className="accessory_title">
                                    <div className="accessory_icon">
                                        🕶️
                                    </div>
                                    <p className="accessory_text">Óculos de Sol</p>
                                </div>

                                <div className="accessory_level">
                                    <p className='level_text'>Nível 1</p>
                                </div>

                            </div>

                            <div className="content_shop_card">

                                <div className="accessory_price">

                                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                                    <p className="acessory_value">50</p>

                                </div>

                                <button className="buy_button">
                                    Comprar
                                </button>
                            </div>

                        </div>



                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;