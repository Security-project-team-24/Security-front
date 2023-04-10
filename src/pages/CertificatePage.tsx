import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useApplicationStore } from "../store/application.store";
import { Certificate } from "../store/types/certificate";
import { displayToast } from "../utils/toast.caller";
import { ErrorResponse } from "../store/types/verification-response";

export const CertificatePage = () => {
  const getIssuers = useApplicationStore((state) => state.getIssuers);
  const issuers = useApplicationStore((state) => state.issuers);
  const generateEndCertificate = useApplicationStore(
    (state) => state.generateEndCertificate
  );
  const generateIntermediaryCertificate = useApplicationStore(
    (state) => state.generateIntermediaryCertificate
  );
  const [commonName, setCommonName] = useState("");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationUnit, setOrganizationUnit] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [issuer, setIssuer] = useState("");
  const [validTo, setValidTo] = useState(new Date());
  const [validFrom, setValidFrom] = useState(new Date());
  const [permission, setPermission] = useState("1");

  const init = async () => {
    await getIssuers();
  };
  const toast = useToast();

  useEffect(() => {
    init();
  }, []);
  const showToast = (errorResponse: ErrorResponse) => {
    if (!errorResponse.error) {
      displayToast(toast, "Certificate created!", "success");
      return;
    }
    displayToast(toast, errorResponse.error, "error");
  };

  const handleGenerateCertificate = async () => {
    const certificate: Certificate = {
      id: "",
      serialNumber: "",
      issuerSerial: issuer,
      commonName: commonName,
      givenName: givenName,
      surname: surname,
      organization: organization,
      email: email,
      organizationUnit: organizationUnit,
      country: country,
      validFrom: validFrom,
      validTo: validTo,
      keystore: "",
      revocationStatus: false,
      revocationDate: new Date(),
    };
    if (permission === "1") {
      const errorResponse = await generateIntermediaryCertificate(certificate);
      showToast(errorResponse);
      return;
    }
    const errorResponse = await generateEndCertificate(certificate);
    showToast(errorResponse);
  };

  return (
    <Flex justifyContent="center" mt="70px">
      <Box width="50%">
        <Text fontSize="xl" align="center">
          Generate certificate
        </Text>
        <form action="">
          <Input
            placeholder="Common name"
            mt="20px"
            value={commonName}
            onChange={(e) => setCommonName(e.target.value)}
          ></Input>
          <Input
            placeholder="Surname"
            mt="20px"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          ></Input>
          <Input
            placeholder="Given name"
            mt="20px"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
          ></Input>
          <Input
            placeholder="Organization"
            mt="20px"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          ></Input>
          <Input
            placeholder="Organization unit"
            mt="20px"
            value={organizationUnit}
            onChange={(e) => setOrganizationUnit(e.target.value)}
          ></Input>
          <Input
            placeholder="Country"
            mt="20px"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Input>
          <Input
            placeholder="Email"
            mt="20px"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <Divider mt="20px"></Divider>

          <Select
            placeholder="Select issuer"
            mt="20px"
            onChange={(e) => setIssuer(e.target.value)}
          >
            {issuers &&
              issuers.map((issuer, key) => (
                <option key={key} value={issuer.serialNumber}>
                  {issuer.commonName}
                </option>
              ))}
          </Select>

          <Divider mt="20px"></Divider>
          <Input
            type="date"
            mt="20px"
            onChange={(e) => setValidFrom(new Date(e.target.value))}
            // value={validFrom.toLocaleDateString()}
          ></Input>
          <Input
            type="date"
            mt="20px"
            onChange={(e) => setValidTo(new Date(e.target.value))}
            // value={new Date()validTo.toLocaleDateString()}
          ></Input>
          <RadioGroup onChange={setPermission} value={permission}>
            <Stack direction="row">
              <Radio value="1">CA</Radio>
              <Radio value="2">Not CA</Radio>
            </Stack>
          </RadioGroup>
          <Flex justifyContent="center" mt="30px">
            <Button w="200px" onClick={handleGenerateCertificate}>
              Generate
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
