import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

import {
  AddressAutofill,
  AddressMinimap,
  useConfirmAddress,
  config,
  SearchBox,
} from "@mapbox/search-js-react";
import Cookies from "js-cookie";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

export default function AutofillInMap({ setCoordinates2 }) {
  const role = Cookies.get("role");

  const auth = getAuth();
  const user = auth.currentUser;

  const [confirm, setConfirm] = useState(false);
  const [showFormExpanded, setShowFormExpanded] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [feature, setFeature] = useState();
  const [showValidationText, setShowValidationText] = useState(false);
  const [token, setToken] = useState("");
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const accessToken =
      "pk.eyJ1IjoiY2FsaW4yNTkiLCJhIjoiY2xmZTFnYXE0MnlqODNzbzRiaDc3bnpjZyJ9.iURYlh4x03KtuKiPp_2XOw";
    setToken(accessToken);
    config.accessToken = accessToken;
  }, []);

  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    skipConfirmModal: (feature) => {
      ["exact", "high"].includes(feature.properties.match_code.confidence);
    },
  });

  const handleRetrieve = useCallback(
    (res) => {
      const feature = res.features[0];
      setCoordinates(feature.geometry.coordinates);
      setFeature(feature);
      setShowMinimap(true);
      setShowFormExpanded(true);
    },
    [setFeature, setShowMinimap]
  );

  function handleSaveMarkerLocation(coordinate) {
    setCoordinates(coordinate);
    console.log(`Marker moved to ${JSON.stringify(coordinate)}.`);
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await showConfirm();
      if (result.type === "nochange" && confirm) submitForm();
    },
    [showConfirm]
  );

  function submitForm() {
    setShowValidationText(true);
    console.log("SUBMIT FORM");
    try {
      const updateDB = async () => {
        if (role === "medic") {
          const docRef = doc(db, "medici", user.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();

          console.log("data", data);

          const nr_pacienti =
            Object.keys(data.pacienti).length === 0
              ? 0
              : Math.max(...Object.keys(data.pacienti));

          console.log("mi", {
            coordinates: coordinates,
            nume: data.nume,
            email: data.email,
            telefon: data.telefon,
            program_clinica: data.program_clinica,
            nr_pacienti: nr_pacienti,
            id: user.uid,
          });

          await setDoc(
            doc(db, "markers", user.uid),
            {
              coordinates: coordinates,
              nume: data.nume,
              email: data.email,
              telefon: data.telefon || "",
              program: data.program || "",
              nr_pacienti: nr_pacienti,
              id: user.uid,
            },
            { merge: true }
          );
        } else if (role === "pacient") {
          await setDoc(
            doc(db, "pacienti", user.uid),
            {
              coordinates: coordinates,
            },
            { merge: true }
          );
        }
      };
      updateDB();
      setCoordinates2(coordinates);
    } catch (error) {
      console.log(error);
    }
    // here upload to db coordinates array
  }

  useEffect(() => {
    console.log("coordinates", coordinates);
  }, [coordinates]);

  console.log("IN AUTOFILLMAP");

  return (
    <>
      {role === "medic" ? (
        <p className="text-lg text-center w-full px-8 mb-8">
          Introdu adresa ta de munca mai jos pentru ca pacientii dvs si alti
          pacienti sa va poata gasi
        </p>
      ) : (
        <p className="text-lg text-center w-full px-8 mb-8">
          Pentru a putea folosi feature ul de harta si a vedea medicii din
          apropiere va trebui sa iti introduci adresa mai jos si sa confirmi
          locatia
        </p>
      )}
      <form ref={formRef} className="flex flex-col " onSubmit={handleSubmit}>
        <div className=" flex flex-col w-full  items-center text-xl font-medium mb-5">
          {/* Input form */}
          <label className=" ">
            {role === "medic" ? "Adresa cabinetului" : "Adresa de domiciliu"}
          </label>

          <AddressAutofill
            accessToken={token}
            onRetrieve={handleRetrieve}
            options={{ language: "ro", country: "Ro" }}
          >
            <input
              className={
                "px-4 py-1 border-b-2 mt-1 border-c6 bg-purple-50 font-normal"
              }
              placeholder="Oras, Strada, Nr."
              autoComplete="address-line1"
              id="mapbox-autofill"
            />
          </AddressAutofill>
        </div>
        <div className="col col--auto-mm">
          {/* Visual confirmation map */}
          <div id="minimap-container" className=" h-96 w-screen relative mt-18">
            <AddressMinimap
              keepMarkerCentered={true}
              canAdjustMarker={true}
              satelliteToggle={true}
              feature={feature}
              show={showMinimap}
              footer={false}
              onSaveMarkerLocation={handleSaveMarkerLocation}
            />
          </div>
        </div>

        {/* Form buttons */}
        {showFormExpanded && (
          <div className="flex w-full justify-center mt-5 ">
            <button
              onClick={() => setConfirm(true)}
              type="submit"
              className="bg-c6 text-white py-2 rounded-md font-medium w-28"
              id="btn-confirm"
            >
              Confirm
            </button>
          </div>
        )}
      </form>
    </>
  );
}
