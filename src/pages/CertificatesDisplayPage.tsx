import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Select,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useApplicationStore } from "../store/application.store";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import "../styles/pagination.css";
import { Certificate } from "../store/types/certificate";
import { CertificateDetails } from "../components/CertificateDetails";
import { displayToast } from "../utils/toast.caller";
import { CertificateRevocationStatus } from "../components/CertificateRevocationStatus";
import { type } from "os";

export const CertificatesDisplayPage = () => {
  const getCertificates = useApplicationStore((state) => state.getCertificates);
  const certificates = useApplicationStore((state) => state.certificates);
  const totalPages = useApplicationStore((state) => state.totalPages);
  const spinner = useApplicationStore((state) => state.spinner);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const downloadCertificate = useApplicationStore(
    (state) => state.downloadCertificate
  );
  const revokeCertificate = useApplicationStore(
    (state) => state.revokeCertificate
  );
  const revokeCertificateRes = useApplicationStore(
    (state) => state.revokeCertificateRes
  );
  const checkRevocationStatus = useApplicationStore(
    (state) => state.checkRevocationStatus
  );
  const checkRevocationStatusRes = useApplicationStore(
    (state) => state.checkRevocationStatusRes
  );
  const verifyCertificate = useApplicationStore(
    (state) => state.verifyCertificate
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRevocationStatusModal,
    onOpen: onOpenRevocationStatusModal,
    onClose: onCloseRevocationStatusModal,
  } = useDisclosure();
  const toast = useToast();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate>({
    id: "",
    serialNumber: "",
    issuerSerial: "",
    commonName: "",
    surname: "",
    email: "",
    organization: "",
    organizationUnit: "",
    country: "",
    validFrom: new Date(),
    validTo: new Date(),
    revocationStatus: false,
    revocationDate: new Date(),
    keystore: "",
    givenName: "",
  });

  const init = async () => {
    await getCertificates(currentPage, 5);
  };

  useEffect(() => {
    init();
  }, []);

  const handlePageClick = async (event: any) => {
    await getCertificates(event.selected, 5);
    setCurrentPage(event.selected);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleOnVerify = async () => {
    if (typeof file !== "undefined") {
      var isCertificateValid: boolean = await verifyCertificate(file);
      if (isCertificateValid) {
        displayToast(toast, "Certificate is Valid!", "success");
        return;
      }
      displayToast(toast, "Certificate is not valid!", "error");
    }
  };

  const download = async (serialNumber: string) => {
    await downloadCertificate(serialNumber);
  };

  const revoke = async (serialNumber: string) => {
    await revokeCertificate(serialNumber);
    if (revokeCertificateRes == 200)
      displayToast(
        toast,
        "Successfully revoked certificate : " + serialNumber + "!",
        "success"
      );
  };

  const checkStatus = async (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    await checkRevocationStatus(certificate.serialNumber);
    onOpenRevocationStatusModal();
  };

  const handleSelectCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    onOpen();
  };

  return (
    <>
      <TableContainer flex={1}>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>Certificates</TableCaption>
          <Thead>
            <Tr>
              <Th>Serial number</Th>
              <Th>Issuer</Th>
              <Th>Common name</Th>
              <Th>Surname</Th>
              <Th>Organization</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(certificates) &&
              certificates.map((item: Certificate) => (
                <Tr key={item.id}>
                  <Td>{item.serialNumber}</Td>
                  <Td>{item.issuerSerial}</Td>
                  <Td>{item.commonName}</Td>
                  <Td>{item.surname}</Td>
                  <Td>{item.organization}</Td>
                  <Td>
                    <Button
                      onClick={() => {
                        checkStatus(item);
                      }}
                    >
                      Revocation status
                    </Button>
                  </Td>
                  <Td>
                    <Button onClick={() => handleSelectCertificate(item)}>
                      Details
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      onClick={() => {
                        download(item.serialNumber);
                      }}
                    >
                      Download
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      color="red"
                      onClick={() => {
                        revoke(item.serialNumber);
                      }}
                    >
                      Revoke
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <CertificateDetails
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        certificate={selectedCertificate}
      />
      <CertificateRevocationStatus
        isOpen={isOpenRevocationStatusModal}
        onOpen={onOpenRevocationStatusModal}
        onClose={onCloseRevocationStatusModal}
        revocationStatus={checkRevocationStatusRes}
        certificate={selectedCertificate}
      />
      {spinner == true && (
        <Flex justifyContent="center">
          <Spinner size="xl" />
        </Flex>
      )}
      <Flex
        flexDirection="column"
        justifyContent="column"
        padding="15px 20px"
        boxSizing="border-box"
        width="100%"
        height="100%"
        mt={"auto"}
      >
        <ReactPaginate
          activeClassName={"item active "}
          forcePage={currentPage}
          breakClassName={"item break-me "}
          breakLabel={"..."}
          containerClassName={"pagination"}
          disabledClassName={"disabled-page"}
          marginPagesDisplayed={2}
          nextClassName={"item next "}
          nextLabel=">"
          onPageChange={handlePageClick}
          pageCount={totalPages}
          pageClassName={"item pagination-page "}
          pageRangeDisplayed={2}
          previousClassName={"item previous"}
          previousLabel="<"
        />
      </Flex>
      <Flex width={"30rem"} height={"100"} mx="10" gap={"5"}>
        <Input
          placeholder="Given name"
          mt="20px"
          type="file"
          onChange={handleFileChange}
          w="75%"
        ></Input>
        <Button
          w="25%"
          my="5"
          onClick={() => {
            handleOnVerify();
          }}
          disabled={typeof file === "undefined"}
        >
          Verify
        </Button>
      </Flex>
    </>
  );
};
