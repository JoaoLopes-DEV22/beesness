import '../css/components/Categories.css'
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { MdDelete, MdEdit } from "react-icons/md";

function Categories() {
    return (
        <div class="categories_area">

            <div class="categories_list">
                <div class="categories_title">
                    <p>Categorias</p>
                    <div className='categories_filter'>
                        <label htmlFor="">Filtro:</label>
                        <select name="" id="">
                            <option value="">Selecione um tipo</option>
                        </select>
                    </div>
                </div>

                <div className="categories">
                    <div class="category_cards">

                        <div className="category_card">
                            <div className="card_left">
                                <div className="type_circle_r">
                                    <PiMinusCircleBold />
                                </div>
                                <div className="content">
                                    <div className="content_title">Alimentação</div>
                                </div>
                            </div>
                            <div className="card_right">
                                <div className="category_actions">
                                    <MdEdit className='edit_icon'/>
                                    <MdDelete className='delete_icon'/>
                                </div>
                            </div>
                        </div>

                        <div className="category_card">
                            <div className="card_left">
                                <div className="type_circle_r">
                                    <PiMinusCircleBold />
                                </div>
                                <div className="content">
                                    <div className="content_title">Educação</div>
                                </div>
                            </div>
                            <div className="card_right">
                                <div className="category_actions">
                                    <MdEdit className='edit_icon'/>
                                    <MdDelete className='delete_icon'/>
                                </div>
                            </div>
                        </div>

                        <div className="category_card">
                            <div className="card_left">
                                <div className="type_circle_g">
                                    <PiPlusCircleBold />
                                </div>
                                <div className="content">
                                    <div className="content_title">Freelance</div>
                                </div>
                            </div>
                            <div className="card_right">
                                <div className="category_actions">
                                    <MdEdit className='edit_icon'/>
                                    <MdDelete className='delete_icon'/>
                                </div>
                            </div>
                        </div>

                        <div className="category_card">
                            <div className="card_left">
                                <div className="type_circle_g">
                                    <PiPlusCircleBold />
                                </div>
                                <div className="content">
                                    <div className="content_title">Salário</div>
                                </div>
                            </div>
                            <div className="card_right">
                                <div className="category_actions">
                                    <MdEdit className='edit_icon'/>
                                    <MdDelete className='delete_icon'/>
                                </div>
                            </div>
                        </div>

                        <div className="category_card">
                            <div className="card_left">
                                <div className="type_circle_r">
                                    <PiMinusCircleBold />
                                </div>
                                <div className="content">
                                    <div className="content_title">Saúde</div>
                                </div>
                            </div>
                            <div className="card_right">
                                <div className="category_actions">
                                    <MdEdit className='edit_icon'/>
                                    <MdDelete className='delete_icon'/>
                                </div>
                            </div>
                        </div>

                        <div className="category_card">
                            <div className="card_left">
                                <div className="type_circle_r">
                                    <PiMinusCircleBold />
                                </div>
                                <div className="content">
                                    <div className="content_title">Transporte</div>
                                </div>
                            </div>
                            <div className="card_right">
                                <div className="category_actions">
                                    <MdEdit className='edit_icon'/>
                                    <MdDelete className='delete_icon'/>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <div class="new_category">
                <p>Nova Categoria</p>
                <form action="" className="form_category">
                    <div className="input_group">
                        <label htmlFor="">Tipo de categoria</label>
                        <div className="radios_area">
                            <input type="radio" name="type" id="type" />
                            <PiMinusCircleBold className='icon_despesa' />
                            <label htmlFor="type">Despesa</label>
                            <input type="radio" name="type" id="type" />
                            <PiPlusCircleBold className='icon_receita' />
                            <label htmlFor="type">Receita</label>
                        </div>
                    </div>
                    <div className="input_group">
                        <label htmlFor="">Título</label>
                        <input type="text" name="" id="" placeholder='Nomeie a categoria' />
                    </div>
                    <div className="input_group">
                        <label htmlFor="">Cor</label>
                        <input type="color" name="" id="input_color" />
                    </div>
                    <div className="input_group">
                        <label htmlFor="">Exibição</label>
                        <p>...</p>
                    </div>

                    <button type="submit">Adicionar Categoria</button>
                </form>
            </div>

        </div>
    );
}

export default Categories;