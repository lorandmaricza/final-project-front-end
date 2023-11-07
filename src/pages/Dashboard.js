import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ManageCategories from "../components/ManageCategories";
import Map from "../components/Map";

export default function Dashboard() {
    const { state } = useLocation();
    const { userData } = state;
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const fetchCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCurrentLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            }
        };
        fetchCurrentLocation();
    }, []);

    if (userData.role_id === 3) {
        return <ManageCategories />;
    } else if (userData.role_id === 1 || userData.role_id === 2) {
        return <Map userData={userData} currentLocation={currentLocation} />;
    } else {
        return null;
    }
}
