import { kv } from "@vercel/kv";

export const incrementVisit = async (): Promise<number> => {
  let pageVisits = await kv.get<number>("pageVisits");

  // Handle the potential null value
  if (pageVisits === null) {
    pageVisits = 0;
  }

  await kv.set("pageVisits", pageVisits + 1);
  const updatedPageVisits = await kv.get<number>("pageVisits");
  return updatedPageVisits || 0; // Handle potential null value here too
};

export const getVisits = async (): Promise<number> => {
  const pageVisits = await kv.get<number>("pageVisits");
  return pageVisits || 0; // Handle potential null value
};
