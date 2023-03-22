import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PacientCard({
  id,
  activate,
  children,
  handleDelete,
  link,
  pacient,
}) {
  const router = useRouter();
  const [cl, setCl] = useState();

  const handleClick = () => {
    if (id) router.push(`/pacienti/${id}`);
  };

  // console.log(id);

  useEffect(() => {
    const hatz =
      "rounded-lg p-2 mt-4 first-letter flex justify-between items-center cursor-pointer relative overflow-hidden";
    if (!activate) setCl(`bg-gray-200 ${hatz}`);
    else setCl(`border border-c5 ${hatz}`);
  }, []);

  return (
    <div className={cl} onClick={handleClick}>
      <h1 className=" text-lg">{children.nume}</h1>
      <div>
        {/* <i className="fa-solid fa-pen-to-square"></i> */}
        {!activate && (
          <button
            className="bg-red-600 text-white h-full w-12 absolute top-0 right-0 hover:scale-110"
            onClick={() => handleDelete(link)}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
}
