import { useEffect, useState } from 'react';
import '../css/components/Pendences.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import api from '../api';
import { MdEdit, MdDelete, MdClose } from "react-icons/md";

function Pendences() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title_pending: '',
        deadline_pending: '',
        initial_pending: '',
        total_pending: '',
        fk_type: '',
        fk_category: '',
        fk_condition: ''
    });

    const [lastDate, setLastDate] = useState('');
    const [lastPendences, setLastPendences] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPendence, setCurrentPendence] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title_pending: '',
        deadline_pending: '',
        initial_pending: '',
        total_pending: '',
        fk_type: '',
        fk_category: '',
        fk_condition: ''
    });

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

    useEffect(() => {
        const fetchLastPendences = async () => {
            try {
                if (!user?.id) return;

                const response = await api.get('/pendences/last', {
                    params: { user_id: user.id }
                });
                console.log(response)
                setLastDate(response.data.last_date || '');
                setLastPendences(response.data.pendences || []);

            } catch (error) {
                console.error("Error fetching last pendences:", error);
            }
        };

        fetchLastPendences();
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
        }
    };

    const handleEditClick = (pendence) => {
        setCurrentPendence(pendence);
        setEditFormData({
            title_pending: pendence.title_pending,
            deadline_pending: pendence.deadline_pending || '',
            initial_pending: pendence.initial_pending,
            total_pending: pendence.total_pending,
            fk_type: pendence.fk_type,
            fk_category: pendence.fk_category,
            fk_condition: pendence.fk_condition
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });

        if (name === 'fk_type') {
            const selectedType = parseInt(value);
            const filtered = categories.filter(category => category.fk_type === selectedType);
            setFilteredCategories(filtered);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/pendences/${currentPendence.id_pendences}`, editFormData);
            toast.success("Pendência atualizada com sucesso!");

            // Atualiza a lista de pendências
            const response = await api.get('/pendences/last', {
                params: { user_id: user.id }
            });
            setLastDate(response.data.last_date || '');
            setLastPendences(response.data.pendences || []);

            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating pendence:", error);
            toast.error("Erro ao atualizar pendência.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                fk_account: user.id,
                fk_condition: 1
            };

            await api.post('/pendences', dataToSend);
            setFormData({
                title_pending: '',
                initial_pending: '',
                total_pending: '',
                fk_type: '',
                fk_category: '',
                fk_condition: ''
            });
            setFilteredCategories([]);
            toast.success("Pendência adicionada com sucesso!");

            // Atualiza lista de últimas transações após adicionar uma nova
            const response = await api.get('/pendences/last', {
                params: { user_id: user.id }
            });
            setLastDate(response.data.last_date || '');
            setLastPendences(response.data.pendences || []);
            console.log(response)
        } catch (error) {
            console.error("Error adding pendences:", error);
            toast.error("Erro ao adicionar pendência.");
        }
    };

    const allPendences = () => {
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
                            <button onClick={allPendences}>Ver Todas</button>
                        </div>
                    </div>
                    <div className="pendences">
                        {lastPendences.length > 0 ? (
                            lastPendences.map(pendence => (
                                <div key={pendence.id_pendences} className="goal_card">
                                    <div className="gc_top">
                                        <div className="gc_top_left">
                                            <span className={pendence.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                                {pendence.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                            </span>
                                            <div className="gc_top_content">
                                                <p className="gc_title">{pendence.title_pending}</p>
                                                <p className="gc_deadline" style={{textTransform: 'capitalize'}}>{pendence.category.title_category}</p>
                                                <p className="gc_deadline">
                                                    Prazo: {pendence.deadline_pending
                                                        ? new Date(pendence.deadline_pending).toLocaleDateString('pt-BR')
                                                        : 'Sem prazo'}
                                                </p>
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
                                            <div className="progress_bar_total_g">
                                                <div
                                                    className={pendence.fk_type === 1 ? "progress_bar_g" : "progress_bar_g"}
                                                    style={{ width: `${(pendence.initial_pending / pendence.total_pending) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="gc_edit">
                                            <MdEdit className="edit_icon_goal" onClick={() => handleEditClick(pendence)} />
                                            <MdDelete className="delete_icon_goal" />
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
                                />
                            </div>
                            <div className="input_pair">
                                <label htmlFor="">Prazo (opcional)</label>
                                <input
                                    type="date"
                                    name="deadline_pending"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input_group side_by_side">
                            <div className="input_pair">
                                <label htmlFor="">Valor inicial (R$)</label>
                                <input
                                    type="number"
                                    name="initial_pending"
                                    placeholder='0,00'
                                    value={formData.initial_pending}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input_pair">
                                <label htmlFor="">Valor Total (R$)</label>
                                <input
                                    type="number"
                                    name="total_pending"
                                    placeholder='0,00'
                                    value={formData.total_pending}
                                    onChange={handleChange}
                                />
                            </div>
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

                {isEditModalOpen && (
                    <div className="modal-overlay">
                        <div className="edit-modal">
                            <div className="modal-header">
                                <h3>Editar Pendência</h3>
                                <MdClose
                                    className="close-icon"
                                    onClick={() => setIsEditModalOpen(false)}
                                />
                            </div>
                            <form onSubmit={handleEditSubmit} className="form_pendence">
                                <div className="input_group">
                                    <label>Tipo de pendências</label>
                                    <div className="radios_area">
                                        {types.map(type => (
                                            <div key={type.id_type} className='radio_item'>
                                                <input
                                                    type="radio"
                                                    name="fk_type"
                                                    value={type.id_type}
                                                    checked={editFormData.fk_type == type.id_type}
                                                    onChange={handleEditChange}
                                                />
                                                {type.id_type === 1 ?
                                                    <PiPlusCircleBold className='icon_receita' /> :
                                                    <PiMinusCircleBold className='icon_despesa' />}
                                                <label>{type.name_type}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="input_group side_by_side">
                                    <div className="input_pair">
                                        <label>Título</label>
                                        <input
                                            type="text"
                                            name="title_pending"
                                            value={editFormData.title_pending}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="input_pair">
                                        <label>Prazo (opcional)</label>
                                        <input
                                            type="date"
                                            name="deadline_pending"
                                            value={editFormData.deadline_pending}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                </div>
                                <div className="input_group side_by_side">
                                    <div className="input_pair">
                                        <label>Valor inicial (R$)</label>
                                        <input
                                            type="number"
                                            name="initial_pending"
                                            value={editFormData.initial_pending}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="input_pair">
                                        <label>Valor Total (R$)</label>
                                        <input
                                            type="number"
                                            name="total_pending"
                                            value={editFormData.total_pending}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                </div>
                                <div className="input_group">
                                    <label>Categoria</label>
                                    <select
                                        name="fk_category"
                                        value={editFormData.fk_category}
                                        onChange={handleEditChange}
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
                                    <label>Status</label>
                                    <select
                                        name="fk_condition"
                                        value={editFormData.fk_condition}
                                        onChange={handleEditChange}
                                    >
                                        <option value={1}>Pendente</option>
                                        <option value={2}>Concluído</option>
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
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