export const displayLargeNumber = (num: number) => {
  // add commas to large numbers
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
