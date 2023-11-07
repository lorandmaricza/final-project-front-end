import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { checkSession } from '../utils/helpers';
import classes from './LandingPage.module.css';


function LandingPage () {
    const navigate = useNavigate();

    useEffect(() => {
        checkSession().then((data) => {
            if (data.status === "logged_in") {
                navigate('/dashboard', { state: { userData: data.userData } });
            } else {
                navigate('/');
            }
        }).catch(error => console.log(error));
    }, [navigate]);

    return (
        <div className={classes.wrapperDiv}>
            <div className={classes.imgDivWrapper}>
                <div className={classes.imgDiv}></div>
            </div>
        </div>
    );
}

export default LandingPage;