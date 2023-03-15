import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PacientCard(props) {
  const router = useRouter();
  const [cl, setCl] = useState();
  const {
    id,
    activate,
    children,
    edit,
    handleAddEdit,
    edittedValue,
    setEdittedValue,
    pacientKey,
    handleEditPacient,
    handleDelete,
  } = props;

  const handleClick = () => {
    if (id) router.push(`/pacienti/${id}`);
  };

  useEffect(() => {
    const hatz =
      "rounded-lg p-2 mt-4 first-letter flex justify-between items-center";
    if (!activate) setCl(`bg-gray-200 ${hatz}`);
    else setCl(`border border-c5 ${hatz}`);
  }, []);

  return (
    <div className={cl} onClick={handleClick}>
      <h1 className=" text-lg">{children.nume}</h1>
      <div>
        <i className="fa-solid fa-pen-to-square"></i>
      </div>
    </div>
  );
}
