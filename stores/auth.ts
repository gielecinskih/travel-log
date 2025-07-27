import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
  const loading = ref(false);

  const signIn = async () => {
    if (loading.value)
      return;
    loading.value = true;
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });
    }
    finally {
      loading.value = false;
    }
  };

  return {
    loading,

    signIn,
  };
});
