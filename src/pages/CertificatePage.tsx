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
  Checkbox,
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
  const generateRootCertificate = useApplicationStore(
    (state) => state.generateRootCertificate
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
  const [cRLSign, setCrlSign] = useState<boolean>(false);
  const [keyEncipherment, setKeyEncipherment] = useState<boolean>(false);
  const [dataEncipherment, setDataEncipherment] = useState<boolean>(false);
  const [nonRepudiation, setNonRepudiation] = useState<boolean>(false);
  const [isCRLSignDisabled, setisCRLSignDisabled] = useState<boolean>(false);

  const init = async () => {
    await getIssuers();
  };
  const toast = useToast();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (permission === "3") {
      setCrlSign(false);
      setisCRLSignDisabled(true);
      return;
    }
    setisCRLSignDisabled(false);
  }, [permission]);
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
      extensions: {
        crlsign: cRLSign,
        dataEncipherment: dataEncipherment,
        keyEncipherment: keyEncipherment,
        nonRepudiation: nonRepudiation,
      },
    };
    if (permission === "1") {
      const errorResponse = await generateRootCertificate(certificate);
      showToast(errorResponse);
      return;
    }
    if (permission === "2") {
      const errorResponse = await generateIntermediaryCertificate(certificate);
      showToast(errorResponse);
      return;
    }
    const errorResponse = await generateEndCertificate(certificate);
    showToast(errorResponse);
  };

  return (
    <Flex justifyContent="center" mt="50px">
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
          <Text p="10px 0">Certificate type:</Text>
          <RadioGroup onChange={setPermission} value={permission} pb="10px">
            <Stack direction="row">
              <Radio value="1">ROOT CA</Radio>
              <Radio value="2">INTERMEDIARY CA</Radio>
              <Radio value="3">Not CA</Radio>
            </Stack>
          </RadioGroup>
          <Divider></Divider>
          <Stack spacing={5} direction="row" pt={"10px"}>
            <Text>Extensions:</Text>
            <Checkbox
              isChecked={cRLSign}
              isDisabled={isCRLSignDisabled}
              value="cRLSign"
              onChange={(e) => setCrlSign(e.target.checked)}
            >
              cRLSign
            </Checkbox>
            <Checkbox
              value="keyEncipherment"
              onChange={(e) => setKeyEncipherment(e.target.checked)}
            >
              keyEncipherment
            </Checkbox>
            <Checkbox
              value="nonRepudiation"
              onChange={(e) => setNonRepudiation(e.target.checked)}
            >
              nonRepudiation
            </Checkbox>
            <Checkbox
              value="dataEncipherment"
              onChange={(e) => setDataEncipherment(e.target.checked)}
            >
              dataEncipherment
            </Checkbox>
          </Stack>
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
