 const socket = io();
 
 // console.log("hey");
 if(navigator.geolocation){
    navigator.geolocation.watchPosition(
     (position) => {
        const { latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    },
     (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
);
 }
 
 const map = L.map("map").setView([0,0], 17)

 var busIcon = L.icon({
    iconUrl: "/images/busIcon3.png", // path to your bus icon image
    iconSize: [38, 38], // size of the icon
    iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
});
 
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
     attribution: "Sandip university"
 }).addTo(map)
 
 const markers = {};

 socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude])
    }else{
        markers[id] = L.marker([latitude,longitude],{ icon: busIcon }).addTo(map);
    }
 });

 socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
 })