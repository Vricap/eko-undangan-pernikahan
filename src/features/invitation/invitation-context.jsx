import { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  storeGuestName,
  hasInvitationData,
} from "@/lib/invitation-storage";
import { InvitationContext } from "./invitation-context-definition";

export function InvitationProvider({ children }) {
  const location = useLocation();

  // Ambil slug dari URL jika masih ingin dipakai untuk identitas undangan
  const invitationUid = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    return pathSegments[0] || null;
  }, [location.pathname]);

  // Ambil nama tamu dari ?to=Nama Tamu
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const guestName = urlParams.get("to");

    if (guestName) {
      // URLSearchParams otomatis decode %20 menjadi spasi
      storeGuestName(guestName.trim());
    }

    // Bersihkan query parameter setelah disimpan
    // if (urlParams.has("to") && hasInvitationData()) {
    //   const cleanPath = location.pathname || "/";
    //   window.history.replaceState({}, "", cleanPath);
    // }
  }, [location.pathname, location.search]);

  return (
    <InvitationContext.Provider
      value={{
        uid: invitationUid,
        config: null,
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
}
