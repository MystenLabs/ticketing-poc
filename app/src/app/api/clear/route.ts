import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";
export const revalidate = 1;

/*
 * this route is used to clear the KV storage
 * it is only used during the development
 * be careful when using it
 */

export const DELETE = async (request: NextRequest) => {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        message: "Not allowed",
      },
      { status: 403 },
    );
  }
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  const emails = (await kv.get<string[]>("emails")) || [];
  for (const email of emails) {
    await kv.del(email);
  }

  kv.del("emails");

  return NextResponse.json(
    {
      message: "Cleared",
    },
    { status: 200 },
  );
};
