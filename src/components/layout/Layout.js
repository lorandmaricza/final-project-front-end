import MainNavigation from './MainNavigation';
import classes from './Layout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'


function Layout(props) {

    return (
        <div className={classes.wrapper}>
            <MainNavigation loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
            <main>{props.children}</main>
            <footer>
                <p>&copy; 2023 FoodyMe. All rights reserved.</p>
                <p>Contact me:</p> 
                <a href="mailto:maricza.lorand@gmail.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faEnvelope} /></a>
                <a href="https://github.com/lorandmaricza" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
                <a href="https://www.linkedin.com/in/lorand-maricza-055018210/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
            </footer>
        </div>
    );
}

export default Layout;