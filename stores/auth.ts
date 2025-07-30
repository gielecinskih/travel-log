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

    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
        fetchOptions: {
          headers,
        },
      });
    }
    catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    try {
      await authClient.signOut({
        fetchOptions: {
          headers,
        },
      });
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
