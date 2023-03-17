import { db } from "@/firebase";
import { validateNewDocument } from "@/pages/validateInfo";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function FileUploader({ handlePage, id }) {
  const labels = {
    // fisier: "",
    titlu: "Titlu",
    observatii: "Observatii",
  };

  const [valuesLocal, setValuesLocal] = useState({
    fisier: "",
    titlu: "",
    observatii: "",
    // owner: "",
    // corespondent:"",
    // date
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clasa, setClasa] = useState(true);

  const handleImageChange = (e) => {
    const { name } = e;
    const fileU = e.target.files[0];
    // console.log("fileU", fileU);
    setValuesLocal({
      ...valuesLocal,
      fisier: fileU,
    });
  };

  const handleClasa = async () => {
    if (clasa === true) {
      setIsSubmitting(true);
      setErrors(validateNewDocument(valuesLocal));
    } else {
      setClasa(!clasa);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValuesLocal({
      ...valuesLocal,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length === 0) {
      setIsSubmitting(false);

      const updatePacienti = async () => {
        try {
          await addDoc(collection(db, "fisiere"), {}, { merge: true });
          console.log("Changes synced with db");
        } catch (error) {
          console.log("eroare in catch in fetchDateSetari", error);
        }
      };
    }
  }, [isSubmitting, errors]);

  return (
    <div className=" min-h-hatz">
      <div className="w-full flex flex-col">
        <h1 className=" text-xl font-medium duration-300 text-black w-full mb-10">
          Adauga fisier
        </h1>
        <div className="w-full mb-20 ">
          <label
            className={
              errors.fisier
                ? "cursor-pointer shadow-4xl border border-c5 hover:text-c3 w-full p-4  h-52 relative bg-white rounded-2xl flex flex-col justify-center"
                : "cursor-pointer shadow-3xl border border-c1 hover:text-c3 w-full p-4  h-52 relative bg-white rounded-2xl flex flex-col justify-center"
            }
          >
            {/* {console.log(valuesLocal.fisier)} */}
            {valuesLocal.fisier ? (
              <div className="text-center text-c2">
                <i className="fa-solid fa-circle-check text-center  text-2xl"></i>
                <p>{valuesLocal.fisier.name}</p>
              </div>
            ) : (
              <div
                className={
                  errors.fisier ? "text-center text-c5" : "text-center text-c2"
                }
              >
                <i className="fa-solid fa-cloud-arrow-up text-2xl  "></i>
                <p>Incarca un fisier</p>
              </div>
            )}
            <input
              onChange={handleImageChange}
              accept=".jpg, .jpeg .png, .svg, .webp .pdf"
              className="opacity-0 h-full w-full absolute"
              type="file"
            />
          </label>
        </div>

        <div className="w-full mb-20">
          <label className=" text-xl font-medium duration-300 text-black w-full">
            {labels.titlu}
            <input
              onChange={handleChange}
              type="text"
              name="titlu"
              value={valuesLocal.titlu}
              className={
                errors.titlu
                  ? "outline-none w-full max-w-lg font-normal mt-4 border-c5 border-b-2 p-2"
                  : "outline-none w-full max-w-lg font-normal mt-4 border-c1 border-b-2 p-2"
              }
            />
          </label>
        </div>
        <div className="w-full mb-20">
          <label className=" text-xl font-medium duration-300 text-black w-full">
            {labels.observatii}
            <textarea
              onChange={handleChange}
              type="text"
              name="observatii"
              value={valuesLocal.observatii}
              className={
                errors.titlu
                  ? "outline-none w-full max-w-lg mt-4 bg-orange-50 border-c5 h-28 border-b-2 p-2 font-normal text-base"
                  : "outline-none w-full max-w-lg mt-4 bg-blue-50 border-c1 h-28 border-b-2 p-2 font-normal text-base"
              }
            />
          </label>
        </div>

        <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
          <button
            onClick={() => handlePage(1)}
            className=" bg-c5 text-lg flex align-middle justify-center
  rounded-full w-12 h-12 center text-white mr-3"
          >
            <i className="fa-solid fa-arrow-left self-center"></i>
          </button>

          <button
            onClick={handleClasa}
            className=" bg-c2 text-lg flex align-middle justify-center
  rounded-full w-12 h-12 center text-white"
          >
            <i className="fa-solid fa-check self-center"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
