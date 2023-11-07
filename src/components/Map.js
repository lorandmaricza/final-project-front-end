import React, {useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import shop from '../assets/icons/shop.svg';
import location from '../assets/icons/location.svg';
import classes from "./Map.module.css";
import ManageUsersShops from "./ManageUsersShops";
import ShopFilter from "./ShopFilter";
import FilteredShops from "./FilteredShops";

const zoom = 15;
const lat = 47.49720000;
const lng = 19.04120000;

const shopIcon = L.icon({
    iconUrl: shop,
    iconSize: [50, 50]
});

const userLocationIcon = L.icon({
    iconUrl: location,
    iconSize: [50, 50]
});

const fetchShops = async (setShops) => {
    try {
        const response = await fetch('http://localhost:8888/final-project/backend/shop/get-shops.php');
        const data = await response.json();
        setShops(data.shops);
    } catch (error) {
        console.error(error);
    }
};

export default function Map(props) {
    const [distance, setDistance] = useState(1);
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const mapRef = useRef(null);
    const { id: userId, role_id: roleId} = props.userData;
    const [mapLocation, setMapLocation] = useState([lat, lng]);
    const [userLocationMarker, setUserLocationMarker] = useState(null);
    const userLocationMarkerRef = useRef(userLocationMarker);
    const userLocationCircleRef = useRef(null);

    useEffect(() => {
        userLocationMarkerRef.current = userLocationMarker;
    }, [userLocationMarker]);

    useEffect(() => {
        let map;

        fetchShops(setShops).then(() => {});

        if (!mapRef.current) {
            map = L.map("map").setView(mapLocation, zoom);

            L.tileLayer(
                "https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=1ZU1Tl8qgksGLRZjVgyo4VpSFp2RcByNResEUKhri9GEuaGikhLfYxHKfINtbSHR",
                {}
            ).addTo(map);

            map.on("locationfound", function (e) {
                setMapLocation([e.latlng.lat, e.latlng.lng]);

                if (userLocationMarkerRef.current) {
                    map.removeLayer(userLocationMarkerRef.current);
                }

                const marker = L.marker([e.latlng.lat, e.latlng.lng], {
                    icon: userLocationIcon,
                }).addTo(map);

                setUserLocationMarker(marker);
            });

            const customControl = L.Control.extend({
                options: {
                    position: "topright",
                },
                onAdd: function () {
                    const container = L.DomUtil.create(
                        "div",
                        "leaflet-bar leaflet-control leaflet-control-custom"
                    );

                    container.style.backgroundColor = "white";
                    container.innerHTML = "current location";

                    container.addEventListener("click", function () {
                        map.locate({ setView: true, maxZoom: 16 });
                    });

                    return container;
                }
            });

            let controlCurrentLocation = new customControl();

            map.addControl(controlCurrentLocation);

            mapRef.current = map;
        } else {
            mapRef.current.setView(mapLocation, zoom);
        }
    }, [mapLocation]);

    useEffect(() => {
        if (Array.isArray(shops)) {
            const map = mapRef.current;

            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer !== userLocationMarker) {
                    map.removeLayer(layer);
                }
            });

            shops.forEach((location) => {
                const latLng = L.latLng(location.lat, location.lng);
                const marker = L.marker(latLng, {
                    icon: shopIcon,
                }).addTo(mapRef.current);

                marker.bindPopup(`
                    <div style="text-align: center;">
                    <b>${location.name}</b>
                    <hr style="border-top: 1px dotted #c49b9b;">
                    <b>${location.address}</b>
                    </div>
                `, {
                    offset: [0,-18],
                });
            });
        }
    }, [shops, userLocationMarker]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, [filteredShops]);

    useEffect(() => {
        const map = mapRef.current;
        if (map && userLocationMarker) {
            const radius = distance * 1000;

            if (userLocationCircleRef.current) {
                map.removeLayer(userLocationCircleRef.current);
            }

            if (roleId !== 2) {
                userLocationCircleRef.current = L.circle(
                    [userLocationMarker._latlng.lat,
                        userLocationMarker._latlng.lng],
                    {radius: radius}
                ).addTo(map);
            }
        }
    }, [distance, roleId, userLocationMarker]);

    return (
        <div className={
            roleId === 2 ?
            classes.manageWrapperDiv :
            ((!filteredShops || filteredShops.length === 0) ? classes.filterEmptyWrapperDiv : classes.filterWrapperDiv)}
        >
            {roleId === 2 && <ManageUsersShops userId={userId} roleId={roleId} setMapLocation={setMapLocation}/>}
            {roleId === 1 && <ShopFilter currentLocation={props.currentLocation} setFilteredShops={setFilteredShops} onDistanceChange={setDistance} />}
            {roleId === 1 && <FilteredShops filteredShops={filteredShops} setMapLocation={setMapLocation}/>}

            <div className={roleId === 2 ?
                classes.mapManageWrapperDiv :
                classes.mapFilerWrapperDiv}>
                <div id="map" style={{
                    margin: 0,
                    height: "500px",
                    width: "100%",
                    borderRadius: "22px",
                    zIndex: 0
                }}></div>
            </div>
        </div>
    );
};