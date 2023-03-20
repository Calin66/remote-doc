import React, { useEffect } from "react";

import mapboxgl from "!mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"

function Harta({ coordinatesUser, coords }) {
  useEffect(() => {
    const addToMap = (map, coord, color, home) => {
      // console.log("coord", coord);
      if (home) {
        const marker = new mapboxgl.Marker({ color: color })
          .setLngLat(coord)
          .setPopup(
            new mapboxgl.Popup({ closeButton: false }).setHTML(`<div>
                <h1 style="font-weight:500; font-size:18px; text-align:center; margin-bottom:2px">Acasă</h1>
                
              </div>`)
          )
          .addTo(map);
      } else {
        const marker = new mapboxgl.Marker({ color: color })
          .setLngLat(coord.coordinates)
          .setPopup(
            new mapboxgl.Popup({ closeButton: false }).setHTML(`<div>
              <h1 style="font-weight:500; font-size:18px; text-align:center; margin-bottom:10px">Dr. ${coord.nume}</h1>
              <p style="font-size:15px; font-weight:500; margin-bottom:2px">Id utilizator: <span style="font-weight:400; font-size:14px">${coord.id}<span/> </p>

              <p style="font-size:15px; font-weight:500; margin-bottom:2px">Email: <span style="font-weight:400; font-size:14px">${coord.email}<span/></p>
              <p style="font-size:15px; font-weight:500; margin-bottom:2px">Nr. Telefon: <span style="font-weight:400; font-size:14px">${coord.telefon}<span/></p>
              <p style="font-size:15px; font-weight:500; margin-bottom:2px">Program la clinică: <span style="font-weight:400; font-size:14px">${coord.program_clinica}<span/></p>
              <p style="font-size:15px; font-weight:500; margin-bottom:2px">Nr. pacienți: <span style="font-weight:400; font-size:14px">${coord.nr_pacienti}<span/></p>
              <p style="font-size:15px; font-weight:500; margin-bottom:2px">Durata de acasă până la medic: <span style="font-weight:400; font-size:14px">${coord.distance} minute cu mașina <span/></p>
            </div>`)
          )
          .addTo(map);
      }
    };

    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2FsaW4yNTkiLCJhIjoiY2xmZHpzanFtMTJjdzNwbXZ6MTkwMjNkcyJ9.yTt5rWNum4kxQ1em-37ZsA";
    const map = new mapboxgl.Map({
      container: "harta", // container ID
      style: "mapbox://styles/calin259/clfe2ef9d000k01p465zo7uns", // style URL
      center: coordinatesUser, // starting position [lng, lat]
      zoom: 12, // starting zoom
    });
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl());

    // const sw = new mapboxgl.LngLat(coordinatesUser[0], coordinatesUser[1]);

    // const ne = new mapboxgl.LngLat(
    //   coords[0].coordinates[0],
    //   coords[0].coordinates[1]
    // );
    // const llb = new mapboxgl.LngLatBounds(sw, ne);

    // console.log("coords[0]", coords[0].coordinates);
    // console.log("coordinatesUser", coordinatesUser);

    // c1: "#8ECAE6",
    //     c2: "#219EBC",
    //     c3: "#023047",
    //     c4: "#FFB703",
    //     c5: "#FB8500",
    //     c6: "#4364fa",

    addToMap(map, coordinatesUser, "#FB8500", true);

    coords.forEach(async (coord) => {
      await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesUser[0]},${coordinatesUser[1]};${coord.coordinates[0]},${coord.coordinates[1]}?access_token=pk.eyJ1IjoiY2FsaW4yNTkiLCJhIjoiY2xmZTFnYXE0MnlqODNzbzRiaDc3bnpjZyJ9.iURYlh4x03KtuKiPp_2XOw`
      )
        .then((res) => res.json())
        .then((data) => {
          coord.distance = Math.round(data.routes[0].duration / 60);
        });

      // console.log("coord.distance", coord.distance);

      if (coord.distance < 45) addToMap(map, coord, "#219EBC");
      //   console.log("coord", coord);
    });
  }, []);
  return <div id="harta" className="w-screen min-h-hatz" />;
}

export default Harta;
