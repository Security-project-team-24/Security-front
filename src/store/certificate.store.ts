import { StateCreator } from "zustand";
import { Certificate } from "./types/certificate";
import { Issuer } from "./types/issuer";
import axios from "axios";
import env from "react-dotenv";
import produce from "immer";

export type CertificateActions = {
  generateCertificatesRes: () => Promise<void>;
  getIssuers: () => Promise<void>;
};

export type CertificateState = {
  certificates: Certificate[];
  issuers: Issuer[];
};

export type CertificateStore = CertificateState & CertificateActions;

export const certificateStoreSlice: StateCreator<CertificateStore> = (set) => ({
  certificates: [],
  issuers: [],
  generateCertificatesRes: async () => {},
  getIssuers: async () => {
    try {
      const res = await axios.get(`${env.API_URL}/api/certificate/issuer`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      set(
        produce((state: CertificateState) => {
          state.issuers = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
});
