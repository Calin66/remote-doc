import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import validateInfo from "@/pages/validateInfo";
import { getAuth } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";

function index() {
  const [pas, setPas] = useState(1);
  const [values, setValues] = useState({
    nume: "",
    email: "",
    password: "",
    dovada: "",
  });
  const [errors, setErrors] = useState(validateInfo(values));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEroare, setIsEroare] = useState(false);
  const { signup } = useAuth();

  const handleNext = (nr) => {
    if (!errors.nume && !errors.password && !errors.email) {
      setPas(nr);
    }
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
  const handleNext = (e) => {};
  const log = async () => {
    // aici ar trebui sa vina datele aditionale despre utilizator. foloseste uid
    const auth = getAuth();
    const user = auth.currentUser;
    if (user.uid) {
      const addInfo = async () => {
        try {
          await setDoc(doc(db, "medici", user.uid), {
            nume: values.nume,
            email: values.email,
            uid: user.uid,
          });
        } catch (error) {
          setIsEroare(true);
          alert(error);
        }
      };
      await addInfo();
      if (!isEroare) {
        alert("Contul dumneavoastra a fost creat");
      }
    }
  };

  console.log(values.dovada);
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const forsign = async () => {
        await signup(values.email, values.password).catch(function (error) {
          let errorCode = error.code;
          if (errorCode == "auth/email-already-in-use") {
            alert("Email deja inregistrat");
            setIsEroare(true);
          }
          console.log(errorCode);
        });
        //pt imagine si date extra
        if (!isEroare) {
          const auth = getAuth();
          const user = auth.currentUser;
          log();
          const forImage = async () => {
            const unique_id = uuid();
            const imageRef = ref(storage, "dovezi/" + unique_id + ".png");
            const snapI = await uploadBytes(imageRef, values.dovada);
            const iURL = await getDownloadURL(imageRef);
            const infoRef = doc(db, "medici", user.uid);
            await updateDoc(infoRef, { dovada: iURL });
          };
          await forImage();
          setIsSubmitting(false);
        }
      };
      forsign();
    } else {
      console.log(errors);
    }
  }, [errors]);

  useEffect(() => {
    setErrors(validateInfo(values));
    console.log("errors", errors);
  }, [values]);

  return (
    <>
      {pas === 1 && (
        <div className="flex flex-col justify-center items-center mt-20 text-xl px-2 text-black">
          <input
            type="text"
            name="nume"
            value={values.nume}
            onChange={handleChange}
            placeholder="Nume complet"
            className="mb-10 outline-none duration-300 border-b-2 border-solid border-white focus:border-c5 text-slate-900 p-2 w-full max-w-[40ch]"
          />
          {errors.nume && <p>{errors.nume}</p>}
          <input
            name="email"
            type="text"
            value={values.email}
            onChange={handleChange}
            placeholder="Adresa email"
            className="mb-10 outline-none duration-300 border-b-2 border-solid border-white focus:border-c5 text-slate-900 p-2 w-full max-w-[40ch]"
          />
          {errors.email && <p>{errors.email}</p>}

          <input
            name="password"
            value={values.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="mb-10 outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-c5"
          />
          {errors.password && <p>{errors.password}</p>}

          <button
            className="text-center bg-c5 text-white font-medium px-10 py-3 rounded-lg mt-10 w-4/6"
            onClick={() => handleNext(2)}
          >
            Următorul pas
          </button>
        </div>
      )}
      {pas === 2 && (
        <div>
          <div>
            <input name="dovada" type="file" onChange={handleImageChange} />
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {pas === 3 && <div></div>}
    </>
  );
}

export default index;
