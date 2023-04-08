import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Select,
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
import React, { useEffect } from "react";
import { useApplicationStore } from "../store/application.store";
import { format } from 'date-fns'
import { Certificate } from "../store/types/certificate";

export const CertificatesDisplayPage = () => {
  const getCertificates = useApplicationStore((state) => state.getCertificates);
  const certificates = useApplicationStore((state) => state.certificates);

  const init = async () => {
    await getCertificates(0, 5);
  };

  useEffect(() => {
    init();
  }, []);

  return (
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
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
  );
};
