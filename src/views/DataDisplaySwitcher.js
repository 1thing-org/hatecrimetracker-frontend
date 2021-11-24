import {  Nav, NavItem, NavLink } from 'reactstrap';
import './DataDisplaySwitcher.css';

const DataDisplaySwitcher = ({isShowPer10kAsian, onClick}) => {
    const TotalButton = () => {
        console.log(isShowPer10kAsian)
        if (isShowPer10kAsian === true) {
            onClick()
        }
    }
    const Per10KAsianButton = () => {
        console.log(isShowPer10kAsian)
        if (isShowPer10kAsian !== true) {
            onClick()
        }
    }

    return (
            <Nav className= "ButtonToggle" pills>
                <NavItem className="RowButtonToggle">
                    <NavLink active={!isShowPer10kAsian} onClick={TotalButton}>
                        Total
                    </NavLink>
                    <NavLink className='Switcher10KButton' active={isShowPer10kAsian} onClick={Per10KAsianButton}>
                        Per 10K Asian
                    </NavLink>
                </NavItem>
            </Nav>
    )
}

export default DataDisplaySwitcher