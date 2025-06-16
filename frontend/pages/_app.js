import "../src/index.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../src/context/AuthContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}
