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
