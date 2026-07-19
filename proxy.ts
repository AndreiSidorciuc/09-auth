import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const apiRes = await checkSession();

        const setCookieHeader = apiRes.headers["set-cookie"];

        if (setCookieHeader) {
          const response = isPublicRoute
            ? NextResponse.redirect(new URL("/profile", request.url))
            : NextResponse.next();

          const cookiesToForward = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookiesToForward.forEach((cookie) => {
            response.headers.append("set-cookie", cookie);
          });

          return response;
        }
      } catch {
        // Refresh failed — fall through to the unauthenticated branch below.
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
