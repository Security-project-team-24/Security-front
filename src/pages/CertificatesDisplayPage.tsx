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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useApplicationStore } from "../store/application.store";
import { format } from 'date-fns'
import ReactPaginate from 'react-paginate';
import "../styles/pagination.css"
import { Certificate } from "../store/types/certificate";

export const CertificatesDisplayPage = () => {
  const getCertificates = useApplicationStore((state) => state.getCertificates);
  const certificates = useApplicationStore((state) => state.certificates);
  const totalPages = useApplicationStore((state) => state.totalPages)
  const spinner = useApplicationStore((state) => state.spinner)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const downloadCertificate = useApplicationStore((state) => state.downloadCertificate)

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
    console.log(serialNumber)
    await downloadCertificate(serialNumber)
    //await getCertificates(event.selected, 5)
    //setCurrentPage(event.selected)
  };

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
                            <Th>Email</Th>
                            <Th>Org unit</Th>
                            <Th>Country</Th>
                            <Th>Valid</Th>
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
                                    <Td>{item.email}</Td>
                                    <Td>{item.organizationUnit}</Td>
                                    <Td>{item.country}</Td>
                                    <Td>{format(new Date(item.validFrom), 'dd-MM-yyyy').toString()} - {format(new Date(item.validTo), 'dd-MM-yyyy').toString()}</Td>
                                    { item.revocationStatus == true &&                  
                                      <Td>{format(new Date(item.revocationDate), 'dd-MM-yyyy').toString()}</Td>
                                    }
                                    { item.revocationStatus == false &&                  
                                      <Td>/</Td>
                                    }
                                    <Td><button onClick={() => {download(item.serialNumber)}}>Download</button></Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
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
