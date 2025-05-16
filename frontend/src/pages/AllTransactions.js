import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/AllTransactions.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

function AllTransactions() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const Home = async => {
        window.location.href = '/home'
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
                        <div className='at_title_area_left'>
                            <h1>Dados da Conta</h1>
                            <button onClick={Home}>Voltar</button>
                        </div>
                        <input type="month" value={'2025-04'}></input>
                    </div>

                    <div class="all_transactions_area">
                        <div class="all_transaction_title">
                            <p>Todas as Transações</p>
                            <div className='transactions_filter'>
                                <label htmlFor="">Filtro:</label>
                                <select name="" id="">
                                    <option value="">Selecione um tipo</option>
                                </select>
                            </div>
                        </div>

                        <div className="all_transactions">
                            <div class="date_transaction_group">
                                <p class="p_date">10 de maio, 2025</p>

                                <div className="transaction_card">
                                    <div className="tcard_left">
                                        <div className="type_circle_g">
                                            <FaArrowTrendUp />
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">Sistema para Loja de Roupa</div>
                                            <div className="tcontent_category">Freelance</div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className="transaction_value_g">+ R$ 1.500,00</p>
                                    </div>
                                </div>

                                <div className="transaction_card">
                                    <div className="tcard_left">
                                        <div className="type_circle_g">
                                            <FaArrowTrendUp />
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">Sistema para Padaria</div>
                                            <div className="tcontent_category">Freelance</div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className="transaction_value_g">+ R$ 1.500,00</p>
                                    </div>
                                </div>

                            </div>

                            <div class="date_transaction_group">
                                <p class="p_date">05 de maio, 2025</p>

                                <div className="transaction_card">
                                    <div className="tcard_left">
                                        <div className="type_circle_r">
                                            <FaArrowTrendDown />
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">Lanche no SENAI</div>
                                            <div className="tcontent_category">Alimentação</div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className="transaction_value_r">- R$ 7,00</p>
                                    </div>
                                </div>

                                <div className="transaction_card">
                                    <div className="tcard_left">
                                        <div className="type_circle_r">
                                            <FaArrowTrendDown />
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">Lanche no SENAI</div>
                                            <div className="tcontent_category">Alimentação</div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className="transaction_value_r">- R$ 7,00</p>
                                    </div>
                                </div>

                                <div className="transaction_card">
                                    <div className="tcard_left">
                                        <div className="type_circle_r">
                                            <FaArrowTrendDown />
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">Lanche no SENAI</div>
                                            <div className="tcontent_category">Alimentação</div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className="transaction_value_r">- R$ 7,00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default AllTransactions;