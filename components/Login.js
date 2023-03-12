import { validateLoginInfo } from "@/pages/validateInfo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEroare, setIsEroare] = useState(false);
  const { login, currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateLoginInfo(values));
    setIsSubmitting(true);
  };

  const forAuth = async (user) => {
    try {
      const docRef = doc(db, "medici", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Cookies.set("role", "medic");
      } else {
        const docRef2 = doc(db, "pacienti", user.uid);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
          Cookies.set("role", "pacient");
        } else {
          console.log("Nu am gasit rol");
        }
      }
    } catch (err) {
      console.log("Eroare in forAuth", err);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const forsign = async () => {
        try {
          await login(values.email, values.password);

          const auth = getAuth();
          const user = auth.currentUser;

          await forAuth(user);

          setIsSubmitting(false);

          router.push("/");
        } catch (error) {
          let errorCode = error.code;
          if (errorCode === "auth/wrong-password")
            setErrors({ password: "Ai introdus parola greșită" });
          else if (errorCode === "auth/user-not-found")
            setErrors({
              email:
                "Nu s-a găsit niciun utilizator cu această adresă de email.",
            });
          console.log("errorCode", errorCode);
          setIsEroare(true);
        }
      };
      forsign();
    } else {
      console.log("errors", errors);
    }
  }, [errors, isSubmitting]);

  return (
    <div className="w-full flex flex-col items-center px-2">
      <h1 className="mt-16 text-2xl font-semibold">Login</h1>
      <input
        type="text"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Adresa de email"
        className="  mt-16 text-xl outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-[40ch]
        "
      />
      {errors.email && (
        <p className="mb-4 text-base text-c2 w-full p-2">{errors.email}</p>
      )}
      <input
        name="password"
        value={values.password}
        onChange={handleChange}
        type="password"
        placeholder="Parola"
        className=" mt-10 text-xl outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      {errors.password && (
        <p className="mb-4 text-base text-c2 w-full p-2">{errors.password}</p>
      )}
      <button
        className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-16 w-5/6"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <Link href="/register" className=" text-lg mt-2">
        Nu ai cont? Fă-ți unul{" "}
        <span className="text-c2 font-semibold">aici.</span>
      </Link>
    </div>
  );
}
