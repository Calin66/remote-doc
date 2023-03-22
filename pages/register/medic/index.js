import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import validateInfo from "@/pages/validateInfo";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function index() {
  const router = useRouter();

  const [pas, setPas] = useState(1);
  const [values, setValues] = useState({
    nume: "",
    email: "",
    telefon: "",
    password: "",
    program_clinica: "",
    program_domiciliu: "",
    dovada: "",
  });
  const [selectedImage, setSelectedImage] = useState();

  const [next, setNext] = useState();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEroare, setIsEroare] = useState(false);
  const { signup } = useAuth();

  const handleNext = (nr) => {
    console.log("handle Next");
    setErrors(validateInfo(values));
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
    setErrors(validateInfo(values));
    setIsSubmitting(true);
  };
  const log = async (user) => {
    if (user.uid) {
      const addInfo = async () => {
        try {
          await setDoc(doc(db, "medici", user.uid), {
            nume: values.nume,
            email: values.email,
            telefon: values.telefon,
            program_clinica: values.program_clinica,
            program_domiciliu: values.program_domiciliu,
            uid: user.uid,
            pacienti: {},
          });
        } catch (error) {
          setIsEroare(true);
          alert(error);
        }
        updateProfile(user, {
          displayName: values.nume,
        }).catch((error) => {
          setIsEroare(true);
          alert(error);
        });
      };
      await addInfo();
      if (!isEroare) {
        alert("Contul dumneavoastra a fost creat");
      }
    }
  };

  const forImage = async (user) => {
    const unique_id = uuid();
    const imageRef = ref(storage, "dovezi/" + unique_id);
    const snapI = await uploadBytes(imageRef, values.dovada);
    const iURL = await getDownloadURL(imageRef);
    const infoRef = doc(db, "medici", user.uid);
    await updateDoc(infoRef, { dovada: iURL });
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const forsign = async () => {
        try {
          await signup(values.email, values.password);

          const auth = getAuth();
          const user = auth.currentUser;
          console.log("User inainte de cele doua functii", user);

          await log(user);
          await forImage(user);

          setIsSubmitting(false);

          Cookies.set("role", "medic");
          router.push("/harta");
        } catch (error) {
          let errorCode = error.code;
          if (errorCode == "auth/email-already-in-use") {
            alert("Email deja inregistrat");
          }
          setIsEroare(true);
          console.log("errorCode", errorCode);
        }
      };
      forsign();
    } else {
      console.log("errors", errors);
    }
  }, [errors]);

  useEffect(() => {
    if (
      !errors.nume &&
      !errors.email &&
      !errors.telefon &&
      !errors.password &&
      next === 2
    ) {
      console.log("handlePas");
      setPas(next);
    } else if (
      !errors.nume &&
      !errors.email &&
      !errors.telefon &&
      !errors.password &&
      !errors.dovada &&
      next === 3
    ) {
      console.log("handlePas");
      setPas(next);
    }
  }, [errors]);

  useEffect(() => {
    if (values.dovada) {
      const objectUrl = URL.createObjectURL(values.dovada);
      setSelectedImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [values.dovada]);
  return (
    <div className="md:w-1/2 self-center md:border border-c2 rounded-lg md:py-20 md:flex flex-col w-full">
      {pas === 1 && (
        <div className="flex flex-col justify-center items-center text-xl text-black">
          <h1 className="text-2xl font-medium mb-10">Signup Medic</h1>

          <input
            type="text"
            name="nume"
            value={values.nume}
            onChange={handleChange}
            placeholder="Nume complet"
            className=" mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
          />
          {errors.nume && (
            <p className="text-base text-c2 w-full p-2 max-w-lg ">
              {errors.nume}
            </p>
          )}
          <input
            name="email"
            type="text"
            value={values.email}
            onChange={handleChange}
            placeholder="Adresa email"
            className=" mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
          />
          {errors.email && (
            <p className="text-base text-c2 w-full p-2 max-w-lg">
              {errors.email}
            </p>
          )}
          <input
            name="telefon"
            type="text"
            value={values.telefon}
            onChange={handleChange}
            placeholder="Nr. telefon"
            className=" mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
          />
          {errors.telefon && (
            <p className="text-base text-c2 w-full p-2 max-w-lg">
              {errors.telefon}
            </p>
          )}
          <input
            name="password"
            value={values.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="mt-14 outline-none text-slate-900 p-2 w-full max-w-lg duration-300 border-b-2 border-solid focus:border-c3 border-c2"
          />
          {errors.password && (
            <p className=" text-base text-c2 w-full p-2 max-w-lg">
              {errors.password}
            </p>
          )}

          <button
            className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-24 w-5/6 max-w-xs hover:scale-110"
            onClick={() => handleNext(2)}
          >
            Următorul pas
          </button>
        </div>
      )}
      {pas === 2 && (
        <div className="flex flex-col bg-c2 rounded-lg text-white p-6 md:w-1/2 self-center">
          <label className="block text-lg relative">
            Adaugă dovada că ești medic
            <input
              id="dovada"
              name="dovada"
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
            className="text-center bg-white text-c2 font-medium px-10 py-3 rounded-lg mt-10 w-5/6 self-center max-w-xs hover:scale-110"
            onClick={() => handleNext(3)}
          >
            Următorul pas
          </button>
          {errors.dovada && (
            <p className="my-4 text-base w-full text-center max-w-lg">
              {errors.dovada}
            </p>
          )}
          <p className="text-center">
            Atenție! Pacientul va putea vedea această dovadă pentru a se asigura
            că sunteți un medic real
          </p>
        </div>
      )}
      {pas === 3 && (
        <div className="flex flex-col justify-center items-center text-xl text-black">
          <h1 className="text-2xl font-medium mb-10">Program de lucru</h1>

          <input
            type="text"
            name="program_clinica"
            value={values.program_clinica}
            onChange={handleChange}
            placeholder="Program la clinică"
            className=" mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
          />

          <input
            name="program_domiciliu"
            type="text"
            value={values.program_domiciliu}
            onChange={handleChange}
            placeholder="Program domiciliu"
            className=" mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
          />

          <button
            className="text-center bg-c2 text-white font-medium px-10 py-3 rounded-lg mt-10 w-5/6 self-center max-w-xs hover:scale-110"
            onClick={handleSubmit}
          >
            Următorul pas
          </button>
        </div>
      )}
    </div>
  );
}

export default index;
