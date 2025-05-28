import '../css/components/Goals.css'
import { MdEdit, MdDelete } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Goals() {
    return (
        <div className="div">

            <div className="title_area_goals">
                <h1 id='h1_title'>Metas</h1>

                <div className="filters_area_goals">
                    <select name="" id="">
                        <option value="">Selecione um status</option>
                        <option value="">Pendente</option>
                        <option value="">Concluído</option>
                    </select>
                    <select name="" id="">
                        <option value="">Ordene por prazo</option>
                        <option value="">Prazo menor pro maior</option>
                        <option value="">Prazo maior pro menor</option>
                    </select>
                </div>
            </div>

            <div className='goals_component'>


                <div className="goals_area">


                    <div className="goals">


                        <div className="goal_card">
                            <div className="gc_top">
                                <div className="gc_top_left">
                                    <span className='type_circle_g'><FaCheck /></span>
                                    <div className="gc_top_content">
                                        <p className="gc_title">Economizar pra tênis</p>
                                        <p className='gc_deadline'>Prazo: 28/05/2025</p>
                                    </div>
                                </div>
                                <div className="gc_condition_area">
                                    <span className="gc_condition_c">Concluído</span>
                                </div>
                            </div>
                            <div className="gc_bottom">
                                <div className="progress_area">
                                    <div className="progress_content">
                                        <p>Progresso</p>
                                        <p>R$ 500,00 / R$ 500,00</p>
                                    </div>
                                    <div className="progress_bar_total_g">
                                        <div
                                            className="progress_bar_g"
                                            style={{ width: '100%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="gc_edit">
                                    <MdEdit className='edit_icon_goal' />
                                    <MdDelete className='delete_icon_goal'/>
                                </div>
                            </div>
                        </div>

                        <div className="goal_card">
                            <div className="gc_top">
                                <div className="gc_top_left">
                                    <span className='circle_p'><TbTargetArrow /></span>
                                    <div className="gc_top_content">
                                        <p className="gc_title">Economizar pra tênis</p>
                                        <p className='gc_deadline'>Prazo: 28/05/2025</p>
                                    </div>
                                </div>
                                <div className="gc_condition_area">
                                    <span className="gc_condition">Pendente</span>
                                </div>
                            </div>
                            <div className="gc_bottom">
                                <div className="progress_area">
                                    <div className="progress_content">
                                        <p>Progresso</p>
                                        <p>R$ 250,00 / R$ 500,00</p>
                                    </div>
                                    <div className="progress_bar_total_g">
                                        <div
                                            className="progress_bar_g"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="gc_edit">
                                    <MdEdit className='edit_icon_goal' />
                                    <MdDelete className='delete_icon_goal'/>
                                </div>
                            </div>
                        </div>

                        <div className="goal_card">
                            <div className="gc_top">
                                <div className="gc_top_left">
                                    <span className='circle_p'><TbTargetArrow /></span>
                                    <div className="gc_top_content">
                                        <p className="gc_title">Economizar pra tênis</p>
                                        <p className='gc_deadline'>Prazo: 28/05/2025</p>
                                    </div>
                                </div>
                                <div className="gc_condition_area">
                                    <span className="gc_condition">Pendente</span>
                                </div>
                            </div>
                            <div className="gc_bottom">
                                <div className="progress_area">
                                    <div className="progress_content">
                                        <p>Progresso</p>
                                        <p>R$ 250,00 / R$ 500,00</p>
                                    </div>
                                    <div className="progress_bar_total_g">
                                        <div
                                            className="progress_bar_g"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="gc_edit">
                                    <MdEdit className='edit_icon_goal' />
                                    <MdDelete className='delete_icon_goal'/>
                                </div>
                            </div>
                        </div>

                        <div className="goal_card">
                            <div className="gc_top">
                                <div className="gc_top_left">
                                    <span className='circle_p'><TbTargetArrow /></span>
                                    <div className="gc_top_content">
                                        <p className="gc_title">Economizar pra tênis</p>
                                        <p className='gc_deadline'>Prazo: 28/05/2025</p>
                                    </div>
                                </div>
                                <div className="gc_condition_area">
                                    <span className="gc_condition">Pendente</span>
                                </div>
                            </div>
                            <div className="gc_bottom">
                                <div className="progress_area">
                                    <div className="progress_content">
                                        <p>Progresso</p>
                                        <p>R$ 250,00 / R$ 500,00</p>
                                    </div>
                                    <div className="progress_bar_total_g">
                                        <div
                                            className="progress_bar_g"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="gc_edit">
                                    <MdEdit className='edit_icon_goal' />
                                    <MdDelete className='delete_icon_goal'/>
                                </div>
                            </div>
                        </div>



                    </div>

                    <div className="pagination_goals">
                        <IoIosArrowBack className="arrow arrow_first" />
                        <div className="pagination_item selected">
                            <p>1</p>
                        </div>
                        <div className="pagination_item">
                            <p>2</p>
                        </div>
                        <div className="pagination_item">
                            <p>3</p>
                        </div>
                        <div className="pagination_item">
                            <p>4</p>
                        </div>
                        <div className="pagination_item">
                            <p>5</p>
                        </div>
                        <IoIosArrowForward className="arrow arrow_last" />
                    </div>

                </div>


                <div className="new_goal">
                    <p>Nova Meta</p>
                    <form action="" className="form_goal">
                        <div className="input_group">
                            <label htmlFor="">Título</label>
                            <input
                                type="text"
                                name="title_goal"
                                placeholder='Nomeie a meta'
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Valor Alvo (R$)</label>
                            <input
                                type="number"
                                name="target_goal"
                                placeholder='0,00'
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="">Prazo (opcional)</label>
                            <input type="date" name="deadline_goal" id="deadline_goal" />
                        </div>

                        <button type="submit">Adicionar Meta</button>
                    </form>
                </div>


            </div>
        </div>
    );
}

export default Goals;