import '../css/components/SavingsCard.css';
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

function SavingsCard() {
    const [savingsData, setSavingsData] = useState({
        balance: 0,
        startDate: '00/00/0000',
        tax: 0,
        savingsId: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentAccountId, setCurrentAccountId] = useState(null);
    const [transactionData, setTransactionData] = useState({
        value: '',
        type: null
    });

    useEffect(() => {
        const loadAccountInfoFromLocalStorage = () => {
            try {
                const userDataString = localStorage.getItem('user');
                if (!userDataString) {
                    setError("Dados do usuário não encontrados no localStorage.");
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userDataString);
                const accountIdFromStorage = userData?.account?.id_account;

                if (!accountIdFromStorage) {
                    setError("ID da conta não encontrado.");
                    setLoading(false);
                    return;
                }

                setCurrentAccountId(accountIdFromStorage);
            } catch (err) {
                console.error("Erro ao ler dados do usuário:", err);
                setError('Erro ao processar dados do usuário.');
                setLoading(false);
            }
        };

        loadAccountInfoFromLocalStorage();
    }, []);

    useEffect(() => {
        const fetchSavingsData = async () => {
            if (!currentAccountId) return;

            try {
                setLoading(true);
                setError(null);

                // Busca dados da poupança
                const savingsResponse = await api.get(`/savings/account/${currentAccountId}`);
                const savings = savingsResponse.data;

                if (!savings || !savings.id_savings) {
                    setError("Nenhuma poupança encontrada para esta conta.");
                    setLoading(false);
                    return;
                }

                // Busca primeira transação
                const transactionsResponse = await api.get(`/savings/${savings.id_savings}/transactions`, {
                    params: { sort: 'created_at', order: 'asc', limit: 1 }
                });

                const firstTransaction = transactionsResponse.data[0] || null;

                // Formata dados
                setSavingsData({
                    balance: savings.balance_savings.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    startDate: firstTransaction
                        ? new Date(firstTransaction.created_at).toLocaleDateString('pt-BR')
                        : '--/--/----',
                    tax: `${savings.tax_savings}% ao Mês`,
                    savingsId: savings.id_savings
                });

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError('Erro ao carregar dados da poupança.');
            } finally {
                setLoading(false);
            }
        };

        fetchSavingsData();
    }, [currentAccountId]);

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();

        if (!transactionData.value || !transactionData.type) {
            toast.error('Preencha todos os campos!');
            return;
        }

        try {
            // Cria a nova transação
            const response = await api.post('/savings/transactions', {
                value_savings_transaction: parseFloat(transactionData.value),
                fk_type_savings: transactionData.type,
                fk_savings: savingsData.savingsId
            });

            // Atualiza os valores da conta e poupança
            await api.post(`/accounts/${currentAccountId}/update-values`);

            // Atualiza os dados exibidos
            const savingsResponse = await api.get(`/savings/account/${currentAccountId}`);
            const updatedSavings = savingsResponse.data;

            setSavingsData(prev => ({
                ...prev,
                balance: updatedSavings.balance_savings.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }));

            // Limpa o formulário
            setTransactionData({
                value: '',
                type: null
            });

            toast.success('Transação registrada com sucesso!');

        } catch (err) {
            console.error("Erro ao criar transação:", err);
            toast.error('Erro ao registrar transação.');
        }
    };

    if (loading) {
        return <div className="savings_card loading">Carregando dados da poupança...</div>;
    }

    if (error) {
        return <div className="savings_card error">{error}</div>;
    }

    return (
        <div className="savings_card">
            <div className="saldo_receita_area">
                <div className="savings_balance">
                    <p className='title_card'>Saldo da Poupança</p>
                    <p className='value_card_g'>R$ {savingsData.balance}</p>
                </div>

                <div className="savings_transactions">
                    <div className="radios_area">
                        <div className="radio_item">
                            <input
                                type="radio"
                                name="type_savings_transaction"
                                id="apply"
                                checked={transactionData.type === 1}
                                onChange={() => setTransactionData({ ...transactionData, type: 1 })}
                            />
                            <PiPlusCircleBold className='icon_receita' />
                            <label htmlFor="apply">aplicar</label>
                        </div>
                        <div className="radio_item">
                            <input
                                type="radio"
                                name="type_savings_transaction"
                                id="withdraw"
                                checked={transactionData.type === 2}
                                onChange={() => setTransactionData({ ...transactionData, type: 2 })}
                            />
                            <PiMinusCircleBold className='icon_despesa' />
                            <label htmlFor="withdraw">resgatar</label>
                        </div>
                    </div>
                    <form className="form_savings" onSubmit={handleTransactionSubmit}>
                        <input
                            type="number"
                            placeholder='0,00'
                            value={transactionData.value}
                            onChange={(e) => setTransactionData({ ...transactionData, value: e.target.value })}
                            step="0.01"
                            min="0.01"
                        />
                        <button type="submit">Salvar</button>
                    </form>
                </div>
            </div>

            <div className="dataInicio_rendimento_area">
                <div className="savings_start_date">
                    <p className='title_card'>Data de Início</p>
                    <p className='value_card_b'>{savingsData.startDate}</p>
                </div>

                <div className="rendimento_lapis_area">
                    <div className="savings_tax">
                        <p className='title_card'>Rendimento</p>
                        <p className='value_card_g'>{savingsData.tax}</p>
                    </div>

                    <div className="savings_edit">
                        <MdEdit className='edit_icon_savings' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SavingsCard;