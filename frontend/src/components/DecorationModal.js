import React, { useState, useEffect } from 'react';
import api from '../api'; // Seu arquivo de instância do Axios
import '../css/components/DecorationModal.css'; // Seu CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HiveDecorationModal = ({ isOpen, onClose, selectedSlot, onDecorationEquipped, onDecorationUnequipped }) => {
    const [userDecorations, setUserDecorations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchUserDecorations();
        }
    }, [isOpen]);

    const fetchUserDecorations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/hive-decorations/user-inventory');
            if (response.data.status) {
                setUserDecorations(response.data.data);
            } else {
                setError(response.data.message || 'Erro ao carregar decorações do usuário.');
            }
        } catch (err) {
            console.error('Erro ao buscar decorações do usuário:', err);
            setError('Falha ao carregar decorações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleEquipDecoration = async (hiveDecorationId) => {
        console.log(selectedSlot)
        try {
            const response = await api.put(`/hive-decorations/${hiveDecorationId}/equip/${selectedSlot}`);
            if (response.data.status) {
                toast.success(response.data.message);
                onDecorationEquipped(); // Dispara atualização no componente pai
                fetchUserDecorations(); // Recarrega a lista para atualizar os estados
            } else {
                alert(`Erro ao equipar: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Erro ao equipar decoração:', error);
            alert('Erro ao equipar decoração. Tente novamente.');
        }
    };

    const handleUnequipDecoration = async (hiveDecorationId) => {
        try {
            const response = await api.put(`/hive-decorations/${hiveDecorationId}/unequip/${selectedSlot}`, {
                position_slot: selectedSlot
            });
            if (response.data.status) {
                toast.success(response.data.message);
                onDecorationUnequipped(); // Dispara atualização no componente pai
                fetchUserDecorations(); // Recarrega a lista para atualizar os estados
            } else {
                alert(`Erro ao desequipar: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Erro ao desequipar decoração:', error);
            alert('Erro ao desequipar decoração. Tente novamente.');
        }
    };

    // --- Função para traduzir as posições ---
    const translatePosition = (position) => {
        switch (position) {
            case 'left':
                return 'Esquerda';
            case 'right':
                return 'Direita';
            case 'none': // 'none' para quando não está em nenhuma posição específica
                return 'Desequipada';
            default:
                return position; // Retorna o próprio valor se não for um dos casos esperados
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Traduzindo o selectedSlot no título do modal */}
                <h2>Decorações da Colmeia para slot: {translatePosition(selectedSlot)}</h2>
                <button className="modal-close-button" onClick={onClose}>X</button>

                {loading && <p>Carregando decorações...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && userDecorations.length === 0 && (
                    <p>Você ainda não possui decorações para sua colmeia.</p>
                )}

                <div className="decoration-list">
                    {userDecorations.map((hd) => (
                        <div key={hd.id_hive_decoration} className="decoration-item">
                            <p className='modal-icons'>{hd.decoration.icon_decoration}</p>
                            <div className="decoration-info">
                                <h3>{hd.decoration.name_decoration}</h3>
                                {/* Traduzindo a posição atual da decoração */}
                                <p>Status: {translatePosition(hd.position_hive_decoration)}</p>
                            </div>
                            <div className="decoration-actions">
                                {/* Botão EQUIPAR */}
                                {hd.cosmetic_status.id_cosmetic_status === 2 && ( // 2 = unequipped
                                    <button
                                        className="equip-button"
                                        onClick={() => handleEquipDecoration(hd.id_hive_decoration)}
                                    >
                                        Equipar
                                    </button>
                                )}
                                {/* Botão DESEQUIPAR */}
                                {/* Apenas mostra desequipar se estiver equipado NO SLOT ATUAL do modal */}
                                {hd.cosmetic_status.id_cosmetic_status === 1 && hd.position_hive_decoration === selectedSlot && ( // 1 = equipped
                                    <button
                                        className="unequip-button"
                                        onClick={() => handleUnequipDecoration(hd.id_hive_decoration)}
                                    >
                                        Desequipar
                                    </button>
                                )}
                                {/* Se estiver equipado em OUTRO slot */}
                                {hd.cosmetic_status.id_cosmetic_status === 1 && hd.position_hive_decoration !== selectedSlot && (
                                    <span className="equipped-other-slot">Equipado em {translatePosition(hd.position_hive_decoration)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HiveDecorationModal;