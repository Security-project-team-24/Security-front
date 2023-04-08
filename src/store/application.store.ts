import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CertificateStore, certificateStoreSlice } from "./certificate.store";

export type AppStore = CertificateStore;
export const useApplicationStore = create<AppStore>()(
  persist(
    immer((...a) => ({
      ...certificateStoreSlice(...a),
    })),
    {
      name: "application-store",
    }
  )
);
