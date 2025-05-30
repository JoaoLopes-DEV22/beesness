import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import "../css/pages/AllPendences.css"

function AllPendences() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('2025-05'); // Estado para o mês selecionado
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value); // Atualiza o mês selecionado
    };
    const Pendences = () => {
        window.location.href = '/pendences';
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
                        <div className='at_title_area_left'>
                            <h1>Dados da Conta</h1>
                            <button onClick={Pendences}>Voltar</button>
                        </div>
                        <input
                            type="month"
                            value={selectedMonth}
                            className='input_month_all'
                            onChange={handleMonthChange}
                        />
                    </div>


                </main>
            </div>
        </div>
    );
}

export default AllPendences;