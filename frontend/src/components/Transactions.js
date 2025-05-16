import { useEffect, useState } from 'react';
import '../css/components/Transactions.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import api from '../api';

function Transactions() {
    const user = JSON.parse(localStorage.getItem('user'));

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title_transaction: '',
        value_transaction: '',
        fk_type: '',
        fk_category: ''
    });

    // Novos estados para transações e data das últimas transações
    const [lastDate, setLastDate] = useState('');
    const [lastTransactions, setLastTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await api.get('/categories', {
                    params: { user_id: user.id}
                });
                const typesResponse = await api.get('/types');

                setCategories(categoriesResponse.data);
                setTypes(typesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Busca as últimas transações do usuário, enviando user.id no query param
    useEffect(() => {
        const fetchLastTransactions = async () => {
            try {
                if (!user?.id) return; // evita erro se não tiver user

                const response = await api.get('/transactions/last', {
                    params: { user_id: user.id }
                });

                setLastDate(response.data.last_date || '');
                setLastTransactions(response.data.transactions || []);

            } catch (error) {
                console.error("Error fetching last transactions:", error);
            }
        };

        fetchLastTransactions();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'fk_type') {
            const selectedType = parseInt(value);
            const filtered = categories.filter(category => category.fk_type === selectedType);
            setFilteredCategories(filtered);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            toast.success("Transação adicionada com sucesso!");

            // Atualiza lista de últimas transações após adicionar uma nova
            const response = await api.get('/transactions/last', {
                params: { user_id: user.id }
            });
            setLastDate(response.data.last_date || '');
            setLastTransactions(response.data.transactions || []);

        } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error("Erro ao adicionar transação.");
        }
    };

    const allTransactions = () => {
        window.location.href = '/all-transactions'
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
                                            <div className="tcontent_category" style={{color: transaction.category.color_category}}>{transaction.category?.title_category || 'Categoria'}</div>
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
                                        />
                                        {type.id_type === 1 ? <PiPlusCircleBold className='icon_receita' /> : <PiMinusCircleBold className='icon_despesa' />}
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
                                placeholder=' Nomeie a transação'
                                value={formData.title_transaction}
                                onChange={handleChange}
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
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Categoria</label>
                            <select
                                name="fk_category"
                                value={formData.fk_category}
                                onChange={handleChange}
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