import { useState, useEffect } from 'react';
import '../css/components/AccountData.css'
import api from '../api'; // Certifique-se de que você tem a configuração do axios

function AccountData({ selectedMonth }) {

    const [receitas, setReceitas] = useState(0);
    const [despesas, setDespesas] = useState(0);
    const [saldo, setSaldo] = useState(0);
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await api.get('/transactions/monthly', {
                    params: {
                        user_id: user.id,
                        month: selectedMonth
                    }
                });
                const transactions = response.data.transactions;
                const totalReceitas = transactions
                    .filter(transaction => transaction.fk_type === 1) // Receita
                    .reduce((acc, transaction) => acc + parseFloat(transaction.value_transaction), 0);
                const totalDespesas = transactions
                    .filter(transaction => transaction.fk_type === 2) // Despesa
                    .reduce((acc, transaction) => acc + parseFloat(transaction.value_transaction), 0);
                setReceitas(totalReceitas);
                setDespesas(totalDespesas);
                setSaldo(totalReceitas - totalDespesas);
            } catch (error) {
                console.error("Error fetching account data:", error);
            }
        };
        fetchAccountData();
    }, [selectedMonth]); // Reexecuta quando o mês selecionado mudar

    return (
        <div className="financial_cards">
            <div className="card">
                <p className="title_card">Receitas</p>
                <p className="value_card_g">R$ {receitas.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="card">
                <p className="title_card">Despesas</p>
                <p className="value_card_r">R$ {despesas.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="card" id="balance">
                <div className="t_card_group">
                    <p className="title_card">Saldo</p>
                    <div className="switch_filter">
                        <p className="on">Mensal</p>
                        <p className="off">Total</p>
                    </div>
                </div>
                <p className="value_card_g">R$ {saldo.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    );
}

export default AccountData;