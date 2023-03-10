import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import validateInfo from "@/pages/validateInfo";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import Image from "next/image";
import { useRouter } from "next/router";

function index() {
  const router = useRouter();

  const [pas, setPas] = useState(1);
  const [values, setValues] = useState({
    nume: "",
    email: "",
    password: "",
    dovada: "",
  });
  const [selectedImage, setSelectedImage] = useState();

  const [next, setNext] = useState();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEroare, setIsEroare] = useState(false);
  const { signup } = useAuth();

  const handleNext = (nr) => {
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

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const forsign = async () => {
        await signup(values.email, values.password).catch(function (error) {
          let errorCode = error.code;
          if (errorCode == "auth/email-already-in-use") {
            alert("Email deja inregistrat");
            setIsEroare(true);
          }
          console.log("errorCode", errorCode);
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
          router.push("/");
        }
      };
      forsign();
    } else {
      console.log("errors", errors);
    }
  }, [errors]);

  useEffect(() => {
    if (!errors.nume && !errors.email && !errors.password && next) {
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
    <div className="px-8">
      {pas === 1 && (
        <div className="flex flex-col justify-center items-center mt-20 text-xl px-2 text-black">
          <input
            type="text"
            name="nume"
            value={values.nume}
            onChange={handleChange}
            placeholder="Nume complet"
            className=" mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-[40ch]"
          />
          {errors.nume && (
            <p className="mb-4 text-base text-c2 w-full p-2">{errors.nume}</p>
          )}
          <input
            name="email"
            type="text"
            value={values.email}
            onChange={handleChange}
            placeholder="Adresa email"
            className=" mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-[40ch]"
          />
          {errors.email && (
            <p className="mb-4 text-base text-c2 w-full p-2">{errors.email}</p>
          )}

          <input
            name="password"
            value={values.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="mt-10 outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid focus:border-c3 border-c2"
          />
          {errors.password && (
            <p className="mb-4 text-base text-c2 w-full p-2">
              {errors.password}
            </p>
          )}

          <button
            className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-20 w-5/6"
            onClick={() => handleNext(2)}
          >
            Următorul pas
          </button>
        </div>
      )}
      {pas === 2 && (
        <div className="flex flex-col bg-c2 rounded-lg text-white p-6 mt-20">
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
            className="text-center bg-white text-c2 font-medium px-10 py-3 rounded-lg mt-10 w-4/6 self-center"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {errors.dovada && (
            <p className="mt-4 text-base w-full text-center">{errors.dovada}</p>
          )}
        </div>
      )}
      {pas === 3 && <div></div>}
    </div>
  );
}

export default index;
