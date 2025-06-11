import { useState, useEffect } from 'react';
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
import { MdAccessTime } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import api from '../api';
import '../css/components/MonthlyCharts.css';

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

function MonthlyCharts({ selectedMonth }) {
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
    
    const [maiorGasto, setMaiorGasto] = useState({ categoria: '', valor: 0 });
    const [menorGasto, setMenorGasto] = useState({ categoria: '', valor: 0 });
    const [pendenciasConcluidas, setPendenciasConcluidas] = useState(0);
    const [pendenciasPendentes, setPendenciasPendentes] = useState(0);
    const [totalReceitasPendentes, setTotalReceitasPendentes] = useState(0);
    const [totalDespesasPendentes, setTotalDespesasPendentes] = useState(0);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

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
        { start: '#9966FF', end: '#7B4CFF' },
        { start: '#FF9F40', end: '#FF8300' },
    ];

    const processChartData = (data) => {
        const expenseTransactions = data.transactions;

        if (!expenseTransactions || expenseTransactions.length === 0) {
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

        const barLabels = expenseTransactions.map(t => t.category.title_category);
        const barValues = expenseTransactions.map(t => t.total);

        const sorted = [...expenseTransactions].sort((a, b) => b.total - a.total);
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

        const totalOverall = expenseTransactions.reduce((sum, t) => sum + t.total, 0);

        const sortedExpensesForPie = [...expenseTransactions].sort((a, b) => b.total - a.total);

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

    const processPendingsData = (data) => {
        if (!data.pendings) return;

        const concluidas = data.pendings.filter(p => p.fk_condition === 2).length;
        const pendentes = data.pendings.filter(p => p.fk_condition === 1).length;

        setPendenciasConcluidas(concluidas);
        setPendenciasPendentes(pendentes);

        setTotalReceitasPendentes(data.total_receitas_pendentes || 0);
        setTotalDespesasPendentes(data.total_despesas_pendentes || 0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.id) return;

                const [transactionsResponse, pendingsResponse] = await Promise.all([
                    api.get('/transactions/monthly/charts', {
                        params: { user_id: user.id, month: selectedMonth }
                    }),
                    api.get('/pendings/monthly', {
                        params: { user_id: user.id, month: selectedMonth }
                    })
                ]);

                processChartData(transactionsResponse.data);
                processPendingsData(pendingsResponse.data);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
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
                title: {
                    display: false,
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: {
                    callback: (value) => formatCurrency(value),
                    font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                },
                suggestedMax: chartData.barData.datasets[0].data.length > 0 
                    ? Math.max(...chartData.barData.datasets[0].data) * 1.15 
                    : 100,
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, family: 'Quicksand, sans-serif', weight: '600' },
                    color: '#1A3C34',
                    callback: function(value) {
                        return this.getLabelForValue(value).length > 15
                            ? this.getLabelForValue(value).substring(0, 15) + '...'
                            : this.getLabelForValue(value);
                    }
                },
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
        layout: {
            padding: {
                top: 25
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                align: 'center',
                labels: {
                    font: {
                        size: 13,
                        family: 'Quicksand, sans-serif',
                        weight: '600',
                    },
                    color: '#1A3C34',
                    padding: 15,
                    boxWidth: 15,
                    usePointStyle: true,
                },
            },
            title: {
                display: false,
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
                color: 'transparent',
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuad',
        },
        hover: {
            animationDuration: 400,
        },
        layout: {
            padding: {
                top: 25,
                left: 10,
                right: 10,
                bottom: 10
            }
        }
    };

    return (
        <div className='monthly_charts_area'>
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
                            <span className="category-text">{maiorGasto.categoria || 'N/A'}</span>
                            <span className="value">{maiorGasto.valor ? formatCurrency(maiorGasto.valor) : 'R$ 0,00'}</span>
                        </div>
                        <div className="expense-row negative">
                            <span className="arrow-icon">▼</span>
                            <span className="category-text">{menorGasto.categoria || 'N/A'}</span>
                            <span className="value">{menorGasto.valor ? formatCurrency(menorGasto.valor) : 'R$ 0,00'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard_cards">
                <div className="chart_container chart_centered">
                    <h1 className="title-dash">Gastos (%) por Categoria</h1>
                    <div className="chart_wrapper">
                        <Pie data={chartData.pieData} options={pieOptions} />
                    </div>
                </div>
                <div className="card-dash-pendencies">
                    <h1 className="title-dash">Resumo das pendências</h1>
                    <div className="pendencies">
                        <div className="total">
                            <p className="receitas">
                                <span className="icon"></span>Total de Receitas Pendentes
                                <span className="value-receita">{formatCurrency(totalReceitasPendentes)}</span>
                            </p>
                            <p className="receitas">
                                <span className="icon"></span>Total de Despesas Pendentes
                                <span className="value-despesa">{formatCurrency(totalDespesasPendentes)}</span>
                            </p>
                        </div>
                        <div className="row"></div>
                        <div className="total">
                            <p className="positive-p">
                                <div className="icon">
                                    <span className='type_circle_g'><FaCheck /></span>
                                    <p>Pendências Concluídas</p>
                                </div>
                                <span className="value-receita">{pendenciasConcluidas}</span>
                            </p>
                            <p className="warning">
                                <div className="icon">
                                    <span className='circle_p'><MdAccessTime /></span>
                                    <p>Pendências Pendentes</p>
                                </div>
                                <span className="value-pendencia">{pendenciasPendentes}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MonthlyCharts;