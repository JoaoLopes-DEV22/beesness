import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/pages/AllPendences.css';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";

function AllPendences() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [allPendences, setAllPendences] = useState([]); // original fetched pendences
    const [groupedPendences, setGroupedPendences] = useState({}); // filtered & grouped for display
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return today.toISOString().slice(0, 7);
    });
    const [nearestMonth, setNearestMonth] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Fetch pendences from API by month
    const fetchPendences = async (month) => {
        try {
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const response = await api.get('/pendences/monthly', {
                params: { user_id: userId, month }
            });

            const pendings = response.data.pendings || [];

            if (pendings.length > 0) {
                // Sort by deadline_pending ascending
                pendings.sort((a, b) => new Date(a.deadline_pending) - new Date(b.deadline_pending));
                setAllPendences(pendings);
                setNearestMonth(null);
            } else {
                setAllPendences([]);
                // fetch nearest month with pendences
                const nearestResp = await api.get('/pendences/nearest', {
                    params: { user_id: userId }
                });
                let nearestDate = nearestResp.data.nearest_date;
                if (nearestDate) {
                    const nearestDateObj = new Date(nearestDate);
                    const monthName = nearestDateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                    setNearestMonth(monthName);
                } else {
                    setNearestMonth(null);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar pendências:', error);
            toast.error('Erro ao carregar pendências');
        }
    };

    // Filter and group pendences whenever allPendences or filters change
    useEffect(() => {
        const filtered = allPendences.filter(p => {
            // Filter by type
            if (filters.type && parseInt(filters.type) !== p.fk_type) {
                return false;
            }
            // Filter by status
            if (filters.status && parseInt(filters.status) !== p.fk_condition) {
                return false;
            }
            // Filter by startDate
            if (filters.startDate) {
                const pendenceDate = new Date(p.deadline_pending);
                const startDate = new Date(filters.startDate);
                if (pendenceDate < startDate) return false;
            }
            // Filter by endDate
            if (filters.endDate) {
                const pendenceDate = new Date(p.deadline_pending);
                const endDate = new Date(filters.endDate);
                if (pendenceDate > endDate) return false;
            }
            return true;
        });

        // Group by deadline_pending date string localized
        const grouped = filtered.reduce((acc, pendence) => {
            if (!pendence.deadline_pending) return acc;
            // Use toLocaleDateString with options to avoid timezone issues
            const dateStr = new Date(pendence.deadline_pending).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(pendence);
            return acc;
        }, {});

        setGroupedPendences(grouped);

    }, [allPendences, filters]);

    // on selectedMonth change fetch pendences
    useEffect(() => {
        fetchPendences(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = e => {
        setSelectedMonth(e.target.value);
    };

    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const goBack = () => {
        window.location.href = '/pendences';
    };

    return (
        <div className="screen">
            <div className="left_area">
                {isSidebarOpen && <Sidebar />}
            </div>
            <div className="right_area">
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <div className="title_area">
                        <div className='at_title_area_left'>
                            <h1>Dados da Conta</h1>
                            <button onClick={goBack}>Voltar</button>
                        </div>
                        <input
                            type="month"
                            value={selectedMonth}
                            className='input_month_all'
                            onChange={handleMonthChange}
                        />
                    </div>

                    <div className="all_transactions_area">
                        <div className="all_transaction_title">
                            <p>Todas as Pendências</p>
                            <div className='transactions_filter'>
                                <label htmlFor="filter-type">Filtros:</label>
                                <select
                                    id="filter-type"
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Selecione um tipo</option>
                                    <option value="1">Receita</option>
                                    <option value="2">Despesa</option>
                                </select>

                                <select
                                    id="filter-status"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Selecione um status</option>
                                    <option value="1">Pendente</option>
                                    <option value="2">Concluído</option>
                                </select>

                                <div className="input_date_filter">
                                    <p htmlFor="filter-start-date">Prazo Inicial:</p>
                                    <input
                                        type="date"
                                        id="filter-start-date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="input_date_filter">
                                    <p htmlFor="filter-end-date">Prazo Final:</p>
                                    <input
                                        type="date"
                                        id="filter-end-date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="all_transactions">
                            {Object.keys(groupedPendences).length > 0 ? (
                                Object.entries(groupedPendences).map(([date, pendenceList]) => (
                                    <div key={date} className="date_transaction_group">
                                        <p className="p_date">Prazo: {date}</p>
                                        {pendenceList.map(pendence => (
                                            <div key={pendence.id_pendences} className="pendence_card">
                                                <div className="gc_top">
                                                    <div className="gc_top_left">
                                                        <span className={pendence.fk_type === 1 ? "type_circle_g" : "type_circle_r"}>
                                                            {pendence.fk_type === 1 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                                        </span>
                                                        <div className="gc_top_content">
                                                            <p className="pc_title">{pendence.title_pending}</p>
                                                            <div className="subtitle">
                                                                <p className="pc_deadline" style={{ textTransform: 'capitalize' }}>{pendence.category?.title_category || 'Sem categoria'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gc_condition_area">
                                                        <span className={`gc_condition ${pendence.fk_condition === 1 ? "status-pending" : "status-completed"}`}>
                                                            {pendence.fk_condition === 1 ? "Pendente" : "Concluído"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="gc_bottom">
                                                    <div className="progress_area">
                                                        <div className="progress_content">
                                                            <p>Progresso</p>
                                                            <p>
                                                                R$ {parseFloat(pendence.initial_pending).toFixed(2).replace('.', ',')} / R$ {parseFloat(pendence.total_pending).toFixed(2).replace('.', ',')}
                                                            </p>
                                                        </div>
                                                        <div className="progress_bar_total_p">
                                                            <div
                                                                className="progress_bar_g"
                                                                style={{ width: `${(pendence.initial_pending / pendence.total_pending) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="gc_edit">
                                                        <MdEdit
                                                            className='edit_icon_goal'
                                                        />
                                                        <MdDelete
                                                            className='delete_icon_goal'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : nearestMonth ? (
                                <p>Suas pendências mais próximas estão no mês de {nearestMonth}.</p>
                            ) : (
                                <p>Sem pendências para exibir.</p>
                            )}
                        </div>
                    </div>
                </main>
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

export default AllPendences;
