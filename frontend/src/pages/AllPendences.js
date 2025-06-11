import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/pages/AllPendences.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { MdEdit, MdDelete, MdWarning, MdClose } from "react-icons/md";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";

function AllPendences() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [allPendings, setAllPendings] = useState([]);
    const [groupedPendings, setGroupedPendings] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return today.toISOString().slice(0, 7);
    });
    const [nearestMonth, setNearestMonth] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    // Estados para o modal de edição
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPending, setCurrentPending] = useState(null);
    const [formData, setFormData] = useState({
        title_pending: '',
        total_pending: '',
        fk_type: '',
        fk_category: '',
        deadline_pending: ''
    });
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [transactionForm, setTransactionForm] = useState({
        value: '',
        type: null
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const fetchPendences = async (month) => {
        try {
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const response = await api.get('/pendences/monthly', {
                params: { user_id: userId, month }
            });

            const pendings = response.data.pendings || [];

            if (pendings.length > 0) {
                pendings.sort((a, b) => new Date(a.deadline_pending) - new Date(b.deadline_pending));
                setAllPendings(pendings);
                setNearestMonth(null);
            } else {
                setAllPendings([]);
                const nearestResp = await api.get('/pendences/nearest', {
                    params: { user_id: userId }
                });
                let nearestDate = nearestResp.data.nearest_date;
                if (nearestDate) {
                    const nearestDateObj = new Date(nearestDate);
                    const monthName = nearestDateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                    setNearestMonth(monthName);
                } else {
                    setNearestMonth(null);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar pendências:', error);
            toast.error('Erro ao carregar pendências');
        }
    };

    useEffect(() => {
        const filtered = allPendings.filter(p => {
            if (filters.type && parseInt(filters.type) !== p.fk_type) return false;
            if (filters.status && parseInt(filters.status) !== p.fk_condition) return false;
            if (filters.startDate) {
                const pendingDate = new Date(p.deadline_pending);
                const startDate = new Date(filters.startDate);
                if (pendingDate < startDate) return false;
            }
            if (filters.endDate) {
                const pendingDate = new Date(p.deadline_pending);
                const endDate = new Date(filters.endDate);
                if (pendingDate > endDate) return false;
            }
            return true;
        });

        const grouped = filtered.reduce((acc, pending) => {
            if (!pending.deadline_pending) return acc;
            const dateStr = new Date(pending.deadline_pending).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(pending);
            return acc;
        }, {});

        setGroupedPendings(grouped);
    }, [allPendings, filters]);

    useEffect(() => {
        fetchPendences(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = e => {
        setSelectedMonth(e.target.value);
    };

    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const goBack = () => {
        window.location.href = '/pendences';
    };

    const openEditModal = async (pending) => {
        try {
            const response = await api.get(`/pendences/${pending.id_pending}`);
            const pendingData = response.data;

            setFormData({
                title_pending: pendingData.title_pending,
                total_pending: pendingData.total_pending,
                fk_type: pendingData.fk_type,
                fk_category: pendingData.fk_category,
                deadline_pending: pendingData.deadline_pending ? pendingData.deadline_pending.slice(0, 10) : ''
            });

            setCurrentPending(pendingData);
            setIsModalOpen(true);

            // Buscar tipos e categorias para modal
            const typesResponse = await api.get('/types');
            setTypes(typesResponse.data);

            const categoriesResponse = await api.get('/categories', {
                params: { user_id: JSON.parse(localStorage.getItem('user')).id }
            });
            setCategories(categoriesResponse.data);

            // Filtrar categorias conforme tipo selecionado no pendente
            const filtered = categoriesResponse.data.filter(c => c.fk_type === pendingData.fk_type);
            setFilteredCategories(filtered);
        } catch (error) {
            console.error("Error fetching pending details:", error);
            toast.error("Erro ao carregar dados da pendência");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPending(null);
        setTransactionForm({ value: '', type: null });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'fk_type' ? parseInt(value, 10) : value;

        setFormData({
            ...formData,
            [name]: parsedValue
        });

        if (name === 'fk_type') {
            const selectedType = parseInt(value);
            const filtered = categories.filter(category => category.fk_type === selectedType);
            setFilteredCategories(filtered);
            setFormData(prev => ({ ...prev, fk_category: '' }));
        }
    };

    const updatePendenceList = async () => {
        fetchPendences(selectedMonth);
    };

    const handleUpdatePendence = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/pendences/${currentPending.id_pending}`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success("Pendência atualizada com sucesso!");
            closeModal();
            await updatePendenceList();
        } catch (error) {
            console.error("Error updating pending:", error);
            toast.error("Erro ao atualizar pendência");
        }
    };

    const handleAddPendingTransaction = async (e) => {
        e.preventDefault();

        if (!transactionForm.value || !transactionForm.type) {
            toast.error('Preencha todos os campos da transação!');
            return;
        }

        const transactionValue = parseFloat(transactionForm.value);
        const currentValue = currentPending.initial_pending;
        const targetValue = currentPending.total_pending;

        let adjustedValue = transactionValue;

        // Lógica para aplicar (tipo 1) ou resgatar (tipo 2) valores da pendência
        if (transactionForm.type === 1) { // Aplicar
            if (currentValue + transactionValue > targetValue) {
                adjustedValue = targetValue - currentValue;
                if(adjustedValue <= 0){
                    toast.info('Pendência já atingiu o valor total.');
                    return;
                }
            }
        } else if (transactionForm.type === 2) { // Resgatar
            if (currentValue - transactionValue < 0) {
                adjustedValue = currentValue;
                if(adjustedValue <= 0){
                    toast.info('Não há valor suficiente para resgatar.');
                    return;
                }
            }
        }

        try {
            await api.post('/pendences/transaction', {
                value_pending_transaction: adjustedValue,
                fk_type_savings: transactionForm.type,
                fk_pending: currentPending.id_pending
            });

            // Atualiza o valor da pendência
            await api.put(`/pendences/${currentPending.id_pending}/update-value`);

            // Busca a pendência atualizada
            const updatedResponse = await api.get(`/pendences/${currentPending.id_pending}`);
            setCurrentPending(updatedResponse.data);

            toast.success('Transação registrada com sucesso!');
            await updatePendenceList();
            setTransactionForm({ value: '', type: null });
        } catch (error) {
            console.error('Erro ao registrar transação:', error);
            toast.error('Erro ao registrar transação');
        }
    };

    const handleDeletePendence = async (pendingId) => {
        toast.warning(
            <div className="custom-toast-content">
                <div className="toast-header">
                    <MdWarning className="toast-warning-icon" />
                    <span className="toast-title">Confirmar exclusão</span>
                </div>
                <p className="toast-message">Tem certeza que deseja excluir esta pendência?</p>
                <div className="confirm-toast-buttons">
                    <button
                        className="confirm-toast-button confirm"
                        onClick={() => {
                            toast.dismiss();
                            confirmDelete(pendingId);
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
                style: { minWidth: '400px', padding: '20px' }
            }
        );
    };

    const confirmDelete = async (pendingId) => {
        try {
            await api.delete(`/pendences/${pendingId}`);
            toast.success("Pendência excluída com sucesso!");
            fetchPendences(selectedMonth);
        } catch (error) {
            console.error("Error deleting pendence:", error);
            toast.error("Erro ao excluir pendência");
        }
    };

    return (
        <div className="screen">
            <div className="left_area">{isSidebarOpen && <Sidebar />}</div>
            <div className="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div className="title_area">
                        <div className='at_title_area_left'>
                            <h1>Dados da Conta</h1>
                            <button onClick={goBack}>Voltar</button>
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
                            <p>Todas as Pendências</p>
                            <div className='transactions_filter'>
                                <label htmlFor="filter-type">Filtros:</label>
                                <select
                                    id="filter-type"
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Selecione um tipo</option>
                                    <option value="1">Receita</option>
                                    <option value="2">Despesa</option>
                                </select>
                                <select
                                    id="filter-status"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Selecione um status</option>
                                    <option value="1">Pendente</option>
                                    <option value="2">Concluído</option>
                                </select>
                                <div className="input_date_filter">
                                    <p htmlFor="filter-start-date">Prazo Inicial:</p>
                                    <input
                                        type="date"
                                        id="filter-start-date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="input_date_filter">
                                    <p htmlFor="filter-end-date">Prazo Final:</p>
                                    <input
                                        type="date"
                                        id="filter-end-date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="all_transactions">
                            {Object.keys(groupedPendings).length > 0 ? (
                                Object.entries(groupedPendings).map(([date, pendingList]) => (
                                    <div key={date} className="date_transaction_group">
                                        <p className="p_date">Prazo: {date}</p>
                                        {pendingList.map(pending => (
                                            <div key={pending.id_pending} className="pendence_card">
                                                <div className="gc_top">
                                                    <div className="gc_top_left">
                                                        <span className={pending.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                                            {pending.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                                        </span>
                                                        <div className="gc_top_content">
                                                            <p className="pc_title">{pending.title_pending}</p>
                                                            <div className="subtitle">
                                                                <p className="pc_deadline" style={{ textTransform: 'capitalize' }}>{pending.category?.title_category || 'Sem categoria'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gc_condition_area">
                                                        <span className={`gc_condition ${pending.fk_condition === 1 ? "status-pending" : "status-completed"}`}>
                                                            {pending.fk_condition === 1 ? "Pendente" : "Concluído"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="gc_bottom">
                                                    <div className="progress_area">
                                                        <div className="progress_content">
                                                            <p>Progresso</p>
                                                            <p>
                                                                R$ {parseFloat(pending.initial_pending).toFixed(2).replace('.', ',')} / R$ {parseFloat(pending.total_pending).toFixed(2).replace('.', ',')}
                                                            </p>
                                                        </div>
                                                        <div className="progress_bar_total_p">
                                                            <div
                                                                className="progress_bar_g"
                                                                style={{ width: `${(pending.initial_pending / pending.total_pending) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="gc_edit">
                                                        <MdEdit
                                                            className='edit_icon_goal'
                                                            onClick={() => openEditModal(pending)}
                                                        />
                                                        <MdDelete
                                                            className='delete_icon_goal'
                                                            onClick={() => handleDeletePendence(pending.id_pending)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : nearestMonth ? (
                                <p>Suas pendências mais próximas estão no mês de {nearestMonth}.</p>
                            ) : (
                                <p>Sem pendências para exibir.</p>
                            )}
                        </div>
                    </div>

                    {/* Modal de Edição */}
                    {isModalOpen && currentPending && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2>Editar Pendência</h2>
                                    <MdClose className="close-icon" onClick={closeModal} />
                                </div>
                                <form onSubmit={handleUpdatePendence} className="form_transaction">
                                    <div className="input_group">
                                        <label>Tipo de pendência</label>
                                        <div className="radios_area">
                                            {types.map(type => (
                                                <div key={type.id_type} className='radio_item'>
                                                    <input
                                                        type="radio"
                                                        name="fk_type"
                                                        value={type.id_type}
                                                        checked={formData.fk_type === type.id_type}
                                                        onChange={handleInputChange}
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
                                        <label>Título</label>
                                        <input
                                            type="text"
                                            name="title_pending"
                                            placeholder='Nomeie a pendência'
                                            value={formData.title_pending}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input_group">
                                        <label>Valor Total (R$)</label>
                                        <input
                                            type="number"
                                            name="total_pending"
                                            placeholder='0,00'
                                            value={formData.total_pending}
                                            onChange={handleInputChange}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="input_group">
                                        <label>Categoria</label>
                                        <select
                                            name="fk_category"
                                            value={formData.fk_category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {filteredCategories.map(category => (
                                                <option key={category.id_category} value={category.id_category}>
                                                    {category.title_category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input_group">
                                        <label>Prazo</label>
                                        <input
                                            type="date"
                                            name="deadline_pending"
                                            value={formData.deadline_pending}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                        <button type="submit" style={{width: '100%'}}>
                                            Salvar Alterações
                                        </button>
                                    
                                </form>

                                {/* Seção de Transação */}
                                <div className="transaction-section">
                                    <h3>Realizar Transação</h3>

                                    <div className="radios_area">
                                        <div className="radio_item">
                                            <input
                                                type="radio"
                                                name="transaction_type"
                                                id="apply_pending"
                                                checked={transactionForm.type === 1}
                                                onChange={() => setTransactionForm({
                                                    ...transactionForm,
                                                    type: 1
                                                })}
                                            />
                                            <PiPlusCircleBold className='icon_receita' />
                                            <label htmlFor="apply_pending">Aplicar</label>
                                        </div>
                                        <div className="radio_item">
                                            <input
                                                type="radio"
                                                name="transaction_type"
                                                id="withdraw_pending"
                                                checked={transactionForm.type === 2}
                                                onChange={() => setTransactionForm({
                                                    ...transactionForm,
                                                    type: 2
                                                })}
                                            />
                                            <PiMinusCircleBold className='icon_despesa' />
                                            <label htmlFor="withdraw_pending">Resgatar</label>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddPendingTransaction} className="transaction-form">
                                        <input
                                            type="number"
                                            placeholder="0,00"
                                            value={transactionForm.value}
                                            onChange={(e) => setTransactionForm({
                                                ...transactionForm,
                                                value: e.target.value
                                            })}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                        <button type="submit">Realizar</button>
                                    </form>

                                    <div className="current-value">
                                        <p>Valor Atual da Pendência: R$ {parseFloat(currentPending.initial_pending).toFixed(2).replace('.', ',')}</p>
                                        <p>Progresso: {Math.round((currentPending.initial_pending / currentPending.total_pending) * 100)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AllPendences;