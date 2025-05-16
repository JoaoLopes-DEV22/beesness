import { useEffect, useState } from 'react';
import '../css/components/Categories.css';
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { MdDelete, MdEdit } from "react-icons/md";
import api from '../api'; // Certifique-se de que você tem a configuração do axios

function Categories() {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        color: '#818B92',
        type: null // Inicialmente nulo
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState(''); // Estado para o filtro
    const itemsPerPage = 6; // Número de categorias por página

    useEffect(() => {
        const fetchCategories = async () => {
            const user = JSON.parse(localStorage.getItem('user')); // Obtém o usuário logado do localStorage
            try {
                const response = await api.get('/categories', {
                    params: { user_id: user.id } // Passa o ID do usuário como parâmetro
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchTypes = async () => {
            try {
                const response = await api.get('/types'); // Supondo que você tenha um endpoint para buscar tipos
                setTypes(response.data);
            } catch (error) {
                console.error("Error fetching types:", error);
            }
        };

        fetchCategories();
        fetchTypes();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFilterChange = (e) => {
        setSelectedType(e.target.value); // Atualiza o estado do filtro
        setCurrentPage(1); // Reseta a página para 1 ao mudar o filtro
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            // Verifica se o tipo está definido
            const selectedType = types.find(type => type.id_type === parseInt(formData.type));

            // Verifica se o tipo foi encontrado
            if (!selectedType) {
                console.error("Tipo não encontrado");
                return; // Retorna se o tipo não for encontrado
            }

            const dataToSend = {
                title_category: formData.title,
                color_category: formData.color,
                fk_type: selectedType.id_type, // Usa o id_type do tipo encontrado
                fk_account: user.id
            };

            await api.post('/categories/store', dataToSend); // Supondo que você tenha um endpoint para adicionar categorias
            setFormData({ title: '', color: '#818B92', type: null }); // Resetar o formulário
            // Recarregar as categorias após adicionar uma nova
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    // Calcular as categorias a serem exibidas na página atual
    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;

    // Filtrar categorias com base no tipo selecionado
    const filteredCategories = selectedType
        ? categories.filter(category => category.fk_type === parseInt(selectedType))
        : categories;

    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    // Calcular o número total de páginas
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    // Funções para navegação
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
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
                                        <div className="content_title" style={{ color: category.color_category }}>{category.title_category}</div>
                                    </div>
                                </div>
                                <div className="card_right">
                                    <div className="category_actions">
                                        <MdEdit className='edit_icon_category' />
                                        <MdDelete className='delete_icon' />
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
                                        value={type.id_type} // Use o id_type como valor
                                        onChange={handleChange}
                                    />
                                    {type.name_type === 'despesa' ? <PiMinusCircleBold className='icon_despesa' /> : <PiPlusCircleBold className='icon_receita' />}
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
                        <p style={{ color: formData.color }}>{formData.title || '...'}</p> {/* Exibe o título e a cor selecionada */}
                    </div>

                    <button type="submit">Adicionar Categoria</button>
                </form>
            </div>
        </div>
    );
}

export default Categories;
