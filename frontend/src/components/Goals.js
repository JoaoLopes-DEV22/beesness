import '../css/components/Goals.css';
import { MdEdit, MdDelete, MdClose, MdWarning } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

function Goals() {
    const [goals, setGoals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [accountId, setAccountId] = useState(null);
    const [formData, setFormData] = useState({
        title_goal: '',
        target_goal: '',
        deadline_goal: ''
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [transactionForm, setTransactionForm] = useState({
        value: '',
        type: null
    });
    const [conditionFilter, setConditionFilter] = useState('');
    const [deadlineOrder, setDeadlineOrder] = useState('');

    // Carrega o accountId do usuário logado
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData?.account?.id_account) {
            setAccountId(userData.account.id_account);
        }
    }, []);

    // Monitora as mudanças nos filtros de status e prazo
    // e reseta a página para 1 se um filtro for aplicado ou removido,
    // garantindo que a busca comece do início para os novos resultados.
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1); // Reseta a página para 1 se não estiver já na primeira
        } else {
            // Se já está na página 1, force o fetchGoals para aplicar o filtro
            // caso o filtro mude e a página permaneça a mesma.
            if (accountId) { // Certifica-se de que accountId já foi carregado
                fetchGoals();
            }
        }
    }, [conditionFilter, deadlineOrder]); // Este efeito é acionado apenas quando os filtros mudam

    // Busca as metas quando o accountId, a página, ou os filtros mudam.
    // fetchGoals é chamado indiretamente por este useEffect também quando setCurrentPage(1) é executado acima.
    useEffect(() => {
        if (accountId && currentPage) { // Garante que accountId e currentPage estão prontos
            fetchGoals();
        }
    }, [accountId, currentPage]); // Este efeito é acionado quando a página ou o accountId mudam

    // Função para buscar as metas com base nos filtros e paginação
    const fetchGoals = async () => {
        try {
            setLoading(true);
            const params = {
                accountId,
                page: currentPage,
                perPage: 4,
            };

            // Adiciona o filtro de condição (status) aos parâmetros apenas se não for uma string vazia
            if (conditionFilter !== '') {
                params.condition = conditionFilter;
            }

            // Adiciona a ordenação por prazo aos parâmetros apenas se não for uma string vazia
            if (deadlineOrder !== '') {
                params.order = deadlineOrder;
            }

            const response = await api.get('/goals', { params });
            setGoals(response.data.goals);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar metas:', error);
            toast.error('Erro ao carregar metas');
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar data no formato DD/MM/YYYY sem problemas de fuso horário
    const formatDate = (dateString) => {
        if (!dateString) return 'Sem prazo';
        const datePart = dateString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    };

    // Função para converter DD/MM/YYYY para YYYY-MM-DD (usado no form) - Atualmente não usada, mas mantida
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const openEditModal = async (goal) => {
        try {
            const response = await api.get(`/goals/${goal.id_goal}`);
            setCurrentGoal(response.data.goal);
            setEditModalOpen(true);
        } catch (error) {
            console.error('Erro ao carregar meta:', error);
            toast.error('Erro ao carregar dados da meta');
        }
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setCurrentGoal(null);
        setTransactionForm({ value: '', type: null });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title_goal || !formData.target_goal) {
            toast.error('Preencha pelo menos o título e o valor alvo');
            return;
        }

        try {
            await api.post('/goals', {
                ...formData,
                value_goal: 0,
                fk_condition: 1, // Por padrão, uma nova meta começa como pendente
                fk_account: accountId
            });

            toast.success('Meta criada com sucesso!');
            setFormData({ title_goal: '', target_goal: '', deadline_goal: '' });
            setCurrentPage(1); // Reseta para a primeira página ao criar uma nova meta
            fetchGoals();
        } catch (error) {
            console.error('Erro ao criar meta:', error);
            toast.error('Erro ao criar meta');
        }
    };

    const handleSaveGoal = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/goals/${currentGoal.id_goal}`, {
                title_goal: currentGoal.title_goal,
                target_goal: currentGoal.target_goal,
                deadline_goal: currentGoal.deadline_goal
            });

            toast.success('Meta atualizada com sucesso!');
            fetchGoals(); // Recarrega a lista de metas após a atualização
            closeEditModal();
        } catch (error) {
            console.error('Erro ao atualizar meta:', error);
            toast.error('Erro ao atualizar meta');
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();

        if (!transactionForm.value || !transactionForm.type) {
            toast.error('Preencha todos os campos da transação!');
            return;
        }

        const transactionValue = parseFloat(transactionForm.value);
        const currentValue = currentGoal.value_goal;
        const targetValue = currentGoal.target_goal;

        let adjustedValue = transactionValue;

        // Lógica para aplicar (tipo 1) ou resgatar (tipo 2) valores da meta
        if (transactionForm.type === 1) { // Aplicar
            if (currentValue + transactionValue > targetValue) {
                adjustedValue = targetValue - currentValue; // Ajusta o valor para não ultrapassar o alvo
                if(adjustedValue <= 0){
                    toast.info('Meta já atingiu o valor alvo.');
                    return;
                }
            }
        } else if (transactionForm.type === 2) { // Resgatar
            if (currentValue - transactionValue < 0) {
                adjustedValue = currentValue; // Não pode resgatar mais do que o valor atual
                if(adjustedValue <= 0){
                    toast.info('Não há valor suficiente para resgatar.');
                    return;
                }
            }
        }

        try {
            await api.post('/goal-transactions', {
                value_goal_transaction: adjustedValue,
                fk_type_savings: transactionForm.type,
                fk_goal: currentGoal.id_goal
            });

            // Atualiza o valor da meta no backend
            await api.put(`/goals/${currentGoal.id_goal}/update-value`);

            // Busca a meta atualizada para verificar a condição (concluída ou não)
            const updatedResponse = await api.get(`/goals/${currentGoal.id_goal}`);
            setCurrentGoal(updatedResponse.data.goal); // Atualiza o estado da meta no modal

            // Se o valor atual da meta atingiu ou ultrapassou o alvo, marca como concluída
            if (updatedResponse.data.goal.value_goal >= targetValue && updatedResponse.data.goal.fk_condition !== 2) {
                await api.put(`/goals/${currentGoal.id_goal}`, { fk_condition: 2 }); // Altera a condição para "Concluído" (ID 2)
                const refreshedGoal = await api.get(`/goals/${currentGoal.id_goal}`); // Busca novamente para garantir a atualização
                setCurrentGoal(refreshedGoal.data.goal);
            } else if (updatedResponse.data.goal.value_goal < targetValue && updatedResponse.data.goal.fk_condition === 2) {
                // Se o valor da meta caiu abaixo do alvo e estava concluída, volta para pendente
                await api.put(`/goals/${currentGoal.id_goal}`, { fk_condition: 1 }); // Altera a condição para "Pendente" (ID 1)
                const refreshedGoal = await api.get(`/goals/${currentGoal.id_goal}`);
                setCurrentGoal(refreshedGoal.data.goal);
            }

            toast.success('Transação registrada com sucesso!');
            fetchGoals(); // Recarrega a lista de metas para refletir as mudanças
            setTransactionForm({ value: '', type: null }); // Limpa o formulário de transação
        } catch (error) {
            console.error('Erro ao registrar transação:', error);
            toast.error('Erro ao registrar transação');
        }
    };

    const handleDeleteGoal = (goalId) => {
        toast.warning(
            <div className="custom-toast-content">
                <div className="toast-header">
                    <MdWarning className="toast-warning-icon" />
                    <span className="toast-title">Confirmar exclusão</span>
                </div>
                <p className="toast-message">Tem certeza que deseja excluir esta meta?</p>
                <div className="confirm-toast-buttons">
                    <button
                        className="confirm-toast-button confirm"
                        onClick={() => {
                            toast.dismiss();
                            confirmDeleteGoal(goalId);
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

    const confirmDeleteGoal = async (goalId) => {
        try {
            await api.delete(`/goals/${goalId}`);
            toast.success('Meta excluída com sucesso!');
            fetchGoals(); // Recarrega a lista de metas
        } catch (error) {
            console.error('Erro ao excluir meta:', error);
            toast.error('Erro ao excluir meta');
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const calculateProgress = (value, target) => {
        if (target <= 0) return 0;
        const progress = (value / target) * 100;
        return Math.min(100, Math.max(0, Math.round(progress)));
    };

    return (
        <div className="div">
            <div className="title_area_goals">
                <h1 id='h1_title'>Metas</h1>

                <div className="filters_area_goals">
                    {/* Filtro por Status */}
                    <select
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value)}
                    >
                        <option value="">Selecione um status</option>
                        <option value="1">Pendente</option>
                        <option value="2">Concluído</option>
                    </select>

                    {/* Filtro por Prazo */}
                    <select
                        value={deadlineOrder}
                        onChange={(e) => setDeadlineOrder(e.target.value)}
                    >
                        <option value="">Ordene por prazo</option>
                        <option value="asc">Prazo menor pro maior</option>
                        <option value="desc">Prazo maior pro menor</option>
                    </select>
                </div>
            </div>

            <div className='goals_component'>
                <div className="goals_area">
                    {loading ? (
                        <div className="loading">Carregando metas...</div>
                    ) : (
                        <>
                            <div className="goals">
                                {goals.length === 0 ? (
                                    <div className="no-goals">Nenhuma meta encontrada</div>
                                ) : (
                                    goals.map((goal) => (
                                        <div className="goal_card" key={goal.id_goal}>
                                            <div className="gc_top">
                                                <div className="gc_top_left">
                                                    <span className={goal.fk_condition === 2 ? 'type_circle_g' : 'circle_p'}>
                                                        {goal.fk_condition === 2 ? <FaCheck /> : <TbTargetArrow />}
                                                    </span>
                                                    <div className="gc_top_content">
                                                        <p className="gc_title">{goal.title_goal}</p>
                                                        <p className='gc_deadline'>
                                                            Prazo: {formatDate(goal.deadline_goal)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="gc_condition_area">
                                                    <span className={goal.fk_condition === 2 ? 'gc_condition_c' : 'gc_condition'}>
                                                        {goal.fk_condition === 2 ? 'Concluído' : 'Pendente'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="gc_bottom">
                                                <div className="progress_area">
                                                    <div className="progress_content">
                                                        <p>Progresso</p>
                                                        <p>
                                                            {formatCurrency(goal.value_goal)} / {formatCurrency(goal.target_goal)}
                                                        </p>
                                                    </div>
                                                    <div className="progress_bar_total_g">
                                                        <div
                                                            className="progress_bar_g"
                                                            style={{
                                                                width: `${calculateProgress(goal.value_goal, goal.target_goal)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="gc_edit">
                                                    <MdEdit
                                                        className='edit_icon_goal'
                                                        onClick={() => openEditModal(goal)}
                                                    />
                                                    <MdDelete
                                                        className='delete_icon_goal'
                                                        onClick={() => handleDeleteGoal(goal.id_goal)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Paginação */}
                            {totalPages > 1 && (
                                <div className="pagination_goals">
                                    <IoIosArrowBack
                                        className={`arrow arrow_first ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    />

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <div
                                                key={pageNum}
                                                className={`pagination_item ${currentPage === pageNum ? 'selected' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                <p>{pageNum}</p>
                                            </div>
                                        );
                                    })}

                                    <IoIosArrowForward
                                        className={`arrow arrow_last ${currentPage === totalPages ? 'disabled' : ''}`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Área de Criação de Nova Meta */}
                <div className="new_goal">
                    <p>Nova Meta</p>
                    <form className="form_goal" onSubmit={handleSubmit}>
                        <div className="input_group">
                            <label htmlFor="title_goal">Título</label>
                            <input
                                type="text"
                                name="title_goal"
                                placeholder='Nomeie a meta'
                                value={formData.title_goal}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="target_goal">Valor Alvo (R$)</label>
                            <input
                                type="number"
                                name="target_goal"
                                placeholder='0,00'
                                value={formData.target_goal}
                                onChange={handleInputChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="deadline_goal">Prazo (opcional)</label>
                            <input
                                type="date"
                                name="deadline_goal"
                                id="deadline_goal"
                                value={formData.deadline_goal}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button type="submit">Adicionar Meta</button>
                    </form>
                </div>
            </div>

            {/* Modal de Edição */}
            {editModalOpen && currentGoal && (
                <div className="modal-overlay">
                    <div className="edit-goal-modal">
                        <div className="modal-header">
                            <h2>Editar Meta</h2>
                            <MdClose className="close-icon" onClick={closeEditModal} />
                        </div>

                        <form onSubmit={handleSaveGoal}>
                            <div className="input_group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={currentGoal.title_goal}
                                    onChange={(e) => setCurrentGoal({
                                        ...currentGoal,
                                        title_goal: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="input_group">
                                <label>Valor Alvo (R$)</label>
                                <input
                                    type="number"
                                    value={currentGoal.target_goal}
                                    onChange={(e) => setCurrentGoal({
                                        ...currentGoal,
                                        target_goal: e.target.value
                                    })}
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="input_group">
                                <label>Prazo</label>
                                <input
                                    type="date"
                                    value={currentGoal.deadline_goal?.split('T')[0] || ''}
                                    onChange={(e) => setCurrentGoal({
                                        ...currentGoal,
                                        deadline_goal: e.target.value
                                    })}
                                />
                            </div>

                            <button type="submit">Salvar Alterações</button>
                        </form>

                        {/* Seção de Transação da Meta */}
                        <div className="transaction-section">
                            <h3>Realizar Transação</h3>

                            <div className="radios_area">
                                <div className="radio_item">
                                    <input
                                        type="radio"
                                        name="transaction_type"
                                        id="apply_goal"
                                        checked={transactionForm.type === 1}
                                        onChange={() => setTransactionForm({
                                            ...transactionForm,
                                            type: 1
                                        })}
                                    />
                                    <PiPlusCircleBold className='icon_receita' />
                                    <label htmlFor="apply_goal">Aplicar</label>
                                </div>
                                <div className="radio_item">
                                    <input
                                        type="radio"
                                        name="transaction_type"
                                        id="withdraw_goal"
                                        checked={transactionForm.type === 2}
                                        onChange={() => setTransactionForm({
                                            ...transactionForm,
                                            type: 2
                                        })}
                                    />
                                    <PiMinusCircleBold className='icon_despesa' />
                                    <label htmlFor="withdraw_goal">Resgatar</label>
                                </div>
                            </div>

                            <form onSubmit={handleAddTransaction}>
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
                                <p>Valor Atual da Meta: {formatCurrency(currentGoal.value_goal)}</p>
                                <p>Progresso: {calculateProgress(currentGoal.value_goal, currentGoal.target_goal)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Goals;