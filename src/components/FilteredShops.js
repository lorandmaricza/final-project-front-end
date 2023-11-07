import React, {useState} from 'react';
import classes from './FilteredShops.module.scss';
import ShopCategories from "./ShopCategories";

export default function FilteredShops({ filteredShops, setMapLocation }) {
    const [selectedShop, setSelectedShop] = useState(null);

    const handleShowShopsCategories = (shopId) => {
        setSelectedShop(selectedShop === shopId ? null : shopId);
    }

    return (
        <div className={classes.filteredShopsWrapperDiv}>
            {filteredShops && filteredShops.map((shop, index) => (
                <div
                    onClick={() => setMapLocation([shop.lat, shop.lng])}
                    key={index}
                    className={classes.filteredShopWrapperDiv}>
                    <div className={classes.shop}>
                        <div className={classes.nameAddressWrapperDiv}>
                            <p className={classes.shopNameParagraph}>{shop.name}</p>
                            <p>{shop.address}</p>
                        </div>
                        <div className={classes.buttonsWrapperDiv}>
                            <button
                                onClick={() => handleShowShopsCategories(shop.id)}
                            >
                                categories
                            </button>
                        </div>
                    </div>
                    <div className={selectedShop === shop.id ? classes.dropdownWrapper : classes.dropdownClosedWrapper}>
                        {selectedShop === shop.id && <ShopCategories shopId={shop.id} />}
                    </div>
                </div>
            ))}
        </div>
    );
}
