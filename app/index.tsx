import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../services/authContext";

export default function Index() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (session) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [session, loading]);

  return null;
}
