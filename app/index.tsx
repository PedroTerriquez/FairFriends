import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../services/authContext";
import { useToast } from "@/services/ToastContext";

export default function Index() {
  const { session, loading } = useSession();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (session) {
      router.push("/home");
    } else {
      showToast("Please log in to continue.");
      router.push("/login");
    }
  }, [session, loading]);

  return null;
}
