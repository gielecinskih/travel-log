import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
  const session = authClient.useSession();
  const user = computed(() => session.value.data?.user);

  const loading = computed(() => session.value.isPending || session.value.isRefetching);
  const signIn = async () => {
    if (loading.value)
      return;
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });
    }
    catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
    }
    catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    loading,
    signIn,
    signOut,
    user,
  };
});
