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
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleModeChange = (event) => {
        setMode(event.target.value);
    };


    return (
        <div class="screen">
            <div class="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div class="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>

                    <div class="title_area">
                        <h1>Dados da Conta</h1>
                        <select id='home_mode' onChange={handleModeChange} value={mode}>
                            <option value="transactions">Transações</option>
                            <option value="categories">Categorias</option>
                        </select>
                        <input type="month" value={'2025-04'}></input>
                    </div>

                    <AccountData />

                    {mode === 'transactions' ? <Transactions /> : <Categories />}

                </main>
            </div>
        </div>
    );
}

export default Home;