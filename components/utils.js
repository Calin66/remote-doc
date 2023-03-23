export const addZero = (x) => {
  return (x < 10 ? "0" : "") + x;
};

export const formatMinutes = (time) => {
  return addZero(Math.floor(time / 60)) + ":" + addZero(time % 60);
};

export const convertTimeToMinutes = (x) => {
  if (!x) return 0;
  return (
    x.charAt(0) * 600 +
    x.charAt(1) * 60 +
    x.charAt(3) * 10 +
    x.charAt(4) * 1 -
    "0"
  );
};

export const getTimeDif = (a, b) =>
  convertTimeToMinutes(a) - convertTimeToMinutes(b);

export const formateDate = (date) => {
  return (
    date.charAt(8) +
    date.charAt(9) +
    "." +
    date.charAt(5) +
    date.charAt(6) +
    "." +
    date.charAt(0) +
    date.charAt(1) +
    date.charAt(2) +
    date.charAt(3)
  );
};
