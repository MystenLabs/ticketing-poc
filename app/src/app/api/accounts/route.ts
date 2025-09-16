import { Account } from "@/app/types/Account";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";
export const revalidate = 1;

// request accepts the email in a query param
// returns { account: { address, secretKey } }
// Note: This endpoint requires authentication in production environments
export const GET = async (request: NextRequest) => {
  // required to avoid caching in the deployed app
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  const { searchParams } = new URL(request.url);
  const email: string | null = searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      {
        message: "Provide user email in the query params",
      },
      { status: 400 },
    );
  }

  const account = await kv.get<Account>(email);
  if (!account) {
    return NextResponse.json(
      {
        message: "Account with this email does not exist",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      account,
    },
    { status: 200 },
  );
};
