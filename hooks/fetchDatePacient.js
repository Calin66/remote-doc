// import React, { useState, useEffect } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { useAuth } from "../context/AuthContext";
// import { db } from "../firebase";
// import Cookies from "js-cookie";
// import _ from "lodash";

// export default function useFetchPacient(id) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [date, setDate] = useState({});

//   //   const handleEditDate = async (valoriLocal, valoriDb) => {
//   //     if (_.isEqual(valoriDb, valoriLocal)) {
//   //       console.log("Sunt egale nu am facut nimic");
//   //     } else if (user.uid) {
//   //       try {
//   //         await setDoc(
//   //           doc(db, "medici", user.uid),
//   //           {
//   //             nume: valoriLocal.nume,
//   //             email: valoriLocal.email,
//   //             nume_clinica: valoriLocal.nume_clinica,
//   //             program_clinica: valoriLocal.program_clinica,
//   //             program_domiciliu: valoriLocal.program_domiciliu,
//   //             locatie_clinica: valoriLocal.locatie_clinica,
//   //             asistenti: valoriLocal.asistenti,
//   //           },
//   //           { merge: true }
//   //         );
//   //         console.log("Changes synced with db");
//   //       } catch (error) {
//   //         console.log("eroare in catch in fetchDateSetari", error);
//   //       }
//   //     }
//   //   };

//   const { currentUser } = useAuth();
//   const role = Cookies.get("role");

//   useEffect(() => {
//     async function fetchData() {
//       if (Object.keys(date).length !== 0) {
//         // console.log("date in fetch", date);
//         setLoading(false);
//       } else if (currentUser && role === "medic") {
//         try {
//           const docRef = doc(db, "pacienti", id);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const dat = docSnap.data();
//             // const dateAici = {};

//             // Object.keys(valuesLocal).map((cheie, i) => {
//             //   if (dat[cheie]) dateAici[cheie] = dat[cheie];
//             //   else {
//             //     dateAici[cheie] = valuesLocal[cheie];
//             //   }
//             // });
//             setDate(dat);
//           } else {
//             console.log("Schimb date la {}");
//             setDate({});
//           }
//         } catch (err) {
//           setError("Failed to load pacient data");
//           console.log(err);
//         }
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);
//   return { loading, error, date };
// }
