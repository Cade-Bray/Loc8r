import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

document.addEventListener('DOMContentLoaded', function (){
    const map = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: new View({
            center: fromLonLat([-111.8910, 40.7608]),
            zoom: 12
        })
    });
});

// Function to update map view based on coordinates
function updateMap(lat, lon) {
    const view = map.getView();
    const coords = fromLonLat([lon, lat]);
    view.setCenter(coords);
    view.setZoom(12);
}

// Function to update map based on address
async function updateMapByAddress(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        updateMap(lat, lon);
    } else {
        alert('Address not found');
    }
}