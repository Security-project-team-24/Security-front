import { StateCreator } from "zustand";
import { Certificate } from "./types/certificate";
import { Issuer } from "./types/issuer";
import axios from "axios";
import env from "react-dotenv";
import produce from "immer";
import fileDownload from 'js-file-download'

export type CertificateActions = {
  generateCertificatesRes: () => Promise<void>;
  getIssuers: () => Promise<void>;
  getCertificates: (pageNumber: number, pageSize: number) => Promise<void>;
  downloadCertificate: (serialNumber: string) => Promise<void>;
  revokeCertificate: (serialNumber: string) => Promise<void>;
};

export type CertificateState = {
  issuers: Issuer[];
  certificates: [];
  totalPages: number;
  spinner: boolean
};

export const state: CertificateState = {
  certificates: [],
  issuers: [],
  totalPages: 0,
  spinner: false
}

export type CertificateStore = CertificateState & CertificateActions;

export const certificateStoreSlice: StateCreator<CertificateStore> = (set) => ({
  ...state,
  generateCertificatesRes: async () => {},
  getIssuers: async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/certificate/issuer`, {
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
  getCertificates: async (pageNumber: number, pageSize: number) => {
    set(
      produce((state: CertificateState) => {
        state.spinner = true
        return state;
      })
    )
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/certificate/findAll/${pageNumber}/${pageSize}` , {
        headers: {
          "Content-Type": "application/json",
        },
      });
      set(
        produce((state: CertificateState) => {
          state.spinner = false
          state.certificates = res.data.content;
          state.totalPages = res.data.totalPages;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  downloadCertificate: async (serialNumber: string) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/certificate/download/${serialNumber}` , {
        responseType: 'blob', 
      });
      
      set(
        produce((state: CertificateState) => {
          fileDownload(res.data, "certificate.crt")
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  revokeCertificate: async (serialNumber: string) => {
    set(
      produce((state: CertificateState) => {
        state.spinner = true
        return state;
      })
    )
    try {
      const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/certificate/${serialNumber}/revoke` , {
        headers: {
          "Content-Type": "application/json",
        },
      });
      set(
        produce((state: CertificateState) => {
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
});