import { useState } from 'react';
import '../css/components/AccountData.css'

function AccountData() {

    const [isMonthly, setIsMonthly] = useState(true);

    const toggleSwitch = () => {
        setIsMonthly(!isMonthly);
    };

    return (
        <div class="financial_cards">
            <div class="card">
                <p class="title_card">Receitas</p>
                <p class="value_card_g">R$ 17.050,63</p>
            </div>
            <div class="card">
                <p class="title_card">Despesas</p>
                <p class="value_card_r">R$ 10.000,00</p>
            </div>
            <div class="card" id='balance'>
                <div class="t_card_group">
                    <p class="title_card">Saldo</p>
                    <div className='card-data-account'>
                        <div className="t_card_group-dash">
                            <div className="switch_filter-account">
                                <p className={isMonthly ? 'off-dash' : 'on-dash'} onClick={toggleSwitch}>Mensal</p>
                                <p className={isMonthly ? 'on-dash' : 'off-dash'} onClick={toggleSwitch}>Total</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="value_card_g">R$ 7.050,63</p>
            </div>
        </div>
    );
}

export default AccountData;