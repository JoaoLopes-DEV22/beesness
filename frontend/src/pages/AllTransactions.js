import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/AllTransactions.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import api from '../api'; // Certifique-se de que você tem a configuração do axios

function AllTransactions() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('2025-05'); // Mês padrão
    const [selectedType, setSelectedType] = useState(''); // Filtro de tipo
    const [startDate, setStartDate] = useState(''); // Filtro de data inicial
    const [endDate, setEndDate] = useState(''); // Filtro de data final

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const Home = () => {
        window.location.href = '/home';
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user')).id; // Supondo que você armazena o ID do usuário no localStorage
                const response = await api.get('/transactions/monthly/type', {
                    params: {
                        user_id: userId,
                        month: selectedMonth,
                        type: selectedType // Envia o tipo de transação
                    }
                });
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [selectedMonth, selectedType]); // Reexecuta quando o mês ou tipo mudar

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // Filtrar transações com base nos filtros
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.created_at); // Supondo que a data da transação esteja em um formato compatível
        const isStartDateMatch = startDate ? transactionDate >= new Date(startDate) : true; // Filtra por data inicial
        const isEndDateMatch = endDate ? transactionDate <= new Date(endDate) : true; // Filtra por data final

        return isStartDateMatch && isEndDateMatch;
    });

    // Agrupar transações por data
    const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString(); // Formato da data
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    return (
        <div className="screen">
            <div className="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div className="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div className="title_area">
                        <div className='at_title_area_left'>
                            <h1>Dados da Conta</h1>
                            <button onClick={Home}>Voltar</button>
                        </div>
                        <input 
                            type="month" 
                            value={selectedMonth} 
                            className='input_month_all' 
                            onChange={handleMonthChange} 
                        />
                    </div>

                    <div className="all_transactions_area">
                        <div className="all_transaction_title">
                            <p>Todas as Transações</p>
                            <div className='transactions_filter'>
                                <label htmlFor="">Filtros:</label>
                                <select value={selectedType} onChange={handleTypeChange}>
                                    <option value="">Selecione um tipo</option>
                                    <option value="1">Receita</option> {/* Supondo que 1 é o ID para Receita */}
                                    <option value="2">Despesa</option> {/* Supondo que 2 é o ID para Despesa */}
                                </select>
                                <div className="input_date_filter">
                                    <p>Data Inicial:</p>
                                    <input type="date" value={startDate} onChange={handleStartDateChange} />
                                </div>
                                <div className="input_date_filter">
                                    <p>Data Final:</p>
                                    <input type="date" value={endDate} onChange={handleEndDateChange} />
                                </div>
                            </div>
                        </div>

                        <div className="all_transactions">
                            {Object.keys(groupedTransactions).map(date => (
                                <div key={date} className="date_transaction_group">
                                    <p className="p_date">{date}</p>
                                    {groupedTransactions[date].map(transaction => (
                                        <div key={transaction.id} className="transaction_card">
                                            <div className="tcard_left">
                                                <div className={transaction.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                                    {transaction.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                                </div>
                                                <div className="tcontent">
                                                    <div className="tcontent_title">{transaction.title_transaction}</div>
                                                    <div className="tcontent_category">{transaction.category}</div>
                                                </div>
                                            </div>
                                            <div className="tcard_right">
                                                <p className={transaction.fk_type === 1 ? "transaction_value_g" : "transaction_value_r"}>
                                                    {transaction.fk_type === 1 
                                                        ? `+ R$ ${transaction.value_transaction.toFixed(2).replace('.', ',')}` 
                                                        : `- R$ ${transaction.value_transaction.toFixed(2).replace('.', ',')}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AllTransactions;
