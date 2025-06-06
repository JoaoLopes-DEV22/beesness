import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import AccountData from '../components/AccountData.js';
import PendencesCard from '../components/Pendences.js';
import '../css/pages/Pendences.css';

function Pendences() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mode, setMode] = useState('pendences');
    const [selectedMonth, setSelectedMonth] = useState('2025-06');
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
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
                        <input className='input_month' type="month" value={selectedMonth} onChange={handleMonthChange} />
                    </div>

                    <AccountData selectedMonth={selectedMonth} />

                    <PendencesCard />

                </main>
            </div>
        </div>
    );
}

export default Pendences;