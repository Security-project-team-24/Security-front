import {StateCreator} from "zustand";
import {Certificate} from "./types/certificate";
import {Issuer} from "./types/issuer";
import axios from "axios";
import env from "react-dotenv";
import produce from "immer";
import fileDownload from "js-file-download";
import {Revocation} from "./types/revocation";
import {ErrorResponse} from "./types/verification-response";

export type CertificateActions = {
    generateEndCertificate: (certificate: Certificate) => Promise<ErrorResponse>;
    generateIntermediaryCertificate: (
        certificate: Certificate
    ) => Promise<ErrorResponse>;
    generateRootCertificate: (certificate: Certificate) => Promise<ErrorResponse>;
    getIssuers: () => Promise<void>;
    getCertificates: (pageNumber: number, pageSize: number) => Promise<void>;
    downloadCertificate: (serialNumber: string) => Promise<void>;
    revokeCertificate: (serialNumber: string) => Promise<void>;
    checkRevocationStatus: (serialNumber: string) => Promise<void>;
    verifyCertificate: (certificate: File) => Promise<ErrorResponse>;
    getCertificateChain: (serial: string) => Promise<Certificate[]>;
};

export type CertificateState = {
    issuers: Issuer[];
    certificates: [];
    totalPages: number;
    generateCertificateRes: any;
    spinner: boolean;
    revokeCertificateRes: any;
    checkRevocationStatusRes: Revocation;
};

export const state: CertificateState = {
    certificates: [],
    issuers: [],
    totalPages: 0,
    spinner: false,
    revokeCertificateRes: null,
    checkRevocationStatusRes: {revoked: false, revocationDate: new Date()},
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
                    state.generateCertificateRes = null;
                    return state;
                })
            );
            return {error: null};
        } catch (e: any) {
            return {error: e.response.data.message};
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
            return {error: null};
        } catch (e: any) {
            return {error: e.response.data.message};
        }
    },
    generateRootCertificate: async (certificate: Certificate) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/certificate/root`,
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
                    state.generateCertificateRes = null;
                    return state;
                })
            );
            return {error: null};
        } catch (e: any) {
            return {error: e.response.data.message};
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
    verifyCertificate: async (certificate: File) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/certificate/verify`,
                {file: certificate},
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data;boundary=----WebKitFormBoundaryABC123",
                    },
                }
            );
            return {error: null};
        } catch (e: any) {
            console.log(e);
            return {error: e.response.data.message};
        }
    },
    getCertificateChain: async (serial: string) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/certificate/${serial}/chain`)
            return res.data;
        } catch (e: any) {
            console.log(e);
            return [];
        }
    }
});
