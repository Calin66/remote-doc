export default function validateInfo(values) {
  let errors = {};
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }
  if (!values.email) {
    errors.email = "Câmp obligatoriu";
  }
  if (!values.password) {
    errors.password = "Câmp obligatoriu";
  } else if (values.password.length < 6) {
    errors.password = "Parola trebuie să aibă minim 6 caractere";
  }
  if (!values.dovada) {
    errors.dovada = "Câmp obligatoriu";
  }
  return errors;
}

export function validateLoginInfo(values) {
  let errors = {};
  if (!values.email) {
    errors.email = "Câmp obligatoriu";
  } else if (!/^[A-Z0-9._%+=]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresa de email nu este validă";
  }

  if (!values.password) {
    errors.password = "Câmp obligatoriu";
  } else if (values.password.length < 6) {
    errors.password = "Parola trebuie să aibă minim 6 caractere";
  }

  return errors;
}
export function validateNewPacientInfo(values) {
  let errors = {};
  if (!values.email) {
    errors.email = "Câmp obligatoriu";
  } else if (!/^[A-Z0-9._%+=]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresa de email nu este validă";
  }
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }
  return errors;
}

export function validateNewPacientInfoJOURNEY(values) {
  let errors = {};
  if (!values.email) {
    errors.email = "Câmp obligatoriu";
  } else if (!/^[A-Z0-9._%+=]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresa de email nu este validă";
  }
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }

  if (!values.telefon) {
    errors.telefon = "Câmp obligatoriu";
  }
  if (!values.actIdentitate) {
    errors.actIdentitate = "Câmp obligatoriu";
  }
  if (!values.password) {
    errors.password = "Câmp obligatoriu";
  } else if (values.password.length < 6) {
    errors.password = "Parola trebuie să aibă minim 6 caractere";
  }

  return errors;
}
export function validateNewAsistentInfo(values) {
  let errors = {};
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }

  if (!values.program_clinica) {
    errors.program_clinica = "Câmp obligatoriu";
  }
  if (!values.program_domiciliu) {
    errors.program_domiciliu = "Câmp obligatoriu";
  }

  return errors;
}
export function validateEditAsistentInfo(values) {
  let errors = {};
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }

  if (!values.program_clinica) {
    errors.program_clinica = "Câmp obligatoriu";
  }
  if (!values.program_domiciliu) {
    errors.program_domiciliu = "Câmp obligatoriu";
  }

  return errors;
}

export function validateDateMedic(values) {
  let errors = {};
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }
  if (!values.email) {
    errors.email = "Câmp obligatoriu";
  } else if (!/^[A-Z0-9._%+=]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresa de email nu este validă";
  }
  // if (!values.nume_clinica) {
  //   errors.nume_clinica = "Câmp obligatoriu";
  // }
  // if (!values.program_clinica) {
  //   errors.program_clinica = "Câmp obligatoriu";
  // }
  // if (!values.program_domiciliu) {
  //   errors.program_domiciliu = "Câmp obligatoriu";
  // }

  return errors;
}

export function validateDatePacient(values) {
  let errors = {};
  if (!values.nume) {
    errors.nume = "Câmp obligatoriu";
  }
  if (!values.email) {
    errors.email = "Câmp obligatoriu";
  } else if (!/^[A-Z0-9._%+=]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresa de email nu este validă";
  }
  if (!values.telefon) {
    errors.telefon = "Câmp obligatoriu";
  }
  if (!values.cnp) {
    errors.cnp = "Câmp obligatoriu";
  }

  return errors;
}

export function validateDatePacientInPacienti(values) {
  let errors = {};

  return errors;
}

export function validateDateConsultatie(values) {
  let errors = {};
  if (!values.data) {
    errors.data = "Câmp obligatoriu";
  }
  if (!values.locul) {
    errors.locul = "Câmp obligatoriu";
  }
  if (!values.simptome) {
    errors.simptome = "Câmp obligatoriu";
  }
  if (!values.diagnostic) {
    errors.diagnostic = "Câmp obligatoriu";
  }
  if (!values.cod) {
    errors.cod = "Câmp obligatoriu";
  }
  if (!values.prescriptie) {
    errors.prescriptie = "Câmp obligatoriu";
  }

  return errors;
}

export function validateNewDocument(values) {
  let errors = {};
  if (!values.fisier) {
    errors.fisier = "Câmp obligatoriu";
  }
  if (!values.titlu) {
    errors.titlu = "Câmp obligatoriu";
  }

  return errors;
}
