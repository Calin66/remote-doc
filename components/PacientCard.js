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
    if (!activate)
      setCl(
        "bg-gray-200 rounded-lg p-2 mt-4 first-letter flex justify-between items-center"
      );
    else
      setCl(
        "border-gray border rounded-lg p-2 mt-4 first-letter flex justify-between items-center"
      );
  }, []);

  return (
    <div className={cl}>
      <h1 className=" text-lg">{children.nume}</h1>
      <i className="fa-regular fa-pen-to-square"></i>
    </div>
  );
}
