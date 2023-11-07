import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

function Layout(props) {

    return (
        <div className={classes.wrapperDiv}>
            <MainNavigation loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
            <main className={classes.main}>{props.children}</main>
        </div>
    );
}

export default Layout;