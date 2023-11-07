import React, { useState, useEffect } from 'react';
import classes from './ManageCategories.module.scss';
import { fetchCategories } from '../utils/helpers';

function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [inputCategory, setInputCategory] = useState("");
    const [updateCategoryId, setUpdateCategoryId] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCategories(setCategories).catch(error => console.log(error));
    }, [categories]);

    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setError("");
                setMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, message]);

    const loadUpdateCategory = (categoryId, categoryName) => {
        setUpdateCategoryId(categoryId);
        setInputCategory(categoryName);
    }

    const handleUpdateCategory = async () => {
        const response = await fetch('http://localhost:8888/final-project/backend/category/update-category.php', {
                    method: 'POST',
                    body: JSON.stringify({ updateCategoryId, inputCategory }),
                });
        const data = await response.json();

        if (data.status === "success") {
            setMessage(data.message);
        } else {
            setError(data.message);
        }

        setUpdateCategoryId(false);
    }

    const handleCancel = () => {
        setUpdateCategoryId(null);
        setInputCategory('');
    }

    const handleDeleteCategory = async (category_id) => {
        const response = await fetch('http://localhost:8888/final-project/backend/category/delete-category.php', {
            method: 'POST',
            body: JSON.stringify({ category_id }),
        });
        const data = await response.json();

        if (data.status === "success") {
            setMessage(data.message);
        } else {
            setError(data.message);
        }
    };

    const handleAddCategory = async () => {
        const response = await fetch("http://localhost:8888/final-project/backend/category/add-category.php", {
            method: "POST",
            body: JSON.stringify({ categoryName: inputCategory }),
        });
        const data = await response.json();

        if (data.status === "success") {
            setMessage(data.message);
        } else {
            setError(data.message);
        }

        setCategories([...categories]);
        setInputCategory("");
    };

    const isInputEmpty = inputCategory.trim() === '';

    return (
        <div className={classes.wrapperDiv}>
            <h2>Manage the available categories of grocery goods: </h2>
            <p className={classes.errorParagraph}>{error}</p>
            <p className={classes.errorParagraph}>{message}</p>
            <div className={classes.inputWrapper}>
                <input
                    type="text"
                    className={classes.inputCategory}
                    placeholder='category'
                    value={inputCategory}
                    onChange={(e) => setInputCategory(e.target.value)}
                />
                {
                    updateCategoryId ?
                    <div className={classes.buttonsWrapperDiv}>
                        <button onClick={handleUpdateCategory} className={classes.buttons}>Update Category</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div> :
                    <button
                        onClick={handleAddCategory}
                        className={classes.buttons}
                        disabled={isInputEmpty}
                    >Add Category</button>
                }
            </div>
            <table>
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category => (
                    <tr key={category[0]}>
                        <td>{category[1]}</td>
                        <td><button onClick={() => loadUpdateCategory(category[0], category[1])}>update</button></td>
                        <td><button onClick={() => handleDeleteCategory(category[0])}>delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageCategories;