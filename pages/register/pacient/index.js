import Link from "next/link";
import React from "react";

function index() {
  return (
    <div className="text-center max-w-md self-center md:border border-c5 rounded-lg md:px-14 md:pb-10">
      <h1 className="mt-10 text-2xl mb-10 md:text-xl">
        Pentru a-ți putea face cont de pacient va trebui să primești o invitație
        pe email de la medicul tău de familie.
      </h1>
      <Link href="/login" className="mt-10 text-2xl md:text-xl">
        Ai deja cont? Login <span className="text-c5 font-semibold">aici.</span>
      </Link>
    </div>
  );
}

export default index;
