export const getGreetingsByDateTime = (): string => {
  const now = new Date();
  const currentHour = now.getHours();
  let greeting = "";
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return greeting;
};
