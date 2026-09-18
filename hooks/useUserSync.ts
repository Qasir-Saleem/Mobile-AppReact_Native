import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { useSupabase } from "./useSupabase";

/**
 * Clerk ka user Supabase ki "users" table ke saath sync karta hai.
 * User pehle se ho to sirf is_admin store mein daal deta hai,
 * warna naya row bana deta hai.
 */
export const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const supabase = useSupabase(); // hook hai, is liye () lagana zaroori hai

  useEffect(() => {
    if (!user) return;

    const syncUser = async () => {
      // pehle dekho user mojood hai ya nahi
      const { data, error } = await supabase
        .from("users")
        .select("clerk_id, is_admin")
        .eq("clerk_id", user.id)
        .maybeSingle();

      if (error) {
        console.warn("user fetch fail:", error.message);
        return;
      }

      if (data) {
        setIsAdmin(data.is_admin ?? false);
        return;
      }

      // nahi mila to naya bana do
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
          avatar_url: user.imageUrl,
        })
        .select("is_admin")
        .single();

      if (insertError) {
        console.warn("user insert fail:", insertError.message);
        return;
      }

      setIsAdmin(newUser?.is_admin ?? false);
    };

    syncUser();
  }, [user, supabase, setIsAdmin]);
};
