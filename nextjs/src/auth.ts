import NextAuth from "next-auth";
import "next-auth/jwt";

import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  experimental: { enableWebAuthn: true },
  trustHost: true,
});
