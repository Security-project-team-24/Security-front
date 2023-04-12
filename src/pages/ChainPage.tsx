import { useParams } from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useApplicationStore} from "../store/application.store";
import {Button, Flex, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import { Certificate } from "../store/types/certificate";



export const ChainPage = () => {
    const getCertificateChain = useApplicationStore(state => state.getCertificateChain);
    const {serial} = useParams();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const init = async () => {
        const chain = await getCertificateChain(serial ?? "");
        setCertificates(chain);
    }

    useEffect(() => {
        init()
    })

    return (
        <Flex>
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
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>

    )
}

export default ChainPage
