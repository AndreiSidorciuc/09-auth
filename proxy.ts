import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = request.cookies;
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
        const apiRes = await fetch(
          `${request.nextUrl.origin}/api/auth/session`,
          {
            headers: {
              Cookie: request.headers.get("cookie") ?? "",
            },
          },
        );

        const setCookie = apiRes.headers.get("set-cookie");

        if (setCookie) {
          const response = isPublicRoute
            ? NextResponse.redirect(new URL("/profile", request.url))
            : NextResponse.next();

          response.headers.set("set-cookie", setCookie);

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
