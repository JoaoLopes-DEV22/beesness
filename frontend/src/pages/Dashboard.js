import { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import AccountData from '../components/AccountData.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { GiHamburger } from 'react-icons/gi';
import { FaBus } from 'react-icons/fa';
import '../css/pages/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mode, setMode] = useState('transactions');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleModeChange = (event) => setMode(event.target.value);

  const [isMonthly, setIsMonthly] = useState(true);

  const toggleSwitch = () => {
    setIsMonthly(!isMonthly);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const receitas = 17506.63;
  const despesas = 10000.0;
  const saldo = 7506.63;

  const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  const vibrantColors = [
    { start: '#FF6384', end: '#FF2D55' },
    { start: '#36A2EB', end: '#0984E3' },
    { start: '#FFCE56', end: '#FFB300' },
    { start: '#4BC0C0', end: '#00A8B5' },
  ];

  const barData = {
    labels: ['Alimentação', 'Lazer', 'Energia', 'Transporte'],
    datasets: [
      {
        label: '',
        data: [1722, 1431, 985, 657],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return vibrantColors[context.dataIndex % vibrantColors.length].start;
          return createGradient(
            ctx,
            chartArea,
            vibrantColors[context.dataIndex % vibrantColors.length].start,
            vibrantColors[context.dataIndex % vibrantColors.length].end
          );
        },
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 10,
        barThickness: 35,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
        labels: {
          font: { size: 16, family: 'Quicksand, sans-serif', weight: '600' },
          color: '#1A3C34',
          padding: 15,
        },
      },
      title: {
        display: true,
        font: { size: 20, family: 'Quicksand, sans-serif', weight: '700' },
        color: '#1A3C34',
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 60, 52, 0.9)',
        titleFont: { size: 14, family: 'Quicksand, sans-serif', weight: 'bold' },
        bodyFont: { size: 12, family: 'Quicksand, sans-serif' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value) => formatCurrency(value),
        font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
        color: '#1A3C34',
        padding: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '',
          font: { size: 14, family: 'Quicksand, sans-serif', weight: '600' },
          color: '#1A3C34',
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: (value) => formatCurrency(value),
          font: { size: 12, family: 'Quicksand, sans-serif' },
          color: '#1A3C34',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Categoria',
          font: { size: 14, family: 'Quicksand, sans-serif', weight: '600' },
          color: '#1A3C34',
        },
        grid: { display: false },
        ticks: { font: { size: 12, family: 'Quicksand, sans-serif' }, color: '#1A3C34' },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
    hover: {
      animationDuration: 400,
      mode: 'nearest',
      intersect: true,
    },
  };

  const pieData = {
    labels: ['Alimentação', 'Lazer', 'Energia', 'Transporte'],
    datasets: [
      {
        data: [28, 21, 25, 26],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 25,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 16, family: 'Quicksand, sans-serif', weight: '600' },
          color: '#1A3C34',
          padding: 20,
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        font: { size: 20, family: 'Quicksand, sans-serif', weight: '700' },
        color: '#1A3C34',
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 60, 52, 0.9)',
        titleFont: { size: 14, family: 'Quicksand, sans-serif', weight: 'bold' },
        bodyFont: { size: 12, family: 'Quicksand, sans-serif' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
      datalabels: {
        formatter: (value) => `${value}%`,
        font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
        color: '#1A3C34',
        padding: 4,
      },
      centerText: {
        text: '100%',
        color: '#1A3C34',
        font: { size: 26, family: 'Quicksand, sans-serif', weight: '700' },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuad',
    },
    hover: {
      animationDuration: 400,
    },
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (chart.config.options.plugins.centerText) {
        const { text, color, font } = chart.config.options.plugins.centerText;
        ctx.save();
        ctx.font = `${font.weight} ${font.size}px ${font.family}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        ctx.fillText(text, centerX, centerY);
        ctx.restore();
      }
    },
  };

  ChartJS.register(centerTextPlugin);

  const maiorGasto = { categoria: 'Alimentação', valor: 1722.6 };
  const menorGasto = { categoria: 'Transporte', valor: 567.75 };
  const pendenciasConcluidas = 5;
  const pendenciasPendentes = 7;

  return (
    <div className="screen-dash">
      <div className={`left_area-dash ${isSidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar />
      </div>
      <div className="right_area-dash">
        <Header toggleSidebar={toggleSidebar} />
        <main className="dashboard-main">
          <div className="title_area">
            <div className="data-account">
              <h1>Dados da Conta</h1>
              <div className="card-data-account">
                <div className="t_card_group-dash">
                  <div className="switch_filter-account">
                    <p className={isMonthly ? 'off-dash' : 'on-dash'} onClick={toggleSwitch}>
                      Mensal
                    </p>
                    <p className={isMonthly ? 'on-dash' : 'off-dash'} onClick={toggleSwitch}>
                      Anual
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <input type="month" value="2025-04" aria-label="Mês de referência" />
          </div>

          <AccountData />

          <div className="charts_grid">
            <div className="chart_container chart_centered">
              <h1 className="title-dash">Gastos (R$) por Categoria</h1>
              <div className="chart_wrapper">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
            <div className="card-dash">
              <h3 className="title-dash">Maior e Menor tipo de Gasto</h3>
              <div className="card-dash-gasto">
                <div className="expense-row positive">
                  <span className="arrow-icon">▲</span>
                  <GiHamburger className="category-icon" />
                  <span className="category-text">{maiorGasto.categoria}</span>
                  <span className="value">{formatCurrency(maiorGasto.valor)}</span>
                </div>
                <div className="expense-row negative">
                  <span className="arrow-icon">▼</span>
                  <FaBus className="category-icon" />
                  <span className="category-text">{menorGasto.categoria}</span>
                  <span className="value">{formatCurrency(menorGasto.valor)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard_cards">
            <div className="chart_container chart_centered">
              <h1 className="title-dash">Gastos (%) por Categoria</h1>
              <div className="chart_wrapper">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
            <div className="card-dash">
              <h1 className="title-dash">Resumo das pendências</h1>
              <div className="pendencies">
                <div className="total">
                  <p className="receitas">
                    <span className="icon"></span>Total de Receitas Pendentes
                    <span className="value-red">R$ 7.050,63</span>
                  </p>
                  <p className="receitas">
                    <span className="icon"></span>Total de Despesas Pendentes
                    <span className="value-green">R$ 10.000,00</span>
                  </p>
                </div>
                <div className="row"></div>
                <div className="total">
                  <p className="positive">
                    <span className="icon">✔</span> Pendências Concluídas: <br />
                    {pendenciasConcluidas}
                  </p>
                  <p className="warning">
                    <span className="icon">⏳</span> Pendências Pendentes: <br />
                    {pendenciasPendentes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;