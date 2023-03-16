import { db } from "@/firebase";
import useFetchPacient from "@/hooks/fetchDatePacient";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const index = (req) => {
  const router = useRouter();
  const [id, setId] = useState();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(false);
  // const { allLoading, allError, statuss, doc_uid } = useFetchPacient(id);

  const handlePage = () => {
    setPage(!page);
  };

  useEffect(() => {
    const { id } = router.query;
    setId(id);
  }, [router]);

  useEffect(() => {
    if (id) {
      const gettingPacient = async () => {
        const docRef = doc(db, "pacienti", id);
        const docSnap = await getDoc(docRef);

        setValues(docSnap.data());
        setLoading(false);
      };
      gettingPacient();
    }
  }, [id]);

  useEffect(() => {
    console.log("values", values);
  }, [loading]);

  if (!loading)
    return (
      <div className="mt-14 min-h-hatz">
        {!page && (
          <div className=" w-full flex flex-col ">
            <h1>{values.nume}</h1>
          </div>
        )}
        {page && (
          <div className="w-full flex flex-col">
            <h1>HATZ HONUULE</h1>
          </div>
        )}
        <button
          onClick={handlePage}
          className=" bg-c2 text-2xl flex align-middle justify-center
            rounded-full w-16 h-16 center text-white fixed bottom-8 right-4 md:right-14 md:top-12"
        >
          <i className="fa-solid fa-file self-center"></i>
        </button>
      </div>
    );
  else return <div></div>;
};

export default index;
