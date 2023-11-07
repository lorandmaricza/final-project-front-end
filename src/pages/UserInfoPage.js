import React, { useEffect, useState } from "react";
import { checkSession } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import classes from "./UserInfoPage.module.scss";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function UserInfoPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [previousPassword, setPreviousPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        checkSession()
            .then((data) => {
                if (data.status === "logged_in") {
                    setUserData(data.userData);
                    setUpdatedData(data.userData);
                } else {
                    navigate("/");
                }
            })
            .catch((error) => console.log(error));
    }, [navigate]);

    const handleGoBack = () => {
        navigate("/dashboard", { state: { userData: userData } });
    };

    const getRole = (roleId) => {
        let role;
        switch (roleId) {
            case 1:
                role = "consumer";
                break;
            case 2:
                role = "supplier";
                break;
            default:
                role = "admin";
        }
        return role;
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:8888/final-project/backend/update-user.php',
                {
                    method: "POST",
                    mode: 'cors',
                    credentials: 'include',
                    body: JSON.stringify({ ...updatedData, password: newPassword, previous_password: previousPassword }),
                });

            const data = await response.json();

            if (data.status === "success") {
                setIsEditing(false);
                setUserData(updatedData);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setUpdatedData({ ...updatedData, [event.target.name]: event.target.value });
    };

    const handlePreviousPasswordChange = (event) => {
        setPreviousPassword(event.target.value);
    }

    const handleNewPasswordChange = (event) => {
        // setShowPassword(false);
        setPasswordError(null);
        setNewPassword(event.target.value);
    };

    const handleConfirmNewPasswordChange = (event) => {
        setPasswordError(null);
        setConfirmNewPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <ArrowBackIcon onClick={handleGoBack} className={classes.goBackIcon}></ArrowBackIcon>
            <div className={classes.wrapperDiv}>
                <div className={isEditing ? classes.editSubWrapperDiv : classes.subWrapperDiv}>
                    <h1 className={classes.header}>Welcome {userData.first_name}!</h1>
                    <h2>{passwordError}</h2>
                    <div>
                        {!isEditing ?
                            <div className={classes.inputEditWrapperDiv}>
                                <p>Role: </p>
                                <b>{getRole(userData.role_id)}</b>
                            </div> : <></>}
                        <div className={classes.inputEditWrapperDiv}>
                            <p>Email: </p>
                            {isEditing ? <input type="text" name="email" value={updatedData.email} className={classes.textInput} onChange={handleChange} /> : <b>{userData.email}</b>}
                        </div>
                        <div className={classes.inputEditWrapperDiv}>
                            <p>First Name: </p>
                            {isEditing ? <input type="text" name="first_name" value={updatedData.first_name} className={classes.textInput} onChange={handleChange} /> : <b>{userData.first_name}</b>}
                        </div>
                        <div className={classes.inputEditWrapperDiv}>
                            <p>Last Name: </p>
                            {isEditing ? <input type="text" name="last_name" value={updatedData.last_name} className={classes.textInput} onChange={handleChange} /> : <b>{userData.last_name}</b>}
                        </div>
                        {isEditing && (
                            <div className={classes.inputEditWrapperDiv}>
                                <p>Previous Password: </p>
                                <input type={showPassword ? "text" : "password"} name="password" value={newPassword} className={classes.textInput} onChange={handlePreviousPasswordChange} />
                            </div>
                        )}
                        {isEditing && (
                            <div className={classes.inputEditWrapperDiv}>
                                <p>New Password: </p>
                                <input type={showPassword ? "text" : "password"} name="password" value={newPassword} className={classes.textInput} onChange={handleNewPasswordChange} />
                            </div>
                        )}
                        {isEditing ? (
                            <div className={classes.inputEditWrapperDiv}>
                                <p>Confirm New Password: </p>
                                {isEditing ? (
                                    <>
                                        <input type={showPassword ? "text" : "password"} name="confirm_password" value={confirmNewPassword} className={classes.textInput} onChange={handleConfirmNewPasswordChange} />
                                    </>
                                ) : <></>}
                            </div>
                        ) : <></>}
                    </div>
                    <div className={classes.buttonWrapperDiv}>
                        {isEditing ? (
                            <>
                                <button onClick={toggleShowPassword}>
                                    {showPassword ? "Hide passwords" : "Show passwords"}
                                </button>
                                <button onClick={handleSave}>
                                    Save
                                </button>
                            </>
                        ) : (
                            // <button onClick={handleEdit}>
                            <button onClick={handleEdit} disabled={true}>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
