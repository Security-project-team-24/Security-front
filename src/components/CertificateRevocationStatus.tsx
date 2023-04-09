import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Certificate } from "../store/types/certificate";
import { Revocation } from "../store/types/revocation";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  revocationStatus: Revocation;
  certificate: Certificate;
}

export const CertificateRevocationStatus = ({
  isOpen,
  onOpen,
  onClose,
  revocationStatus,
  certificate,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>Revocation status</ModalHeader>
        <ModalCloseButton />
        <ModalBody width="100%" display="flex" flexDirection="column">
          <form>
            <FormControl mb="5">
              <FormLabel>Serial number</FormLabel>
              <Input disabled={true} value={certificate.serialNumber} />
            </FormControl>
            <FormControl mb="5">
              <FormLabel>Revoked</FormLabel>
              {revocationStatus.revoked == true && (
                <Input disabled={true} value="TRUE" />
              )}
              {revocationStatus.revoked == false && (
                <Input disabled={true} value="FALSE" />
              )}
            </FormControl>
            {revocationStatus.revoked == true && (
              <FormControl mb="5">
                <FormLabel>Revocation date</FormLabel>
                <Input
                  disabled={true}
                  value={format(
                    new Date(revocationStatus.revocationDate),
                    "dd-MM-yyyy"
                  )}
                />
              </FormControl>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
