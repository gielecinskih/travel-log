import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  const init = async () => {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  };

  const user = computed(() => session.value?.data?.user);

  const loading = computed(() => session.value?.isPending);
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
    init,

    loading,
    signIn,
    signOut,
    user,
  };
});
