import { useAuth } from "@clerk/expo";
import { useMemo, useRef } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";

export function useSupabase() {
  const { getToken } = useAuth();

  // getToken har render par naya function hota hai. Usay ref mein rakhte hain
  // taake client sirf EK baar bane, warna har render par naya client banega
  // aur effects baar baar chalte rahenge (infinite loop).
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const client = useMemo(
    () => createClerkSupabaseClient(() => getTokenRef.current()),
    [],
  );

  return client;
}
