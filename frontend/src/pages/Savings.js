import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import SavingsCard from '../components/SavingsCard.js';
import Goals from '../components/Goals.js';
import '../css/pages/Savings.css';

function Savings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="screen-savings">
            {isSidebarOpen &&
                <div className="left_area_savings">
                    <Sidebar />
                </div>
            }
            <div className="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main className="savings-main">

                    <div className="title_area">
                        <h1 id='h1_title'>Poupança</h1>
                    </div>

                    <SavingsCard />

                    <Goals />

                </main>
            </div>
        </div>
    );
}

export default Savings;