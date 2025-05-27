import { useEffect, useState } from 'react';
import '../css/components/Pendences.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import api from '../api';

function Pendences() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title_pendences: '',
        value_pendences: '',
        fk_type: '',
        fk_category: ''
    });

    // Novos estados para transações e data das últimas transações
    const [lastDate, setLastDate] = useState('');
    const [lastpendences, setLastpendences] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await api.get('/categories', {
                    params: { user_id: user.id }
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
        const fetchLastpendences = async () => {
            try {
                if (!user?.id) return; // evita erro se não tiver user

                const response = await api.get('/pendences/last', {
                    params: { user_id: user.id }
                });

                setLastDate(response.data.last_date || '');
                setLastpendences(response.data.pendences || []);

            } catch (error) {
                console.error("Error fetching last pendences:", error);
            }
        };

        fetchLastpendences();
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
            await api.post('/pendences', dataToSend);
            setFormData({
                title_pendences: '',
                value_pendences: '',
                fk_type: '',
                fk_category: '',
            });
            setFilteredCategories([]);
            toast.success("Pendência adicionada com sucesso!");

            // Atualiza lista de últimas transações após adicionar uma nova
            const response = await api.get('/pendences/last', {
                params: { user_id: user.id }
            });
            setLastDate(response.data.last_date || '');
            setLastpendences(response.data.pendences || []);

        } catch (error) {
            console.error("Error adding pendences:", error);
            toast.error("Erro ao adicionar pendência.");
        }
    };

    const allpendences = () => {
        window.location.href = '/all-pendences'
    }

    return (
        <div>
            <div className="pendences_area">
                <div className="latest_pendences">
                    <div className="l_pendence_title">
                        <p>Últimas Pendências</p>
                        <div className='pendences_date_btn'>
                            <input type="date" readOnly value={lastDate} />
                            <button onClick={allpendences}>Ver Todas</button>
                        </div>
                    </div>
                    <div className="pendences">
                        {lastpendences.length > 0 ? (
                            lastpendences.map(pendences => (
                                <div key={pendences.id_pendences} className="pendences_card">
                                    <div className="tcard_left">
                                        <div className={pendences.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                            {pendences.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                        </div>
                                        <div className="tcontent">
                                            <div className="tcontent_title">{pendences.title_pendences}</div>
                                            <div className="tcontent_category" style={{ color: pendences.category.color_category }}>{pendences.category?.title_category || 'Categoria'}</div>
                                        </div>
                                    </div>
                                    <div className="tcard_right">
                                        <p className={pendences.fk_type === 1 ? "pendences_value_g" : "pendences_value_r"}>
                                            {pendences.fk_type === 1 ? '+' : '-'} R$ {parseFloat(pendences.value_pendences).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Sem pendências para exibir.</p>
                        )}
                    </div>


                </div>

                <div className="new_pendence">
                    <p>Nova Pendência</p>
                    <form onSubmit={handleSubmit} className="form_pendence">
                        <div className="input_group">
                            <label htmlFor="">Tipo de pendências</label>
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
                                name="title_pendences"
                                placeholder=' Nomeie a pendência'
                                value={formData.title_pendences}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Valor (R$)</label>
                            <input
                                type="number"
                                name="value_pendences"
                                placeholder='0,00'
                                value={formData.value_pendences}
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

                        <button type="submit">Adicionar Pendência</button>
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

export default Pendences;