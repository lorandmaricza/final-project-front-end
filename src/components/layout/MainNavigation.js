import { Link } from 'react-router-dom';
import classes from './MainNavigation.module.scss';
import { useEffect, useState } from "react";
import { checkSession } from "../../utils/helpers";
import menu from '../../assets/icons/menu.svg';
import close from '../../assets/icons/menu-close.svg';
import DropdownMenu from "../DropdownMenu";

function MainNavigation(props) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        checkSession().then((data) => {
            if (data.status === "logged_in") {
                props.setLoggedIn(true);
            }
        }).catch(error => console.log(error));
    }, [props]);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={classes.header}>
            <div className={classes.logo}><Link to='/'>FoodyMe</Link></div>
            {props.loggedIn ? (
                <div className={classes.menuWrapper}>
                    <button onClick={handleMenuClick} className={classes.menuButton}>
                        <img src={menuOpen ? close : menu} alt="menu button" className={menuOpen? classes.menuClose : classes.menu}/>
                    </button>
                    {menuOpen && <DropdownMenu setLoggedIn={props.setLoggedIn} closeMenu={handleMenuClick}/>}
                </div>
            ) : (
                <nav>
                    <ul>
                        <li>
                            <Link to='/login'>Log in</Link>
                        </li>
                        <li>
                            <Link to='/signup'>Sign up</Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}

export default MainNavigation;
