import { useEffect, useState } from 'react';
import '../css/components/Pendences.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { ToastContainer, toast } from 'react-toastify';
import api from '../api';

function Pendences() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title_pending: '',
        deadline_pending: '',
        initial_pending: 0,
        total_pending: '',
        fk_type: '',
        fk_category: '',
        fk_condition: ''
    });

    const [nearestDate, setNearestDate] = useState('');
    const [pendences, setPendences] = useState([]);

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
    }, [user?.id]);

    useEffect(() => {
        const fetchNearestPendences = async () => {
            try {
                if (!user?.id) return;

                const response = await api.get('/pendences/nearest', {
                    params: { user_id: user.id }
                });
                setNearestDate(response.data.nearest_date || '');
                setPendences(response.data.pendences || []);
            } catch (error) {
                console.error("Error fetching nearest pendences:", error);
            }
        };

        fetchNearestPendences();
    }, [user?.id]);

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
            setFormData(prev => ({
                ...prev,
                fk_category: '' // Reset category when type changes
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                fk_account: user.id,
                fk_condition: 1 // Assuming 1 is 'Pendente' by default
            };

            await api.post('/pendences', dataToSend);
            setFormData({
                title_pending: '',
                deadline_pending: '',
                initial_pending: 0,
                total_pending: '',
                fk_type: '',
                fk_category: '',
                fk_condition: ''
            });
            setFilteredCategories([]); // Reset filtered categories
            toast.success("Pendência adicionada com sucesso!");

            // Atualiza lista de pendências da data mais próxima após adicionar uma nova
            const response = await api.get('/pendences/nearest', {
                params: { user_id: user.id }
            });
            setNearestDate(response.data.nearest_date || '');
            setPendences(response.data.pendences || []);
        } catch (error) {
            console.error("Error adding pendences:", error);
            toast.error("Erro ao adicionar pendência.");
        }
    };

    const allPendences = () => {
        window.location.href = '/all-pendences';
    }

    return (
        <div>
            <div className="pendences_area">
                <div className="latest_pendences">
                    <div className="l_pendence_title">
                        <p>Pendências mais Próximas</p>
                        <div className='pendences_date_btn'>
                            <div className="input_date_filter">
                                <p id='deadline_p'>Prazo:</p>
                                <input id='deadline_input' type="date" readOnly value={nearestDate} />
                            </div>
                            <button onClick={allPendences}>Ver Todas</button>
                        </div>
                    </div>
                    <div className="pendences">
                        {pendences.length > 0 ? (
                            pendences.map(pendence => (
                                <div key={pendence.id_pendences} className="pendence_card">
                                    <div className="gc_top">
                                        <div className="gc_top_left">
                                            <span className={pendence.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                                {pendence.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                            </span>
                                            <div className="gc_top_content">
                                                <p className="pc_title">{pendence.title_pending}</p>
                                                <div className="subtitle">
                                                    <p className="pc_deadline" style={{ textTransform: 'capitalize' }}>{pendence.category.title_category}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gc_condition_area">
                                            <span className={`gc_condition ${pendence.fk_condition == 1 ? 'status-pending' : 'status-completed'}`}>
                                                {pendence.fk_condition == 1 ? 'Pendente' : 'Concluído'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="gc_bottom">
                                        <div className="progress_area">
                                            <div className="progress_content">
                                                <p>Progresso</p>
                                                <p>
                                                    R$ {parseFloat(pendence.initial_pending).toFixed(2).replace('.', ',')} /
                                                    R$ {parseFloat(pendence.total_pending).toFixed(2).replace('.', ',')}
                                                </p>
                                            </div>
                                            <div className="progress_bar_total_p">
                                                <div
                                                    className="progress_bar_g"
                                                    style={{ width: `${(pendence.initial_pending / pendence.total_pending) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
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
                                            checked={formData.fk_type == type.id_type}
                                            required
                                        />
                                        {type.id_type === 1 ? <PiPlusCircleBold className='icon_receita' /> : <PiMinusCircleBold className='icon_despesa' />}
                                        <label>{type.name_type}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="input_group side_by_side">
                            <div className="input_pair">
                                <label htmlFor="">Título</label>
                                <input
                                    type="text"
                                    name="title_pending"
                                    placeholder='Nomeie a pendência'
                                    value={formData.title_pending}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input_pair">
                                <label htmlFor="">Prazo (opcional)</label>
                                <input
                                    type="date"
                                    name="deadline_pending"
                                    value={formData.deadline_pending}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input_group side_by_side">
                            <div className="input_pair">
                                <label htmlFor="">Valor Total (R$)</label>
                                <input
                                    type="number"
                                    name="total_pending"
                                    placeholder='0,00'
                                    value={formData.total_pending}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                />
                            </div>
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
