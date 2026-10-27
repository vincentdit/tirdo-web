import { NextResponse } from "next/server";
import { getEServices } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getEServices();
  return NextResponse.json({
    items: items.filter((e) => e.showInPortal),
  });
}
