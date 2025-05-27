import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import api from '../api'; // Certifique-se de que a API está configurada corretamente
import { TbTargetArrow } from "react-icons/tb";
import { FaArrowTrendUp } from "react-icons/fa6";
import '../css/components/AnnualCharts.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function AnnualCharts({ selectedYear }) {
    const [chartData, setChartData] = useState({
        barData: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: [],
                borderColor: '#FFFFFF',
                borderWidth: 2,
                borderRadius: 10,
                barThickness: 35,
            }]
        },
        pieData: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderColor: '#FFFFFF',
                borderWidth: 2,
                hoverOffset: 25,
            }]
        }
    });

    const [monthlyEvolutionData, setMonthlyEvolutionData] = useState({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: []
    });

    const [maiorGasto, setMaiorGasto] = useState({ categoria: '', valor: 0 });
    const [menorGasto, setMenorGasto] = useState({ categoria: '', valor: 0 });

    const vibrantColors = [
        { start: '#FF6384', end: '#FF2D55' },
        { start: '#36A2EB', end: '#0984E3' },
        { start: '#FFCE56', end: '#FFB300' },
        { start: '#4BC0C0', end: '#00A8B5' },
        { start: '#9966FF', end: '#7B4CFF' },
        { start: '#FF9F40', end: '#FF8300' },
    ];

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                align: 'center',
                labels: {
                    font: { size: 13, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                    padding: 15,
                    boxWidth: 15,
                    usePointStyle: true,
                },
            },
            title: { display: false },
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
            datalabels: { color: 'transparent' },
        },
        animation: { duration: 1500, easing: 'easeInOutQuad' },
        hover: { animationDuration: 400 },
        layout: { padding: { top: 25, left: 10, right: 10, bottom: 10 } }
    };

    const monthlyEvolutionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 14, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                    padding: 5,
                },
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
            datalabels: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: {
                    callback: (value) => formatCurrency(value),
                    font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' }, color: '#1A3C34' },
            },
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(26, 60, 52, 0.9)',
                titleFont: { size: 14, family: 'Quicksand, sans-serif', weight: 'bold' },
                bodyFont: { size: 12, family: 'Quicksand, sans-serif' },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => `Valor: ${formatCurrency(context.raw)}`,
                },
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (value) => formatCurrency(value),
                font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                color: '#1A3C34',
                padding: 4,
                offset: 5,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: {
                    callback: (value) => formatCurrency(value),
                    font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                },
                suggestedMax: chartData.barData.datasets[0]?.data?.length > 0
                    ? Math.max(...chartData.barData.datasets[0].data) * 1.15
                    : 100,
                title: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                    callback: function (value) {
                        const label = this.getLabelForValue(value);
                        return label.length > 15 ? label.substring(0, 15) + '...' : label;
                    }
                },
            },
        },
        animation: { duration: 1500, easing: 'easeOutBounce' },
        hover: { animationDuration: 400, mode: 'nearest', intersect: true },
        layout: { padding: { top: 25 } }
    };

    useEffect(() => {
        const fetchAnnualChartsData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.id) return;

                // Fetch transactions grouped by category for the annual charts
                const response = await api.get('/transactions/annual/charts', {
                    params: { user_id: user.id, year: selectedYear }
                });
                const transactions = response.data.transactions || [];

                processChartData(transactions);

                // Fetch monthly evolution data
                const evolutionResponse = await api.get('/transactions/monthly/evolution', {
                    params: { user_id: user.id, year: selectedYear }
                });
                if (evolutionResponse.data && evolutionResponse.data.labels) {
                    setMonthlyEvolutionData(evolutionResponse.data);
                } else {
                    setMonthlyEvolutionData({
                        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                        datasets: []
                    });
                }
            } catch (err) {
                console.error('Erro ao carregar dados anuais:', err);
            }
        };

        if (selectedYear) {
            fetchAnnualChartsData();
        }
    }, [selectedYear]);

    const processChartData = (transactions) => {
        if (!transactions.length) {
            setChartData({
                barData: {
                    labels: [],
                    datasets: [{
                        label: '',
                        data: [],
                        backgroundColor: [],
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                        borderRadius: 10,
                        barThickness: 35,
                    }]
                },
                pieData: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [],
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                        hoverOffset: 25,
                    }]
                }
            });
            setMaiorGasto({ categoria: '', valor: 0 });
            setMenorGasto({ categoria: '', valor: 0 });
            return;
        }

        const barLabels = transactions.map(t => t.category.title_category);
        const barValues = transactions.map(t => t.total);

        const sorted = [...transactions].sort((a, b) => b.total - a.total);
        setMaiorGasto({
            categoria: sorted[0].category.title_category,
            valor: sorted[0].total
        });
        setMenorGasto({
            categoria: sorted[sorted.length - 1].category.title_category,
            valor: sorted[sorted.length - 1].total
        });

        const barData = {
            labels: barLabels,
            datasets: [
                {
                    label: '',
                    data: barValues,
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

        const totalOverall = transactions.reduce((sum, t) => sum + t.total, 0);

        const sortedExpensesForPie = [...transactions].sort((a, b) => b.total - a.total);

        const topCategoriesCount = 4;
        let pieLabels = [];
        let pieValues = [];
        let otherTotal = 0;

        for (let i = 0; i < sortedExpensesForPie.length; i++) {
            if (i < topCategoriesCount) {
                pieLabels.push(sortedExpensesForPie[i].category.title_category);
                pieValues.push(sortedExpensesForPie[i].total);
            } else {
                otherTotal += sortedExpensesForPie[i].total;
            }
        }

        if (sortedExpensesForPie.length > topCategoriesCount) {
            pieLabels.push('outras');
            pieValues.push(otherTotal);
        }

        const percentages = pieValues.map(value => parseFloat(((value / totalOverall) * 100).toFixed(1)));

        const pieData = {
            labels: pieLabels,
            datasets: [
                {
                    data: percentages,
                    backgroundColor: pieLabels.map((_, i) => vibrantColors[i % vibrantColors.length].start),
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                    hoverOffset: 25,
                },
            ],
        };

        setChartData({ barData, pieData });
    };

    // Static savings chart data
    const savingsData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
            {
                label: 'Poupança',
                data: [1000, 1200, 1350, 1500, 1750, 1900, 2200, 2400, 2650, 2800, 3000, 3200],
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                tension: 0.1,
                fill: false,
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#2196F3',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
            },
        ],
    };

    const savingsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
            datalabels: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: {
                    callback: (value) => formatCurrency(value),
                    font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' }, color: '#1A3C34' },
            },
        },
        animation: { duration: 1500, easing: 'easeInOutQuad' },
    };

    // Static cards data
    const maiorGastoStatic = { categoria: 'Alimentação', valor: 0 };
    const menorGastoStatic = { categoria: 'Educação', valor: 0 };
    const pendenciasConcluidas = 12;
    const pendenciasPendentes = 6;

    return (
        <div className='annual_charts_area'>
            <div className="dashboard_cards">
                <div className="chart_container chart_centered">
                    <h1 className="title-dash">Gastos (%) por Categoria</h1>
                    <div className="chart_wrapper">
                        <Pie data={chartData.pieData} options={pieOptions} />
                    </div>
                </div>
                <div className="card-dash">
                    <h1 className="title-dash">Evolução de receitas e despesas (R$) por mês</h1>
                    <div className="chart_wrapper">
                        <Line data={monthlyEvolutionData} options={monthlyEvolutionOptions} />
                    </div>
                </div>
            </div>

            <div className="charts_grid">
                <div className="chart_container chart_centered">
                    <h1 className="title-dash">Gastos (R$) por Categoria</h1>
                    <div className="chart_wrapper">
                        <Bar data={chartData.barData} options={barOptions} />
                    </div>
                </div>
                <div className="card-dash">
                    <h3 className="title-dash">Maior e Menor tipo de Gasto</h3>
                    <div className="card-dash-gasto">
                        <div className="expense-row positive">
                            <span className="arrow-icon">▲</span>
                            <span className="category-text">{maiorGasto.categoria || maiorGastoStatic.categoria}</span>
                            <span className="value">{formatCurrency(maiorGasto.valor || maiorGastoStatic.valor)}</span>
                        </div>
                        <div className="expense-row negative">
                            <span className="arrow-icon">▼</span>
                            <span className="category-text">{menorGasto.categoria || menorGastoStatic.categoria}</span>
                            <span className="value">{formatCurrency(menorGasto.valor || menorGastoStatic.valor)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard_cards">
                <div className="card-dash">
                    <h1 className="title-dash">Poupança e metas</h1>
                    <div className="saving_goals">
                        <div className="total">
                            <p className="positive-p">
                                <div className="icon">
                                    <span className='type_circle_g'><FaArrowTrendUp /></span>
                                    <p>Maior valor da poupança</p>
                                </div>
                                <span className="value-receita">Dezembro - R$ 3.200,00</span>
                            </p>
                            <p className="warning">
                                <div className="icon">
                                    <span className='circle_p'><TbTargetArrow /></span>
                                    <p>Metas alcançadas</p>
                                </div>
                                <span className="value-pendencia">27 metas</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="chart_container chart_centered">
                    <h1 className="title-dash">Valor da poupança ao final de cada mês</h1>
                    <div className="chart_wrapper">
                        <Line data={savingsData} options={savingsOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnualCharts;


