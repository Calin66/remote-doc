import useFetchForMap from "@/hooks/fetchForMap";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";

const AutofillInMap = dynamic(
  () => import("@/components/harta/AutofillInMap"),
  {
    ssr: false,
  }
);
const role = Cookies.get("role");

const Harta = dynamic(() => import("@/components/harta/Harta"), {
  ssr: false,
});

function index() {
  const role = Cookies.get("role");
  const router = useRouter();

  const { coordinatesUser, markers, setCoordinatesUser, loading, error } =
    useFetchForMap();

  // const [lng, setLng] = useState(27.56644224058531);
  // const [lat, setLat] = useState(47.18529332450688);

  // fitBounds with padding and coordonates of markers

  // const getCoordinates = () => {
  //   const location = "Iasi";
  //   fetch(
  //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?` +
  //       new URLSearchParams({
  //         access_token: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
  //         limit: 1,
  //       })
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       markers.push();
  //       // console.log(data.features[0].center);
  //     });
  // };

  // useEffect(() => {
  //   getCoordinates();
  // }, []);

  console.log("In index.js de la harta");

  if (!loading && coordinatesUser.length && role === "medic") {
    console.log("AM PLECAT");
    setCoordinatesUser([]);
    router.push("/");
  }

  console.log("markers", markers);

  if (!loading)
    return (
      <>
        {!coordinatesUser.length && (
          <AutofillInMap setCoordinates2={setCoordinatesUser} />
        )}
        {coordinatesUser.length && role === "pacient" ? (
          <Harta
            coordinatesUser={coordinatesUser}
            coords={markers}
            setCoordinates2={setCoordinatesUser}
          />
        ) : (
          <div></div>
        )}
      </>
    );
  else return <div className="text-xl font-medium">Loading...</div>;
}

export default index;
