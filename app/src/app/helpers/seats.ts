export const generateRandomSeatNumbers = (quantity: number) => {
  // generate random seat numbers
  const seats: string[] = [];
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  let num = Math.floor(Math.random() * 10);
  for (let i = 0; i < quantity; i++) {
    const seat = `${letter}${num}`;
    num += 1;
    seats.push(seat);
  }
  return seats;
};
