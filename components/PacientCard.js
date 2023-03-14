import React, { useEffect, useState } from "react";

export default function PacientCard(props) {
  const [cl, setCl] = useState();
  const {
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
  useEffect(() => {
    const hatz =
      "rounded-lg px-4 py-2 mt-4 first-letter flex justify-between items-center";
    if (!activate) setCl(`bg-gray-200 ${hatz}`);
    else setCl(`border border-black ${hatz}`);
  }, []);

  return (
    <div className={cl}>
      <h1 className=" text-lg">{children.nume}</h1>
      <div>
        <i className="fa-solid fa-pen-to-square"></i>
      </div>
    </div>
  );
}
