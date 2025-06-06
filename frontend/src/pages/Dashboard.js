import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import AccountData from '../components/AccountData.js';
import MonthlyCharts from '../components/MonthlyCharts.js';
import AnnualCharts from '../components/AnnualCharts.js';
import '../css/pages/Dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2025-06');
  const [selectedYear, setSelectedYear] = useState('2025');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleSwitch = () => {
    setIsMonthly(!isMonthly);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    // Extrai o ano do valor selecionado para manter sincronizado
    setSelectedYear(event.target.value.split('-')[0]);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="screen-dash">
      {isSidebarOpen &&
        <div className="left_area-dash">
          <Sidebar />
        </div>
      }
      <div className="right_area">
        <Header toggleSidebar={toggleSidebar} />
        <main className="dashboard-main">
          <div className="title_area">
            <div className="data-account">
              <h1 id='h1_title'>Dashboard</h1>
              <div className="card-data-account">
                <div className="t_card_group-dash">
                  <div className="switch_filter_account">
                    <p className={isMonthly ? 'on-dash' : 'off-dash'} onClick={toggleSwitch}>
                      Mensal
                    </p>
                    <p className={isMonthly ? 'off-dash' : 'on-dash'} onClick={toggleSwitch}>
                      Anual
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mostra input de mês ou ano conforme o modo selecionado */}
            {isMonthly ? (
              <input 
                className='input_month' 
                type="month" 
                value={selectedMonth} 
                onChange={handleMonthChange} 
                aria-label="Mês de referência" 
              />
            ) : (
              <input
                className='input_year'
                type="number"
                min="2000"
                max="2025"
                value={selectedYear}
                onChange={handleYearChange}
                aria-label="Ano de referência"
              />
            )}
          </div>

          {/* Renderização condicional dos componentes */}
          {isMonthly ? (
            <>
              <AccountData selectedMonth={selectedMonth} />
              <MonthlyCharts selectedMonth={selectedMonth} />
            </>
          ) : (
            <AnnualCharts selectedYear={selectedYear} />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;