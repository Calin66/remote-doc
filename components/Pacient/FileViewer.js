import { useRouter } from "next/router";
import React, { useState } from "react";

function FileViewer({ handlePage }) {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clasa, setClasa] = useState(false);

  const handleClasa = async () => {
    if (clasa === true) {
      setIsSubmitting(true);
      //   setErrors(validateDatePacientInPacienti(valuesLocal));
    } else {
      setClasa(!clasa);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* <div className="relative group w-full h-64 flex justify-center items-center">
        <div className=" text-c2 font-medium text-lg absolute left-0 top-0 w-full h-full rounded-xl bg-white bg-opacity-80 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center content-center align-middle text-center  ">
          <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
          <p className="text-center">Incarca un fisier</p>
        </div>
        <label className="relative z-20 cursor-pointer  hover:text-c3 w-full h-full ">
          <input
            onChange={handleImageChange}
            accept=".jpg, .jpeg .png, .svg, .webp .pdf"
            className="relative z-10 opacity-0 h-full w-full cursor-pointer"
            type="file"
            name="document"
            id="document"
          />
        </label>
      </div> */}
      <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
        <button
          onClick={() => handlePage(0)}
          className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3"
        >
          <i className="fa-solid fa-arrow-left self-center"></i>
        </button>

        <button
          onClick={() => handlePage(2)}
          className=" bg-c2 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white"
        >
          {clasa ? (
            <i className="fa-solid fa-check self-center"></i>
          ) : (
            <i className="fa-solid fa-cloud-arrow-up self-center"></i>
          )}
        </button>
      </div>
    </div>
  );
}

export default FileViewer;
