import { useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="fixed top-4 right-4 bg-yellow-900/50 border border-yellow-600 text-yellow-300 px-3 py-2 rounded text-sm">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="fixed top-4 right-4 bg-green-900/50 border border-green-600 text-green-300 px-3 py-2 rounded text-sm">
        ✅ Signed in as {session.user?.name || session.user?.email}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-red-900/50 border border-red-600 text-red-300 px-3 py-2 rounded text-sm">
      ❌ Not signed in
    </div>
  );
}
