import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import AccountData from '../components/AccountData.js';
import Transactions from '../components/Transactions.js';
import Categories from '../components/Categories.js';
import '../css/pages/Home.css';

function Home() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mode, setMode] = useState('transactions');
    const [selectedMonth, setSelectedMonth] = useState('2025-06'); // Estado para o mês selecionado
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleModeChange = (event) => {
        setMode(event.target.value);
    };
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value); // Atualiza o mês selecionado
    };


    return (
        <div class="screen">
            {isSidebarOpen &&
                <div class="left_area">
                    <Sidebar />
                </div>
            }
            <div class="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>

                    <div class="title_area">
                        <h1 className='home_h1'>Dados da Conta</h1>
                        <select id='home_mode' onChange={handleModeChange} value={mode}>
                            <option value="transactions">Transações</option>
                            <option value="categories">Categorias</option>
                        </select>
                        <input className='input_month' type="month" value={selectedMonth} onChange={handleMonthChange} />
                    </div>

                    <AccountData selectedMonth={selectedMonth} />

                    {mode === 'transactions' ? <Transactions /> : <Categories />}

                </main>
            </div>
        </div>
    );
}

export default Home;