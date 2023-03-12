import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import { useFetchAllPacienti } from "@/hooks/fetchPacienti";
import { validateNewPacientInfoJOURNEY } from "@/pages/validateInfo";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const Post = () => {
  const router = useRouter();
  const [idpn, setIdpn] = useState();
  useEffect(() => {
    const { idpn } = router.query;
    setIdpn(idpn);
  }, [router]);

  console.log("idpn in idpn.js", idpn);

  const { statuss, allLoading, allError, doc_uid } = useFetchAllPacienti(idpn);
  const { signup } = useAuth();

  const [isEroare, setIsEroare] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [pas, setPas] = useState(1);
  const [next, setNext] = useState();
  const [values, setValues] = useState({
    nume: "",
    email: "",
    password: "",
    telefon: "",
    actIdentitate: "",
    doc_uid: doc_uid,
  });

  const handleNext = (nr) => {
    setErrors(validateNewPacientInfoJOURNEY(values));
    setNext(nr);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const { name } = e.target;
    const fileU = e.target.files[0];
    setValues({
      ...values,
      [name]: fileU,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors(validateNewPacientInfoJOURNEY(values));
    setIsSubmitting(true);
  };

  const log = async (user) => {
    if (user.uid) {
      const addInfo = async () => {
        try {
          await setDoc(
            doc(db, "pacienti", user.uid),
            {
              nume: values.nume,
              email: values.email,
              telefon: values.telefon,
              uid: user.uid,
              doc_uid: doc_uid,
            },
            { merge: true }
          );

          updateProfile(user, {
            displayName: values.nume,
          });

          const editeazaActivStatus = async () => {
            const docRef = doc(db, "medici", doc_uid);
            const docSnap = await getDoc(docRef);
            const pacienti = docSnap.data().pacienti;
            let ij = 1;

            Object.keys(pacienti).map((pacient, i) => {
              if (pacienti[pacient].link === idpn) {
                ij = i + 1;
              }
            });

            if (ij) {
              await setDoc(
                docRef,
                {
                  pacienti: {
                    [ij]: {
                      activate: true,
                      link: "",
                    },
                  },
                },
                { merge: true }
              );
            }
          };
          await editeazaActivStatus();
        } catch (error) {
          setIsEroare(true);
          alert(error);
        }
      };
      await addInfo();
    }
  };
  const forImage = async (user) => {
    const unique_id = uuid();
    const imageRef = ref(
      storage,
      "acteIdentitate_pacienti/" + unique_id + ".png"
    );
    const snapI = await uploadBytes(imageRef, values.actIdentitate);
    const iURL = await getDownloadURL(imageRef);
    const infoRef = doc(db, "pacienti", user.uid);
    await updateDoc(infoRef, { actIdentitate: iURL });
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const forsign = async () => {
        try {
          await signup(values.email, values.password);
          const auth = getAuth();
          const user = auth.currentUser;

          log(user);
          forImage(user);
          // De aici am scos await, daca nu merge trb bagat inapoi await la fiecare functie

          Cookies.set("role", "pacient");

          setIsSubmitting(false);

          console.log("Contul a fost creat");
          router.push("/");
        } catch (error) {
          let errorCode = error.code;
          if (errorCode == "auth/email-already-in-use") {
            alert("Email deja inregistrat");
          }
          setIsEroare(true);
          console.log("Eroare in catch", error);
        }
      };
      forsign();
    }
  }, [errors, isSubmitting]);

  useEffect(() => {
    if (values.actIdentitate) {
      const objectUrl = URL.createObjectURL(values.actIdentitate);
      setSelectedImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [values.actIdentitate]);

  useEffect(() => {
    if (!errors.nume && !errors.telefon && next === 3) {
      setPas(next);
    } else if (!errors.email && !errors.password && next === 4) {
      setPas(next);
    }
  }, [errors]);

  return (
    <div className=" md:border border-c2 rounded-lg md:py-20 md:px-14 w-full md:w-1/2">
      {!allLoading ? (
        <>
          {statuss ? (
            <div className="flex flex-col">
              {pas === 1 && (
                <div className=" flex flex-col items-center text-center">
                  <h2 className=" text-xl font-semibold">Bine ai venit!</h2>
                  <p className="text-lg mt-10">
                    Pentru a-ți face cont va fi nevoie să completezi un scurt
                    formular.
                  </p>
                  <button
                    className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-20 w-5/6 max-w-xs"
                    onClick={() => setPas(2)}
                  >
                    Următorul pas
                  </button>
                </div>
              )}
              {pas === 2 && (
                <div className="flex flex-col justify-center items-center text-xl px-2 text-black">
                  <h1 className="text-2xl font-medium">Signup pacient nou</h1>

                  <input
                    type="text"
                    name="nume"
                    value={values.nume}
                    onChange={handleChange}
                    placeholder="Nume complet"
                    className=" mt-16 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
                  />
                  {errors.nume && (
                    <p className="text-base text-c2 w-full p-2 select-none max-w-lg">
                      {errors.nume}
                    </p>
                  )}

                  <input
                    name="telefon"
                    value={values.telefon}
                    onChange={handleChange}
                    type="telefon"
                    placeholder="Nr de telefon"
                    className="mt-14 outline-none text-slate-900 p-2 w-full max-w-lg duration-300 border-b-2 border-solid focus:border-c3 border-c2"
                  />
                  {errors.telefon && (
                    <p className="text-base text-c2 w-full p-2 select-none max-w-lg">
                      {errors.telefon}
                    </p>
                  )}

                  <button
                    className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-20 w-5/6 max-w-xs"
                    onClick={() => handleNext(3)}
                  >
                    Următorul pas
                  </button>
                </div>
              )}
              {pas === 3 && (
                <div className="flex flex-col justify-center items-center text-xl text-black">
                  <h1 className=" text-2xl font-medium">Pasul #2</h1>

                  <input
                    name="email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Adresa email"
                    className=" mt-16 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
                  />
                  {errors.email && (
                    <p className="text-base text-c2 w-full p-2 select-none max-w-lg">
                      {errors.email}
                    </p>
                  )}

                  <input
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Parola"
                    className=" mt-14 outline-none text-slate-900 p-2 w-full max-w-lg duration-300 border-b-2 border-solid focus:border-c3 border-c2"
                  />
                  {errors.password && (
                    <p className="text-base text-c2 w-full p-2 select-none max-w-lg">
                      {errors.password}
                    </p>
                  )}

                  <button
                    className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-16 w-5/6 max-w-xs"
                    onClick={() => handleNext(4)}
                  >
                    Următorul pas
                  </button>
                </div>
              )}
              {pas === 4 && (
                <div className="flex flex-col bg-c2 rounded-lg text-white p-6 md:w-1/2 self-center">
                  <label className="block text-lg relative">
                    Adaugă act de identitate
                    <input
                      id="actIdentitate"
                      name="actIdentitate"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-2 block w-full text-base rounded-sm cursor-pointer text-white bg-c2 border-c2"
                    />
                  </label>

                  {selectedImage && (
                    <div className="relative h-40 w-3/4 mt-10 rounded-lg overflow-hidden self-center">
                      <Image
                        src={selectedImage}
                        alt="HATz"
                        fill
                        className=" object-cover"
                      />
                    </div>
                  )}
                  <button
                    className="text-center bg-white text-c2 font-medium px-10 py-2 rounded-lg mt-10 w-5/6 self-center max-w-xs"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  {errors.actIdentitate && (
                    <p className="mt-4 text-base w-full text-center select-none max-w-lg">
                      {errors.actIdentitate}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-center">
                Linkul nu mai este valid. Vorbește cu medicul tău de familie
                pentru a primi un nou link de conectare.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center mt-10">
          <i className="fa-solid fa-spinner text-xl"></i>
          <p className="text-xl ml-2">Loading</p>
        </div>
      )}
    </div>
  );
};

export default Post;
