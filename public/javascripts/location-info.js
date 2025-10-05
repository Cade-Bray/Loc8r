import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'

const markerStyle = new Style({
    image: new Icon({
        src: '/stylesheets/map-marker.svg',
        anchor: [0.5, 1]
    })
});

document.addEventListener('DOMContentLoaded', function (){
    const map = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: new View({
            center: fromLonLat(window.locationCoords),
            zoom: 16
        })
    });
    
    const pointFeature = new Feature({
        geometry: new Point(fromLonLat(window.locationCoords))
    });
    
    pointFeature.setStyle(markerStyle)
    
    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            features: [pointFeature]
        })
    });
    
    map.addLayer(vectorLayer);
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