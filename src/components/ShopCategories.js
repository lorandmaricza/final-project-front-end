import React, { useState, useEffect } from 'react';
import classes from './ShopCategories.module.css';

export default function ShopCategories({ shopId }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    'https://final-project-php-backend-06271590c384.herokuapp.com/category/get-users-shop-categories.php',
                    {
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'include',
                        body: JSON.stringify({ shopId }),
                    }
                );
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories().then(() => {});
    }, [shopId]);

    return (
        <ul>
            {
                categories && categories.map((category) =>
                <li
                    key={category.id}
                    className={classes.listItem}>
                    {category.name}
                </li>)
            }
        </ul>
    );
}
