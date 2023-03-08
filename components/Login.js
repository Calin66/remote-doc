import { validateLoginInfo } from "@/pages/validateInfo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

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

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const forsign = async () => {
        await login(values.email, values.password).catch(function (error) {
          let errorCode = error.code;
          console.log("errorCode", errorCode);
          setIsEroare(true);
        });

        if (!isEroare) {
          setIsSubmitting(false);
          router.push("/");
        }
      };
      forsign();
    } else {
      console.log("errors", errors);
    }
  }, [errors, isSubmitting]);

  return (
    <div className="w-full flex flex-col items-center px-8">
      <h1 className="mt-10 text-2xl">Login</h1>
      <input
        type="text"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Adresa de email"
        className="mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c4 border-c5 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      {errors.email && (
        <p className="mb-4 text-base text-c5 w-full p-2">{errors.email}</p>
      )}
      <input
        name="password"
        value={values.password}
        onChange={handleChange}
        type="password"
        placeholder="Parola"
        className="mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c4 border-c5 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      {errors.password && (
        <p className="mb-4 text-base text-c5 w-full p-2">{errors.password}</p>
      )}
      <button
        className="text-center bg-c5 text-white font-medium py-3 rounded-lg mt-20 w-5/6 mb-5"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <Link href="/register">Nu ai cont? Signup aici</Link>
    </div>
  );
}
