import {  Nav, NavItem, NavLink } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import './DataDisplaySwitcher.css';

const DataDisplaySwitcher = ({isShowPer10kAsian, onClick}) => {
    const { t } = useTranslation();
    const TotalButton = () => {
        if (isShowPer10kAsian === true) {
            onClick()
        }
    }
    const Per10KAsianButton = () => {
        if (isShowPer10kAsian !== true) {
            onClick()
        }
    }

    return (
            <Nav className= "ButtonToggle" pills>
                <NavItem className="RowButtonToggle">
                    <NavLink active={!isShowPer10kAsian} onClick={TotalButton}>
                        {t("total_incidents")}
                    </NavLink>
                    <NavLink className='Switcher10KButton' active={isShowPer10kAsian} onClick={Per10KAsianButton}>
                        {t("per_10k_asian")}
                    </NavLink>
                </NavItem>
            </Nav>
    )
}

export default DataDisplaySwitcher