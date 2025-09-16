export const getDateStringFromDateTime = (datetime: string) => {
  // map 1702079970098 to 12 Aug
  const date = new Date(parseInt(datetime));
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${day} ${month}`;
};

export const getTimeStringFromDateTime = (
  datetime: string,
  onlyHours?: boolean,
) => {
  // map 1702079970098 to 11:59 PM
  const date = new Date(parseInt(datetime));
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const minutesString = minutes < 10 ? `0${minutes}` : minutes;
  return onlyHours
    ? `${hours12} ${ampm}`
    : `${hours12}:${minutesString} ${ampm}`;
};

export const dateTimeStringToNumber = (datetime: string) => {
  // map 2023-12-08T23:59:30.098Z to 1702079970098
  const date = new Date(datetime);
  return date.getTime();
};

export const getDateStringFromDateTimeForTicket = (datetime: string) => {
  // map 1702079970098 to 12.08.2023
  const date = new Date(parseInt(datetime));
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getDifferenceInDays = (date1: Date, date2: Date) => {
  const diffInMs = date1.getTime() - date2.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
};
