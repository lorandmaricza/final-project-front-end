import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import classes from './ShopFilter.module.scss';

export default function ShopFilter({ currentLocation, setFilteredShops, onDistanceChange }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [distance, setDistance] = useState(1);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch(
                'http://localhost:8888/final-project/backend/category/get-categories.php'
            );
            const data = await response.json();
            const options = data.categories.map(([value, label]) => ({
                value,
                label,
            }));
            setCategories(options);
        };
        fetchCategories().then(() => {});
    }, []);

    useEffect(() => {
        const fetchFilteredShops = async () => {
            let data = {};
            data.shops = undefined;
            const response = await fetch(
                'http://localhost:8888/final-project/backend/shop/get-filtered-shops.php',
                {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    body: JSON.stringify({
                        distance,
                        categories: selectedCategories,
                        lat: currentLocation.lat,
                        lng: currentLocation.lng,
                    }),
                }
            );
            data = await response.json();
            setFilteredShops(data.shops);
        };

        fetchFilteredShops().then(() => {});
        // don't add missing dependencies: 'currentLocation.lat' and 'currentLocation.lng'
    }, [currentLocation, distance, selectedCategories, setFilteredShops]);

    const handleCategoryChange = (selectedOptions) => {
        const values = selectedOptions.map((option) => parseInt(option.value));
        setSelectedCategories(values);
    };

    const handleDistanceChange = (event) => {
        setDistance(event.target.value);
        if (onDistanceChange) {
            onDistanceChange(event.target.value);
        }
    };

    return (
        <div className={classes.filterWrapperDiv}>
            <div className={classes.distWrapperDiv}>
                <label>distance:</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={distance}
                    onChange={handleDistanceChange}
                />
                <span>{distance} km</span>
            </div>
            {categories.length > 0 ? (
                <Select
                    isMulti
                    placeholder={'Select categories...'}
                    options={categories}
                    onChange={handleCategoryChange}
                    value={categories.filter((option) =>
                        selectedCategories.includes(parseInt(option.value))
                    )}
                />
            ) : null}
        </div>
    );
}
