import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useApplicationStore } from "../store/application.store";

export const CertificatePage = () => {
  const getIssuers = useApplicationStore((state) => state.getIssuers);
  const issuers = useApplicationStore((state) => state.issuers);

  const init = async () => {
    await getIssuers();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Flex justifyContent="center" mt="70px">
      <Box width="50%">
        <Text fontSize="xl" align="center">
          Generate certificate
        </Text>
        <form action="">
          <Input placeholder="Common name" mt="20px"></Input>
          <Input placeholder="Surname" mt="20px"></Input>
          <Input placeholder="Given name" mt="20px"></Input>
          <Input placeholder="Given name" mt="20px"></Input>
          <Input placeholder="Organization" mt="20px"></Input>
          <Input placeholder="Organization unit" mt="20px"></Input>
          <Input placeholder="Country" mt="20px"></Input>
          <Input placeholder="Email" mt="20px"></Input>
          <Divider mt="20px"></Divider>

          <Select placeholder="Select issuer" mt="20px">
            {issuers &&
              issuers.map((issuer) => (
                <option value={issuer.id}>{issuer.commonName}</option>
              ))}
          </Select>

          <Divider mt="20px"></Divider>
          <Input type="date" mt="20px"></Input>
          <Input type="date" mt="20px"></Input>
          <Flex justifyContent="center" mt="30px">
            <Button w="200px">Generate</Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
