import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (status === "loading") return; // Still loading

      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(false);
    }, [session, status, router]);

    if (status === "loading" || loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!session) {
      return null; // Redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
