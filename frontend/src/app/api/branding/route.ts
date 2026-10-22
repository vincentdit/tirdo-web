import { NextResponse } from "next/server";
import { getSiteBrand } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export async function GET() {
  const brand = await getSiteBrand();
  return NextResponse.json(brand);
}
