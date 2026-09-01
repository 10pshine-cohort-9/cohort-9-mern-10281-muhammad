import { useEffect, type ReactElement } from "react";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

type Props = {
  children: ReactElement;
};

export default function AuthProvider({ children }: Props): ReactElement {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { accessToken, user } = await authService.refresh();

        setAuth(accessToken, user);
      } catch {
        setAuth(null, null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setAuth, setLoading]);

  return children;
}
