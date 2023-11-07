import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import classes from './LoginPage.module.css';

export default function LoginPage(props) {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch(
            "http://localhost:8888/final-project/backend/login.php",
            {
                method: "POST",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify(user)
            });
        const data = await response.json();
        setIsLoading(false);
        if (data.status === "success") {
            props.setLoggedIn(true);
            navigate('/dashboard', { state: { userData: data.userData } });
        } else {
            setError(data.message);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Log in</h1>
                {error && (
                    <div className={classes.errorWrapperDiv}>
                        <p>{error}</p>
                    </div>
                )}
                <div>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        required
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={user.password}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <div>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <button type="submit" name="save">
                            Log in
                        </button>
                    )}
                </div>
                <br />
                <div>
                    Don't have an account? <Link to='/signup'>Sign up</Link>
                </div>
            </form>
        </div>
    );
}

