import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import '../css/pages/AllTransactions.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { MdDelete, MdEdit, MdWarning } from "react-icons/md";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllTransactions() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('2025-06');
    const [selectedType, setSelectedType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title_transaction: '',
        value_transaction: '',
        fk_type: '',
        fk_category: ''
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const Home = () => {
        window.location.href = '/home';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user')).id;

                // Busca transações
                const transactionsResponse = await api.get('/transactions/monthly/type', {
                    params: {
                        user_id: userId,
                        month: selectedMonth,
                        type: selectedType
                    }
                });
                setTransactions(transactionsResponse.data.transactions);

                // Busca categorias e tipos para o modal
                const categoriesResponse = await api.get('/categories', {
                    params: { user_id: userId }
                });
                const typesResponse = await api.get('/types');

                setCategories(categoriesResponse.data);
                setTypes(typesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedMonth, selectedType]);

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

    const openEditModal = async (transaction) => {
        try {
            // Busca os dados completos da transação
            const response = await api.get(`/transactions/${transaction.id_transaction}`);
            setCurrentTransaction(response.data);

            // Preenche o formulário com os dados da transação
            setFormData({
                title_transaction: response.data.title_transaction,
                value_transaction: response.data.value_transaction,
                fk_type: response.data.fk_type,
                fk_category: response.data.fk_category
            });

            // Filtra categorias baseadas no tipo da transação
            const filtered = categories.filter(category => category.fk_type === response.data.fk_type);
            setFilteredCategories(filtered);

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            toast.error("Erro ao carregar dados da transação");
        }
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'fk_type') {
            const selectedType = parseInt(value);
            const filtered = categories.filter(category => category.fk_type === selectedType);
            setFilteredCategories(filtered);
            // Reset category when type changes
            setFormData(prev => ({
                ...prev,
                fk_category: ''
            }));
        }
    };

    const handleUpdateTransaction = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/transactions/${currentTransaction.id_transaction}`, formData);
            toast.success("Transação atualizada com sucesso!");

            // Atualiza a lista de transações
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const response = await api.get('/transactions/monthly/type', {
                params: {
                    user_id: userId,
                    month: selectedMonth,
                    type: selectedType
                }
            });
            setTransactions(response.data.transactions);

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating transaction:", error);
            toast.error("Erro ao atualizar transação");
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.created_at);
        const isStartDateMatch = startDate ? transactionDate >= new Date(startDate) : true;
        const isEndDateMatch = endDate ? transactionDate <= new Date(endDate) : true;

        return isStartDateMatch && isEndDateMatch;
    });

    const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    const handleDeleteTransaction = async (transactionId) => {
        toast.warning(
            <div className="custom-toast-content">
                <div className="toast-header">
                    <MdWarning className="toast-warning-icon" />
                    <span className="toast-title">Confirmar exclusão</span>
                </div>
                <p className="toast-message">Tem certeza que deseja excluir esta transação?</p>
                <div className="confirm-toast-buttons">
                    <button
                        className="confirm-toast-button confirm"
                        onClick={() => {
                            toast.dismiss();
                            confirmDelete(transactionId);
                        }}
                    >
                        Confirmar
                    </button>
                    <button
                        className="confirm-toast-button cancel"
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                className: 'confirm-toast',
                autoClose: false,
                closeButton: false,
                draggable: false,
                closeOnClick: false,
                toastId: 'delete-confirmation',
                position: "top-center",
                icon: false,
                style: {
                    minWidth: '400px',
                    padding: '20px'
                }
            }
        );
    };

    const confirmDelete = async (transactionId) => {
        try {
            await api.delete(`/transactions/${transactionId}`);

            // Atualiza a lista de transações
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const response = await api.get('/transactions/monthly/type', {
                params: {
                    user_id: userId,
                    month: selectedMonth,
                    type: selectedType
                }
            });
            setTransactions(response.data.transactions);

            toast.success("Transação excluída com sucesso!");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.error("Erro ao excluir transação");
        }
    };

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
                                    <option value="1">Receita</option>
                                    <option value="2">Despesa</option>
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
                                        <div key={transaction.id_transaction} className="transaction_card">
                                            <div className="tcard_left">
                                                <div className={transaction.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                                    {transaction.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                                </div>
                                                <div className="tcontent">
                                                    <div className="tcontent_title">{transaction.title_transaction}</div>
                                                    <div className="tcontent_category" style={{ color: transaction.category.color_category }}>{transaction.category.title_category}</div>
                                                </div>
                                            </div>
                                            <div className="tran_card_right">
                                                <p className={transaction.fk_type === 1 ? "transaction_value_g" : "transaction_value_r"}>
                                                    {transaction.fk_type === 1
                                                        ? `+ R$ ${transaction.value_transaction.toFixed(2).replace('.', ',')}`
                                                        : `- R$ ${transaction.value_transaction.toFixed(2).replace('.', ',')}`}
                                                </p>
                                                <div className="transaction_actions">
                                                    <MdEdit
                                                        className='edit_icon_transaction'
                                                        onClick={() => openEditModal(transaction)}
                                                    />
                                                    {/* <MdDelete className='delete_icon' /> */}
                                                    <MdDelete
                                                        className='delete_icon'
                                                        onClick={() => handleDeleteTransaction(transaction.id_transaction)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal de Edição */}
                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2>Editar Transação</h2>
                                    <button
                                        className="close-modal"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateTransaction} className="form_transaction">
                                    <div className="input_group">
                                        <label htmlFor="">Tipo de transação</label>
                                        <div className="radios_area">
                                            {types.map(type => (
                                                <div key={type.id_type} className='radio_item'>
                                                    <input
                                                        type="radio"
                                                        name="fk_type"
                                                        value={type.id_type}
                                                        checked={formData.fk_type == type.id_type}
                                                        onChange={handleModalChange}
                                                    />
                                                    {type.id_type === 1 ?
                                                        <PiPlusCircleBold className='icon_receita' /> :
                                                        <PiMinusCircleBold className='icon_despesa' />}
                                                    <label>{type.name_type}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="input_group">
                                        <label htmlFor="">Título</label>
                                        <input
                                            type="text"
                                            name="title_transaction"
                                            placeholder='Nomeie a transação'
                                            value={formData.title_transaction}
                                            onChange={handleModalChange}
                                        />
                                    </div>
                                    <div className="input_group">
                                        <label htmlFor="">Valor (R$)</label>
                                        <input
                                            type="number"
                                            name="value_transaction"
                                            placeholder='0,00'
                                            value={formData.value_transaction}
                                            onChange={handleModalChange}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="input_group">
                                        <label htmlFor="">Categoria</label>
                                        <select
                                            name="fk_category"
                                            value={formData.fk_category}
                                            onChange={handleModalChange}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {filteredCategories.map(category => (
                                                <option key={category.id_category} value={category.id_category}>
                                                    {category.title_category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button type="submit" className="save-btn">
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

export default AllTransactions;