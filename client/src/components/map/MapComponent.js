import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector } from "react-redux";
import { MAP_FLY_ACTION, MAP_STYLE_ACTION, MAPBOX_ACCESS_TOKEN } from "../../actions/constants";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainerRef = useRef(null); // Reference for the map container
  const mapRef = useRef(null); // Reference for the Mapbox map instance
  const [matches, setMatches] = useState(window.matchMedia("(min-width: 1000px)").matches);

  // Redux state selectors
  const { countryStatistics, style, action } = useSelector((state) => ({
    countryStatistics: state.countryStatistics,
    style: state.style,
    action: state.action,
  }));

  // Handle window resize for navigation control placement
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1000px)");
    const handleResize = (e) => setMatches(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Initialize the Mapbox map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style.style,
        center: [16, 27],
        zoom: 2,
      });

      mapRef.current.addControl(
        new mapboxgl.NavigationControl(),
        matches ? "bottom-right" : "top-right"
      );

      fetchMarkers(mapRef.current); // Fetch markers and render them
    }
  }, [style.style, matches]);

  // Handle map style changes or fly actions
  useEffect(() => {
    if (!mapRef.current) return;

    if (action?.action === MAP_STYLE_ACTION) {
      mapRef.current.setStyle(style.style); // Update map style
    }

    if (action?.action === MAP_FLY_ACTION && countryStatistics?.statistics?.item) {
      mapRef.current.flyTo({
        center: countryStatistics.statistics.item,
        zoom: 4,
        speed: 1,
        curve: 1,
        easing: (t) => t,
        essential: true,
      });
    }
  }, [action, style.style, countryStatistics]);

  // Function to fetch and render markers on the map
  const fetchMarkers = async (mapInstance) => {
    try {
      const response = await fetch("http://localhost:5000");// new url for geojson data
      const data = await response.json();

      mapInstance.once("load", () => {
        mapInstance.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data,
          },
        });

        mapInstance.addLayer({
          id: "circles",
          source: "points",
          type: "circle",
          paint: {
            "circle-opacity": 0.75,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "total_cases"],
              1, 4,
              1000, 8,
              4000, 10,
              8000, 14,
              12000, 18,
              100000, 40,
              250000, 100,
            ],
            "circle-color": "#EA240F",
          },
        });

        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
        let previousId = null;

        // Handle circle hover interaction
        mapInstance.on("mousemove", "circles", (e) => {
          const feature = e.features[0];
          if (!feature || feature.properties.key === previousId) return;

          const { name, confirmed, deaths, recovered } = feature.properties;
          previousId = feature.properties.key;

          popup.setLngLat(feature.geometry.coordinates)
            .setHTML(`
              <div style="font-family: Roboto, sans-serif; text-align: center;">
                <h4>${name}</h4>
                <p>Confirmed: ${confirmed}</p>
                <p>Deaths: ${deaths}</p>
                <p>Recovered: ${recovered}</p>
              </div>
            `)
            .addTo(mapInstance);

          mapInstance.getCanvas().style.cursor = "pointer";
        });

        mapInstance.on("mouseleave", "circles", () => {
          previousId = null;
          mapInstance.getCanvas().style.cursor = "";
          popup.remove();
        });
      });
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  return <div className="mapbox-container" ref={mapContainerRef} style={{ height: "100vh" }} />;
};

export default MapComponent;
