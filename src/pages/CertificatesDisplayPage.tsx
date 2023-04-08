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
import React, { useEffect, useState } from "react";
import { useApplicationStore } from "../store/application.store";
import { format } from 'date-fns'
import ReactPaginate from 'react-paginate';
import "../styles/pagination.css"
import { Certificate } from "../store/types/certificate";
import { CertificateDetails } from "../components/CertificateDetails";
import { displayToast } from "../utils/toast.caller";

export const CertificatesDisplayPage = () => {
  const getCertificates = useApplicationStore((state) => state.getCertificates);
  const certificates = useApplicationStore((state) => state.certificates);
  const totalPages = useApplicationStore((state) => state.totalPages)
  const spinner = useApplicationStore((state) => state.spinner)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const downloadCertificate = useApplicationStore((state) => state.downloadCertificate)
  const revokeCertificate = useApplicationStore((state) => state.revokeCertificate)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate>(
    {id: "",
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
    keystore: ""})

  const init = async () => {
    await getCertificates(currentPage, 5);
  };

  useEffect(() => {
    init();
  }, []);

  const handlePageClick = async (event: any) => {
    await getCertificates(event.selected, 5)
    setCurrentPage(event.selected)
  };

  const download = async (serialNumber: string) => {
    await downloadCertificate(serialNumber)
  };

  const revoke = async (serialNumber: string) => {
    await revokeCertificate(serialNumber)
    displayToast(toast, "Successfully revoked certificate : " + serialNumber + "!", "success");
    await getCertificates(currentPage, 5)
  };

  const handleSelectCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    onOpen()
}

  return (
    <>
    <TableContainer flex={1}>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>Certificates</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Serial number</Th>
                            <Th>Issuer</Th>
                            <Th>Common name</Th>
                            <Th>Surname</Th>
                            <Th>Organization</Th>
                            <Th>Revocation date</Th>
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
                                    { item.revocationStatus == true &&                  
                                      <Td>{format(new Date(item.revocationDate), 'dd-MM-yyyy').toString()}</Td>
                                    }
                                    { item.revocationStatus == false &&                  
                                      <Td>/</Td>
                                    }
                                    <Td><Button onClick={() => handleSelectCertificate(item)}>Details</Button></Td>
                                    <Td><Button onClick={() => {download(item.serialNumber)}}>Download</Button></Td>
                                    <Td><Button onClick={() => {revoke(item.serialNumber)}}>Revoke</Button></Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <CertificateDetails isOpen={isOpen} onOpen={onOpen} onClose={onClose} certificate={selectedCertificate}/>
            {spinner == true &&
                <Flex justifyContent='center'>
                    <Spinner size='xl' />
                </Flex>
            }
            <Flex flexDirection='column' justifyContent='column' padding='15px 20px' boxSizing='border-box' width='100%' height='100%' mt={'auto'}>
            <ReactPaginate
                activeClassName={'item active '}
                forcePage={currentPage}
                breakClassName={'item break-me '}
                breakLabel={'...'}
                containerClassName={'pagination'}
                disabledClassName={'disabled-page'}
                marginPagesDisplayed={2}
                nextClassName={"item next "}
                nextLabel=">"
                onPageChange={handlePageClick}
                pageCount={totalPages}
                pageClassName={'item pagination-page '}
                pageRangeDisplayed={2}
                previousClassName={"item previous"}
                previousLabel="<" />
          </Flex>
    </>
  );
};
