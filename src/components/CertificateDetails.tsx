import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { format } from 'date-fns'

interface Props {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    certificate: any
}


export const CertificateDetails = ({ isOpen, onOpen, onClose, certificate }: Props) => {


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={'center'}>Certificate details</ModalHeader>
                <ModalCloseButton />
                <ModalBody width='100%' display='flex' flexDirection='column'>
                    <form>
                        <FormControl mb='5'>
                            <FormLabel>Email</FormLabel>
                            <Input disabled={true} value={certificate.email}></Input>
                        </FormControl>
                        <FormControl mb='5'>
                            <FormLabel>Org unit</FormLabel>
                            <Input disabled={true} value={certificate.organizationUnit}></Input>
                        </FormControl>
                        <FormControl mb='5'>
                            <FormLabel>Country</FormLabel>
                            <Input disabled={true} value={certificate.country}></Input>
                        </FormControl>
                        <FormControl mb='5'>
                            <FormLabel>Valid from</FormLabel>
                            <Input disabled={true} value={format(new Date(certificate.validFrom), 'dd-MM-yyyy').toString()}></Input>
                        </FormControl>
                        <FormControl mb='5'>
                            <FormLabel>Valid to</FormLabel>
                            <Input disabled={true} value={format(new Date(certificate.validTo), 'dd-MM-yyyy').toString()}></Input>
                        </FormControl>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}
