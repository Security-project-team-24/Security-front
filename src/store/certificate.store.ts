import { StateCreator } from "zustand";
import { Certificate } from "./types/certificate";
import { Issuer } from "./types/issuer";
import axios from "axios";
import env from "react-dotenv";
import produce from "immer";
import fileDownload from "js-file-download";

export type CertificateActions = {
  generateEndCertificate: (certificate: Certificate) => Promise<void>;
  generateIntermediaryCertificate: (certificate: Certificate) => Promise<void>;
  getIssuers: () => Promise<void>;
  getCertificates: (pageNumber: number, pageSize: number) => Promise<void>;
  downloadCertificate: (serialNumber: string) => Promise<void>;
  revokeCertificate: (serialNumber: string) => Promise<void>;
  checkRevocationStatus: (serialNumber: string) => Promise<void>;
};

export type CertificateState = {
  issuers: Issuer[];
  certificates: [];
  totalPages: number;
  spinner: boolean;
  revokeCertificateRes: any;
  checkRevocationStatusRes: any;
  generateCertificateRes: any;
};

export const state: CertificateState = {
  certificates: [],
  issuers: [],
  totalPages: 0,
  spinner: false,
  revokeCertificateRes: null,
  checkRevocationStatusRes: null,
  generateCertificateRes: null,
};

export type CertificateStore = CertificateState & CertificateActions;

export const certificateStoreSlice: StateCreator<CertificateStore> = (set) => ({
  ...state,
  generateEndCertificate: async (certificate: Certificate) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/end`,
        {
          endDate: certificate.validTo,
          issuerId: certificate.issuerSerial,
          startDate: certificate.validFrom,
          subject: {
            commonName: certificate.commonName,
            country: certificate.country,
            email: certificate.email,
            givenName: certificate.givenName,
            organization: certificate.organization,
            organizationUnit: certificate.organizationUnit,
            surname: certificate.surname,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set(
        produce((state: CertificateState) => {
          state.generateCertificateRes = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  generateIntermediaryCertificate: async (certificate: Certificate) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/intermediary`,
        {
          endDate: certificate.validTo,
          issuerId: certificate.issuerSerial,
          startDate: certificate.validFrom,
          subject: {
            commonName: certificate.commonName,
            country: certificate.country,
            email: certificate.email,
            givenName: certificate.givenName,
            organization: certificate.organization,
            organizationUnit: certificate.organizationUnit,
            surname: certificate.surname,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set(
        produce((state: CertificateState) => {
          state.generateCertificateRes = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  getIssuers: async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/issuer`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
        state.spinner = true;
        return state;
      })
    );
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/findAll/${pageNumber}/${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set(
        produce((state: CertificateState) => {
          state.spinner = false;
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
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/download/${serialNumber}`,
        {
          responseType: "blob",
        }
      );

      set(
        produce((state: CertificateState) => {
          fileDownload(res.data, "certificate.crt");
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
        state.spinner = true;
        return state;
      })
    );
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/${serialNumber}/revoke`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set(
        produce((state: CertificateState) => {
          state.spinner = false;
          state.revokeCertificateRes = res.status;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  checkRevocationStatus: async (serialNumber: string) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/certificate/${serialNumber}/revoke/check`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set(
        produce((state: CertificateState) => {
          state.checkRevocationStatusRes = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
});
