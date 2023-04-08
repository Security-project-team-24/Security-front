export type Certificate = {
    id: string;
    serialNumber: string;
    issuerSerial: string;
    commonName: string;
    surname: string;
    organization: string;
    email: string;
    organizationUnit: string;
    country: string;
    validFrom: Date;
    validTo: Date;
    keystore: string;
    revocationStatus: boolean;
    revocationDate: Date;
};
