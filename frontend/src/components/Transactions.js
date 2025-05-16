import { useEffect, useState } from 'react';
import '../css/components/Transactions.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await api.get('/categories');
                const typesResponse = await api.get('/types');

                setCategories(categoriesResponse.data);
                setTypes(typesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

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
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    const allTransactions = async => {
         window.location.href = '/all-transactions'
    }

    return (
        <div class="transactions_area">

            <div class="latest_transactions">
                <div class="l_transaction_title">
                    <p>Últimas Transações</p>
                    <button onClick={allTransactions}>Ver Todas</button>
                </div>

                <div className="transactions">
                    <div class="date_transaction_group">
                        <p class="p_date">10 de maio, 2025</p>

                        <div className="transaction_card">
                            <div className="tcard_left">
                                <div className="type_circle_g">
                                    <FaArrowTrendUp />
                                </div>
                                <div className="tcontent">
                                    <div className="tcontent_title">Sistema para Loja de Roupa</div>
                                    <div className="tcontent_category">Freelance</div>
                                </div>
                            </div>
                            <div className="tcard_right">
                                <p className="transaction_value_g">+ R$ 1.500,00</p>
                            </div>
                        </div>

                        <div className="transaction_card">
                            <div className="tcard_left">
                                <div className="type_circle_g">
                                    <FaArrowTrendUp />
                                </div>
                                <div className="tcontent">
                                    <div className="tcontent_title">Sistema para Padaria</div>
                                    <div className="tcontent_category">Freelance</div>
                                </div>
                            </div>
                            <div className="tcard_right">
                                <p className="transaction_value_g">+ R$ 1.500,00</p>
                            </div>
                        </div>

                    </div>

                    <div class="date_transaction_group">
                        <p class="p_date">05 de maio, 2025</p>

                        <div className="transaction_card">
                            <div className="tcard_left">
                                <div className="type_circle_r">
                                    <FaArrowTrendDown />
                                </div>
                                <div className="tcontent">
                                    <div className="tcontent_title">Lanche no SENAI</div>
                                    <div className="tcontent_category">Alimentação</div>
                                </div>
                            </div>
                            <div className="tcard_right">
                                <p className="transaction_value_r">- R$ 7,00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="new_transaction">
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
    );
}

export default Transactions;