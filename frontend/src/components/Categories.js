import { useEffect, useState } from 'react';
import '../css/components/Categories.css';
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { MdDelete, MdEdit, MdWarning } from "react-icons/md";
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        color: '#818B92',
        type: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        color: '#818B92',
        type: null
    });
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            try {
                const [categoriesRes, typesRes] = await Promise.all([
                    api.get('/categories', { params: { user_id: user.id } }),
                    api.get('/types')
                ]);
                setCategories(categoriesRes.data);
                setTypes(typesRes.data);
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
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleFilterChange = (e) => {
        setSelectedType(e.target.value);
        setCurrentPage(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const selectedType = types.find(type => type.id_type === parseInt(formData.type));
            if (!selectedType) {
                console.error("Tipo não encontrado");
                return;
            }

            const dataToSend = {
                title_category: formData.title,
                color_category: formData.color,
                fk_type: selectedType.id_type,
                fk_account: user.id
            };

            await api.post('/categories/store', dataToSend);
            setFormData({ title: '', color: '#818B92', type: null });

            // Atualiza a lista de categorias
            const response = await api.get('/categories', { params: { user_id: user.id } });
            setCategories(response.data);

            toast.success("Categoria criada com sucesso!");
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Erro ao criar categoria");
        }
    };

    const openEditModal = async (category) => {
        try {
            const response = await api.get(`/categories/${category.id_category}`);
            setCurrentCategory(response.data);
            setEditFormData({
                title: response.data.title_category,
                color: response.data.color_category,
                type: response.data.fk_type.toString()
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching category details:", error);
            toast.error("Erro ao carregar dados da categoria");
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                title_category: editFormData.title,
                color_category: editFormData.color,
                fk_type: parseInt(editFormData.type)
            };

            await api.put(`/categories/${currentCategory.id_category}`, dataToSend);

            // Atualiza a lista de categorias
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await api.get('/categories', { params: { user_id: user.id } });
            setCategories(response.data);

            toast.success("Categoria atualizada com sucesso!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Erro ao atualizar categoria");
        }
    };

    // Adicione estas funções no seu componente Categories
    const handleDeleteCategory = async (categoryId) => {
        toast.warning(
            <div className="custom-toast-content">
                <div className="toast-header">
                    <MdWarning className="toast-warning-icon" />
                    <span className="toast-title">Confirmar exclusão</span>
                </div>
                <p className="toast-message">Tem certeza que deseja excluir esta categoria?</p>
                <div className="confirm-toast-buttons">
                    <button
                        className="confirm-toast-button confirm"
                        onClick={() => {
                            toast.dismiss();
                            confirmDeleteCategory(categoryId);
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

    const confirmDeleteCategory = async (categoryId) => {
        try {
            await api.delete(`/categories/${categoryId}`);

            // Atualiza a lista de categorias
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await api.get('/categories', { params: { user_id: user.id } });
            setCategories(response.data);

            toast.success("Categoria excluída com sucesso!");
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Erro ao excluir categoria");
        }
    };

    // Filtragem e paginação (mantido igual)
    const filteredCategories = selectedType
        ? categories.filter(category => category.fk_type === parseInt(selectedType))
        : categories;

    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <div className="categories_area">
                <div className="categories_list">
                    <div className="categories_title">
                        <p>Categorias</p>
                        <div className='categories_filter'>
                            <label htmlFor="">Filtro:</label>
                            <select value={selectedType} onChange={handleFilterChange}>
                                <option value="">Selecione um tipo</option>
                                {types.map(type => (
                                    <option key={type.id_type} value={type.id_type}>
                                        {type.name_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="categories">
                        <div className="category_cards">
                            {currentCategories.map(category => (
                                <div key={category.id_category} className="category_card">
                                    <div className="card_left">
                                        <div className={category.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                            {category.fk_type === 1 ? <PiPlusCircleBold /> : <PiMinusCircleBold />}
                                        </div>
                                        <div className="content">
                                            <div className="content_title" style={{ color: category.color_category }}>
                                                {category.title_category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card_right">
                                        <div className="category_actions">
                                            <MdEdit
                                                className='edit_icon_category'
                                                onClick={() => openEditModal(category)}
                                            />
                                            <MdDelete
                                                className='delete_icon'
                                                onClick={() => handleDeleteCategory(category.id_category)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button onClick={nextPage} disabled={currentPage === totalPages}>Próximo</button>
                        </div>
                    </div>
                </div>

                <div className="new_category">
                    <p>Nova Categoria</p>
                    <form onSubmit={handleSubmit} className="form_category">
                        <div className="input_group">
                            <label htmlFor="">Tipo de categoria</label>
                            <div className="radios_area">
                                {types.map(type => (
                                    <div key={type.id_type} className='radio_item'>
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type.id_type}
                                            onChange={handleChange}
                                            checked={formData.type == type.id_type}
                                        />
                                        {type.name_type === 'despesa' ?
                                            <PiMinusCircleBold className='icon_despesa' /> :
                                            <PiPlusCircleBold className='icon_receita' />}
                                        <label>{type.name_type}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Título</label>
                            <input
                                type="text"
                                name="title"
                                placeholder='Nomeie a categoria'
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Cor</label>
                            <input
                                id='input_color'
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Exibição</label>
                            <p style={{ color: formData.color }}>{formData.title || '...'}</p>
                        </div>

                        <button type="submit">Adicionar Categoria</button>
                    </form>
                </div>

                {/* Modal de Edição */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Editar Categoria</h2>
                                <button
                                    className="close-modal"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleUpdateCategory} className="form_category">
                                <div className="input_group">
                                    <label htmlFor="">Tipo de categoria</label>
                                    <div className="radios_area">
                                        {types.map(type => (
                                            <div key={type.id_type} className='radio_item'>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={type.id_type}
                                                    onChange={handleEditChange}
                                                    checked={editFormData.type == type.id_type}
                                                />
                                                {type.name_type === 'despesa' ?
                                                    <PiMinusCircleBold className='icon_despesa' /> :
                                                    <PiPlusCircleBold className='icon_receita' />}
                                                <label>{type.name_type}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="input_group">
                                    <label htmlFor="">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder='Nomeie a categoria'
                                        value={editFormData.title}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="input_group">
                                    <label htmlFor="">Cor</label>
                                    <input
                                        id='input_color'
                                        type="color"
                                        name="color"
                                        value={editFormData.color}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="input_group">
                                    <label htmlFor="">Exibição</label>
                                    <p style={{ color: editFormData.color }}>{editFormData.title || '...'}</p>
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

export default Categories;