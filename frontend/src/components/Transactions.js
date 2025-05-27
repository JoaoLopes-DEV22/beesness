import { useEffect, useState, useCallback } from 'react';
import '../css/components/Transactions.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import api from '../api';

function Transactions() {
    // Carrega o usuário de forma segura com tratamento de erro
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            toast.error("Erro ao carregar dados do usuário");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title_transaction: '',
        value_transaction: '',
        fk_type: '',
        fk_category: ''
    });

    const [lastDate, setLastDate] = useState('');
    const [lastTransactions, setLastTransactions] = useState([]);
    const [hasLoadedTransactions, setHasLoadedTransactions] = useState(false);

    // Busca categorias e tipos
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!user?.id) return;
            
            try {
                const [categoriesResponse, typesResponse] = await Promise.all([
                    api.get('/categories', { params: { user_id: user.id } }),
                    api.get('/types')
                ]);
                
                setCategories(categoriesResponse.data);
                setTypes(typesResponse.data);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                toast.error("Erro ao carregar dados iniciais");
            }
        };

        fetchInitialData();
    }, [user?.id]);

    // Busca as últimas transações com debounce e cache
    const fetchLastTransactions = useCallback(async () => {
        if (!user?.id || hasLoadedTransactions) return;
        
        try {
            const response = await api.get('/transactions/last', {
                params: { user_id: user.id },
                headers: {
                    'Cache-Control': 'max-age=60' // Cache de 1 minuto
                }
            });

            setLastDate(response.data.last_date || '');
            setLastTransactions(response.data.transactions || []);
            setHasLoadedTransactions(true);
        } catch (error) {
            console.error("Error fetching last transactions:", error);
            toast.error("Erro ao carregar transações recentes");
        }
    }, [user?.id, hasLoadedTransactions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLastTransactions();
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timer);
    }, [fetchLastTransactions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'fk_type') {
            const selectedType = parseInt(value);
            const filtered = categories.filter(category => category.fk_type === selectedType);
            setFilteredCategories(filtered);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?.id) {
            toast.error("Usuário não identificado");
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                fk_account: user.id
            };
            
            await api.post('/transactions', dataToSend);
            
            setFormData({
                title_transaction: '',
                value_transaction: '',
                fk_type: '',
                fk_category: '',
            });
            
            setFilteredCategories([]);
            setHasLoadedTransactions(false); // Força recarregar as transações
            toast.success("Transação adicionada com sucesso!");

        } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error(error.response?.data?.message || "Erro ao adicionar transação");
        }
    };

    const allTransactions = () => {
        window.location.href = '/all-transactions';
    }

    if (isLoading) {
        return <div className="loading-container">Carregando...</div>;
    }

    if (!user) {
        return <div className="error-container">Usuário não autenticado</div>;
    }

    return (
        <div>
            <div className="transactions_area">
                <div className="latest_transactions">
                    <div className="l_transaction_title">
                        <p>Últimas Transações</p>
                        <div className='transactions_date_btn'>
                            <input type="date" readOnly value={lastDate} />
                            <button onClick={allTransactions}>Ver Todas</button>
                        </div>
                    </div>
                    <div className="transactions">
                        {lastTransactions.length > 0 ? (
                            lastTransactions.map(transaction => (
                                <div key={transaction.id_transaction} className="transaction_card">
                                    <div className="tcard_left">
                                        <div className={transaction.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                            {transaction.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">{transaction.title_transaction}</div>
                                            <div className="tcontent_category" style={{color: transaction.category.color_category}}>
                                                {transaction.category?.title_category || 'Categoria'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className={transaction.fk_type === 1 ? "transaction_value_g" : "transaction_value_r"}>
                                            {transaction.fk_type === 1 ? '+' : '-'} R$ {parseFloat(transaction.value_transaction).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Sem transações para exibir.</p>
                        )}
                    </div>
                </div>

                <div className="new_transaction">
                    <p>Nova Transação</p>
                    <form onSubmit={handleSubmit} className="form_transaction">
                        <div className="input_group">
                            <label htmlFor="">Tipo de transação</label>
                            <div className="radios_area">
                                {types.map(type => (
                                    <div key={type.id_type} className='radio_item'>
                                        <input
                                            type="radio"
                                            name="fk_type"
                                            value={type.id_type}
                                            onChange={handleChange}
                                            required
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
                                onChange={handleChange}
                                required
                                minLength="3"
                                maxLength="50"
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Valor (R$)</label>
                            <input
                                type="number"
                                name="value_transaction"
                                placeholder='0,00'
                                value={formData.value_transaction}
                                onChange={handleChange}
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Categoria</label>
                            <select
                                name="fk_category"
                                value={formData.fk_category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                {filteredCategories.map(category => (
                                    <option key={category.id_category} value={category.id_category}>
                                        {category.title_category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit">Adicionar Transação</button>
                    </form>
                </div>
            </div>
            
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default Transactions;