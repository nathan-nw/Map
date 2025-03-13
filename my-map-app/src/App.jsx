import { useState } from "react";
import "./App.css";
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const INITIAL_CENTER = [-81.2734, 43.0075];
const INITIAL_ZOOM = 16.83;
const INITIAL_BEARING = 0;
const INITIAL_PITCH = 50.0;

function App() {
  // const [count, setCount] = useState(0);

  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [bearing, setBearing] = useState(INITIAL_BEARING);
  const [pitch, setPitch] = useState(INITIAL_PITCH);

  // const myGeoJson = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       properties: {
  //         description: "A sample point",
  //       },
  //       geometry: {
  //         type: "Point",
  //         coordinates: [-81.28, 43.0],
  //       },
  //     },
  //     {
  //       type: "Feature",
  //       properties: {
  //         description: "A sample polygon",
  //       },
  //       geometry: {
  //         type: "Polygon",
  //         coordinates: [
  //           [
  //             [-81.3, 43.01],
  //             [-81.27, 43.01],
  //             [-81.27, 43.02],
  //             [-81.3, 43.02],
  //             [-81.3, 43.01],
  //           ],
  //         ],
  //       },
  //     },
  //   ],
  // };

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      bearing: INITIAL_BEARING,
      pitch: INITIAL_PITCH,
    });
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmF0aGFuLW53IiwiYSI6ImNtODY0cnNlYTAwcDAyam9mbnZ1bjlpOGgifQ.0oxUV4IRk5gSut-FUJhYxg";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      bearing: bearing,
      pitch: pitch,
      style: "mapbox://styles/mapbox/standard",
    });

    mapRef.current.on("move", () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();
      const mapBearing = mapRef.current.getBearing();
      const mapPitch = mapRef.current.getPitch();
      setBearing(mapBearing);
      setPitch(mapPitch);
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("my-geojson-source", {
        type: "geojson",
        data: myGeoJson,
        // OR if you have a URL:  data: '/someFile.geojson'
      });
      // });

      // Add a layer for points
      mapRef.current.addLayer({
        id: "my-points-layer",
        type: "circle",
        source: "my-geojson-source",
        paint: {
          "circle-radius": 6,
          "circle-color": "#FF0000",
        },
        filter: ["==", "$type", "Point"],
      });

      // Add a layer for polygons
      mapRef.current.addLayer({
        id: "my-polygons-layer",
        type: "fill",
        source: "my-geojson-source",
        paint: {
          "fill-color": "#00FF00",
          "fill-opacity": 0.4,
        },
        filter: ["==", "$type", "Polygon"],
      });
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)} | Bearing: {bearing.toFixed(2)} | Pitch:
        {pitch.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>

      {/* The map container */}
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}

export default App;
