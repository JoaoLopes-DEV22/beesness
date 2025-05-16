import '../css/components/Sidebar.css';
import { AiFillHome } from 'react-icons/ai';
import { FaChartPie, FaHandHoldingDollar } from 'react-icons/fa6';
import { PiPiggyBankFill } from 'react-icons/pi';
import { MdOutlineHive } from 'react-icons/md';
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: <AiFillHome />, label: 'Início' },
    { path: '/dashboard', icon: <FaChartPie />, label: 'Dashboard' },
    { path: '/pendences', icon: <FaHandHoldingDollar />, label: 'Pendências' },
    { path: '/savings', icon: <PiPiggyBankFill />, label: 'Poupança' },
    { path: '/hive', icon: <MdOutlineHive />, label: 'Colmeia' },
  ];

  return (
    <div className="sidebar">
      <div className="logo_area">
        <img src="/assets/logo.png" alt="logo" />
      </div>
      <div className="division_line"></div>
      <nav>
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`nav_section ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className={`select_mark ${location.pathname === item.path ? 'active' : ''}`}></div>
            <div className="nav_item">
              <NavLink
                to={item.path}
                className="sidebar-item"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--verde-claro)' : 'var(--branco)',
                })}
              >
                {item.icon}
                <p>{item.label}</p>
              </NavLink>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;