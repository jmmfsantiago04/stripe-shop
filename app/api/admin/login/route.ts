import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionToken, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

type Body = {
    password: string;
};

export async function POST (request: Request) {
    let body: Body;
    try {
        body = await request.json() as Body;
    } catch { 
        return NextResponse.json({ error: "Json invalido" }, { status: 400 });
    }

    const password = body.password;
    if (typeof password !== "string" || password.length === 0) {
        return NextResponse.json({ error: "Senha obrigatoria"}, { status: 400 });
    }   


    try {
        if (!verifyAdminPassword(password)) {
          return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
        }
      } catch {
        return NextResponse.json(
          { error: "Admin não configurado no servidor" },
          { status: 500 },
        );
      }
      const response = NextResponse.json({ ok: true });
      response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }