import HomePagePacient from "@/components/HomePagePacient";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  const role = Cookies.get("role");

  if (currentUser && role === "pacient") return <HomePagePacient />;
  else
    return (
      <>
        {currentUser ? (
          <h1>JONULE TE-AI LOGAT</h1>
        ) : (
          <div className="text-center flex flex-col w-screen h-screen mt-0 absolute top-0 items-center justify-center">
            <Image
              fill
              src="/background-pic.jpg"
              alt=""
              style={{ objectFit: "cover" }}
            />
            <div className=" bg-black opacity-40 absolute w-screen h-screen z-10"></div>
            <div className="z-20 bg-white w-screen h-16 font-medium text-2xl flex items-center justify-center fixed top-0 shadow-md">
              <Link href="/" className=" text-2xl font-bold">
                <span className=" font-normal">Remote</span>{" "}
                <span className=" text-c2 ">Doc</span>
              </Link>
            </div>
            <div className="z-20">
              <h1 className="text-3xl  text-white sm:border-b px-6 py-2 italic">
                Mai rapid. Mai ieftin. Mai sigur.
              </h1>
              <div className=" mt-10">
                <Link
                  href="/login"
                  className="bg-c2 text-white rounded-2xl rounded-tr-none w-40 py-2 font-medium text-lg sm:mr-10 inline-block mb-2 mr-4"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className=" text-white border border-c2 rounded-2xl rounded-bl-none w-40 py-2 font-medium text-lg inline-block mb-2"
                >
                  Signup
                </Link>
              </div>
              {/* <h2 className="text-2xl mt-10">Fa ti cont pentru a incepe</h2> */}
            </div>
          </div>
        )}
      </>
    );
}
