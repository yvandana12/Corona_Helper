import React, {useState} from 'react';
import './Map.css';
import { MapContainer , TileLayer } from "react-leaflet";
import { showDataOnMap } from './util';

function Map({ countries, casesType="cases", center, zoom }) {
    const [map, setmap] = useState(null);
    if (map) {
     map.flyTo(center);
     }
    return (
        <div className="map">
            <MapContainer className="map_box" center={center} zoom={zoom} whenCreated={setmap} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Loop through and draw circles */}
                 
                {showDataOnMap(countries,casesType)}
            </MapContainer>
        </div>
    );
};

export default Map;