import '../css/components/SavingsCard.css'
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { MdEdit } from "react-icons/md";

function SavingsCard() {
    return (
        <div className="savings_card">
            <div className="savings_balance">
                <p className='title_card'>Saldo da Poupança</p>
                <p className='value_card_g'>R$ 0,00</p>
            </div>
            <div className="savings_transactions">
                <div className="radios_area">
                    <div className="radio_item">
                        <input type="radio" name="type_savings_transaction" id="" />
                        <PiPlusCircleBold className='icon_receita' />
                        <label htmlFor="">aplicar</label>
                    </div>
                    <div className="radio_item">
                        <input type="radio" name="type_savings_transaction" id="" />
                        <PiMinusCircleBold className='icon_despesa' />
                        <label htmlFor="">resgatar</label>
                    </div>
                </div>
                <form action="" className="form_savings">
                    <input type="number" name="" id="" placeholder='0,00'/>
                    <button>Salvar</button>
                </form>
            </div>
            <div className="savings_start_date">
                <p className='title_card'>Data de Início</p>
                <p className='value_card_b'>00/00/0000</p>
            </div>
            <div className="savings_tax">
                <p className='title_card'>Rendimento</p>
                <p className='value_card_g'>0% ao Mês</p>
            </div>
            <div className="savings_edit">
                <MdEdit
                    className='edit_icon_savings'
                />
            </div>
        </div>
    );
}

export default SavingsCard;