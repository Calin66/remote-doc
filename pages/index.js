import HomePagePacient from "@/components/HomePagePacient";
import Cookies from "js-cookie";
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
          <div className="text-center flex flex-col">
            <h1 className="text-2xl">
              Scapa de cozile interminabile de la medicul de familie.
            </h1>
            <h2 className="text-2xl mt-10">Fa ti cont pentru a incepe</h2>
          </div>
        )}
      </>
    );
}
