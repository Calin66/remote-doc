import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const { login, signup, currentUser } = useAuth();
  console.log(currentUser);

  async function submitHandler() {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    if (isLoggingIn) {
      try {
        await login(email, password);
      } catch (err) {
        setError("Incorrect email or password");
      }
      return;
    }
    await signup(email, password);
  }

  return (
    <div className="w-full 300 flex flex-col items-center">
      <h1 className="mt-10 text-2xl font-semibold">Sunt</h1>
      <Link
        href="/register/medic"
        className=" w-3/4  bg-c2 flex flex-col justify-center text-center py-20 mt-10 rounded-xl"
      >
        <i className="fa-solid fa-user-doctor text-white text-6xl"></i>
      </Link>
      <Link
        href="/register/pacient"
        className=" w-3/4 bg-c5 flex flex-col justify-center text-center py-20 mt-10 rounded-xl"
      >
        <i className="fa-solid fa-user text-white text-6xl"></i>
      </Link>
      <Link href="/login" className="mt-10 text-2xl">
        Ai deja cont? Login <span className="text-c2 font-semibold">aici</span>
      </Link>
    </div>
  );
}
