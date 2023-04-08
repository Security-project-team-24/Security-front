import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { format } from 'date-fns'

interface Props {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    revocationStatus: any
    certificate: any
}


export const CertificateRevocationStatus = ({ isOpen, onOpen, onClose, revocationStatus, certificate }: Props) => {


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={'center'}>Revocation status</ModalHeader>
                <ModalCloseButton />
                <ModalBody width='100%' display='flex' flexDirection='column'>
                    <form>
                    <FormControl mb='5'>
                            <FormLabel>Serial number</FormLabel>
                            <Input disabled={true} value={certificate.serialNumber}></Input>
                        </FormControl>
                        <FormControl mb='5'>
                            <FormLabel>Revoked</FormLabel>
                            <Input disabled={true} value={revocationStatus.revoked}></Input>
                        </FormControl>
                        <FormControl mb='5'>
                            <FormLabel>Revocation date</FormLabel>
                            { revocationStatus.revoked == true &&
                                <Input disabled={true} value={format(new Date(revocationStatus.revocationDate), 'dd-MM-yyyy')}></Input>
                            }
                        </FormControl>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}
