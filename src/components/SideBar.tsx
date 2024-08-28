
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, AlertCircle, Mail, Menu, Book, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const SideBar = ({ isSidebarOpen, toggleSidebar }: Props) => {
    const location = useLocation();
    const { t } = useTranslation(); // useTranslationフックを使用

    /* 今のところサイドバーのOpen状態(getButtonClassInOpen)とClose状態(getButtonClassInClose)でスタイルを分ける必要はないけど、
    今後分けるかもしれないのでこのまま残しておく。必要ないこと確定したら一つにする(Linkタグ内の分岐も消す)。*/
    const getButtonClassInClose = (path: string) => (
        location.pathname === path ?
            'btn btn-success text-light d-flex justify-content-start align-items-center my-1 py-2 fw-bold' :
            'btn btn-outline-success d-flex justify-content-start align-items-center my-1 py-2 fw-bold'
    );

    const getButtonClassInOpen = (path: string) => (
        location.pathname === path ?
            'btn btn-success text-light d-flex justify-content-start align-items-center my-1 py-2 fw-bold' :
            'btn btn-outline-success d-flex justify-content-start align-items-center my-1 py-2 fw-bold'
    );

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
            style={{
                width: isSidebarOpen ? '250px' : '75px',
                transition: 'width 0.3s ease-in-out',
                overflow: 'hidden',
                backgroundColor: '#cbddb1'
            }}>
            <div className="m-2">
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-outline-success mb-5" onClick={toggleSidebar} style={{ border: 'none' }}>
                        <Menu size={35} />
                    </button>
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to="/" className={` ${isSidebarOpen ? getButtonClassInOpen('/') : getButtonClassInClose('/')} `}
                            style={{ fontSize: '1.4rem', border: 'none' }}>
                            <MessageCircle size={35} />
                            {isSidebarOpen && <div className="ms-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{t('chat_screen')}</div>}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/guide" className={` ${isSidebarOpen ? getButtonClassInOpen('/guide') : getButtonClassInClose('/guide')} `}
                            style={{ fontSize: '1.4rem', border: 'none' }}>
                            <Book size={35} />
                            {isSidebarOpen && <div className="ms-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{t('guide')}</div>}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/caution" className={` ${isSidebarOpen ? getButtonClassInOpen('/caution') : getButtonClassInClose('/caution')} `}
                            style={{ fontSize: '1.4rem', border: 'none' }}>
                            <AlertCircle size={35} />
                            {isSidebarOpen && <div className="ms-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{t('caution')}</div>}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className={` ${isSidebarOpen ? getButtonClassInOpen('/contact') : getButtonClassInClose('/contact')} `}
                            style={{ fontSize: '1.4rem', border: 'none' }}>
                            <Mail size={35} />
                            {isSidebarOpen && <div className="ms-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{t('contact')}</div>}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/setting" className={` ${isSidebarOpen ? getButtonClassInOpen('/setting') : getButtonClassInClose('/setting')} `}
                            style={{ fontSize: '1.4rem', border: 'none' }}>
                            <Settings size={35} />
                            {isSidebarOpen && <div className="ms-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>setting</div>}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
