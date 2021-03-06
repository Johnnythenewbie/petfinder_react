import React, { useState, useContext, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import "./MapComponent.css";
import AuthContext from "../../contexts/auth/authContext";
import MapComponentContext from "../../contexts/mapComponent/mapComponentContext";
import CustomToast from "../CustomToast";
import { DropdownButton, Dropdown } from "react-bootstrap";

const MapComponent = (props) => {
  const [map, setMap] = useState(null);
  const [renderCount, setRenderCount] = useState(0);
  const [showGeoEnabledToast, setShowGeoEnabledToast] = useState(false);
  const [mapCenter, setMapCenter] = useState({});
  const authContext = useContext(AuthContext);
  const mapComponentContext = useContext(MapComponentContext);

  const {
    geofencePoints,
    canSetGeofence,
    addGeofencePoint,
    resetGeofencePoints,
    setCanSetGeofence,
    uploadGeofencePoints,
    setGeofencePointsFromFirebase,
  } = mapComponentContext;

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const handleLogoutBtn = () => authContext.logoutUser();

  const handleSetGeofenceBtn = () => {
    setCanSetGeofence(true);
    setShowGeoEnabledToast(true);
  };

  const handleConfirmGeofenceBtn = async () => {
    await uploadGeofencePoints();
    setCanSetGeofence(false);
    setShowGeoEnabledToast(false);
  };

  const handleRemoveGeofenceBtn = () => resetGeofencePoints();

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onPolygonLoad = (polygon) => {};

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapOnClick = (e) => {
    if (canSetGeofence)
      addGeofencePoint({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const toggleGeoEnabledToast = () =>
    setShowGeoEnabledToast(!showGeoEnabledToast);

  //todo: move to constants file
  const polygonOptions = {
    fillColor: "lightblue",
    fillOpacity: 0.5,
    strokeColor: "lightblue",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: canSetGeofence,
    editable: canSetGeofence,
    geodesic: false,
    zIndex: 1,
  };

  useEffect(() => {
    if (renderCount < 2) {
    } else setMapCenter({});
    setGeofencePointsFromFirebase();
    setRenderCount(renderCount + 1);
    //eslint-disable-next-line
  }, [canSetGeofence]);

  //todo: check why mapCenter doesn't work after it's initialized to the below latlng
  console.log(mapCenter);
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={renderCount <= 1 ? { lat: -33.865143, lng: 151.2099 } : {}}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ disableDefaultUI: true }}
        onClick={(e) => handleMapOnClick(e)}
      >
        {props.children}
        {Object.keys(geofencePoints).length !== 0 ? (
          <Polygon
            onLoad={onPolygonLoad}
            paths={geofencePoints}
            options={polygonOptions}
            editable={true}
            draggable={true}
          />
        ) : null}
        <DropdownButton
          id="dropdown-basic-button"
          title="Actions"
          className="button-group mb-2"
          size="lg"
        >
          <Dropdown.Item
            href="#/action-1"
            onClick={handleSetGeofenceBtn}
            disabled={canSetGeofence}
          >
            Set Geofence
          </Dropdown.Item>

          <Dropdown.Item
            href="#/action-1"
            onClick={handleConfirmGeofenceBtn}
            disabled={!canSetGeofence}
          >
            Confirm Geofence
          </Dropdown.Item>
          <Dropdown.Item href="#/action-2" onClick={handleRemoveGeofenceBtn}>
            Remove Geofence{" "}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogoutBtn}>Logout</Dropdown.Item>
        </DropdownButton>
        {
          <CustomToast
            className="toast"
            show={showGeoEnabledToast}
            onClose={toggleGeoEnabledToast}
            title="Set Geofence Enabled"
            content="Geofencing enabled, when you're done setting it, click confirm to uplaod and co-ordinates"
          />
        }
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
