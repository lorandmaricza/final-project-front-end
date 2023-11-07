import React, { useState, useEffect } from 'react';
import classes from './ManageUsersShops.module.css';
import ShopCategories from "./ShopCategories";
import ManageShopForm from "./ManageShopForm";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const saveShop = async (shop) => {
    try {
        await fetch(
            'http://localhost:8888/final-project/backend/shop/save-shop.php',
            {
                method: 'POST',
                mode: "cors",
                credentials: "include",
                body: JSON.stringify(shop)
            });
    } catch (error) {
        console.error(error);
    }
};

export default function ManageUsersShops(props) {
    const { userId, roleId } = props;
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showAddShopForm, setShowAddShopForm] = useState(false);
    const [disableShowCategoriesButton, setDisableShowCategoriesButton] = useState(false);
    const [shopDeleted, setShopDeleted] = useState(false);
    const [shopChanged, setShopChanged] = useState(false);
    const [shopAdded, setShopAdded] = useState(false);
    const [showAddShopComponent, setShowAddShopComponent] = useState(false);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8888/final-project/backend/shop/get-user-shops.php`,
                    {
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'include',
                        body: JSON.stringify({ userId })
                    }
                );
                const data = await response.json();
                setShops(data.shops);
                setShopChanged(false);
                setShopAdded(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchShops().then(() => {});
        setShopDeleted(false);
    }, [userId, shopDeleted, shopChanged, shopAdded]);

    const handleAddShop = () => {
        setShowAddShopComponent(!showAddShopComponent);
    };

    const onAddShop = async (shop) => {
        const shopToSave = {...shop, userId};
        await saveShop(shopToSave);
        setShopAdded(true);
    };

    const handleShowShopsCategories = (shopId) => {
        setDisableShowCategoriesButton(false);
        setSelectedShop(selectedShop === shopId ? null : shopId);
    }

    const handleManageClick = (shopId) => {
        setDisableShowCategoriesButton(true);
        setShowAddShopForm(showAddShopForm === shopId ? null : shopId);
        setSelectedShop(null);
    }

    const updateUserShops = async (shop, updated) => {
        let updatedShops;
        let file;
        if (updated === 'address') {
            updatedShops = shops.map((userShop) => {
                if (userShop.id === shop.id) {
                    return {
                        ...userShop,
                        address: shop.address,
                        lat: shop.lat,
                        lng: shop.lng,
                    };
                }
                return userShop;
            });

            file = 'shop/update-shop-address';
        } else if (updated === 'categories') {
            updatedShops = shops.map((userShop) => {
                if (userShop.id === shop.id) {
                    return {
                        ...userShop,
                        categories: shop.categories,
                    };
                }
                return userShop;
            });

            file = 'category/update-shop-categories';
        } else if (updated === 'name') {
            updatedShops = shops.map((userShop) => {
                if (userShop.id === shop.id) {
                    return {
                        ...userShop,
                        name: shop.name,
                    };
                }
                return userShop;
            });

            file = 'shop/update-shop-name';
        }

        if (file) {
            try {
                await fetch(
                    'http://localhost:8888/final-project/backend/' + file + '.php',
                    {
                        method: 'POST',
                        mode: "cors",
                        credentials: "include",
                        body: JSON.stringify(shop)
                    });
            } catch (error) {
                console.error(error);
            }
        }

        setShops(updatedShops);
        setShopChanged(true);
    };

    const onUpdateAddress = async (shop) => {
        const updated = 'address';
        try {
            await fetch(
                'http://localhost:8888/final-project/backend/shop/update-shop-address.php',
                {
                    method: 'POST',
                    mode: "cors",
                    credentials: "include",
                    body: JSON.stringify(shop)
                });
            await updateUserShops(shop, updated);
        } catch (error) {
            console.error(error);
        }
    }

    const onUpdateShopName = async (shop) => {
        const updated = 'name';
        await updateUserShops(shop, updated);
    }

    const onUpdateCategory = async (shop) => {
        const updated = 'categories';
        await updateUserShops(shop, updated);
    }

    const onDeleteShop = () => {
        setShopDeleted(!shopDeleted);
    }

    return (
        <div className={classes.componentWrapperDiv}>
            <h2>List of your shops:</h2>
            {shops && shops.map((shop, index) => (
                <div
                    onClick={() => props.setMapLocation([shop.lat, shop.lng])}
                    key={index}
                    className={classes.shopWrapperDiv}>
                    <div className={classes.shop}>
                        <div className={classes.nameAddressWrapperDiv}>
                            <p className={classes.shopNameParagraph}>{shop.name}</p>
                            <p>{shop.address}</p>
                        </div>
                        <div className={classes.buttonsWrapperDiv}>
                            <button
                                onClick={() => handleShowShopsCategories(shop.id)}
                                className={classes.buttons}
                                disabled={disableShowCategoriesButton && selectedShop === shop.id}
                            >
                                categories
                            </button>
                            <button onClick={() => handleManageClick(shop.id)} className={classes.buttons}>manage</button>
                        </div>
                    </div>
                    <div className={selectedShop === shop.id ? classes.dropdownWrapper : classes.dropdownClosedWrapper}>
                        {selectedShop === shop.id && !showAddShopForm && <ShopCategories shopId={shop.id} />}
                        {showAddShopForm === shop.id &&
                            <ManageShopForm
                                shopId={shop.id}
                                onUpdateAddress={onUpdateAddress}
                                onUpdateShopName={onUpdateShopName}
                                onUpdateCategory={onUpdateCategory}
                                onDeleteShop={onDeleteShop}
                            />}
                    </div>
                </div>
            ))}
            {roleId === 2 && <AddCircleIcon className={classes.addIcon} onClick={handleAddShop}></AddCircleIcon>}
            {showAddShopComponent &&
                <div className={classes.manageShopFormWrapperDiv}>
                    <ManageShopForm
                        isAdd={true}
                        onAddShop={onAddShop}
                    />
                </div>
            }
        </div>
    );
}
