import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress} from "@heroui/react"
import {useEffect, useState} from "react"
import {ExportIcon, GlobeIcon, ImportIcon, WebExportIcon, WebImportIcon} from "../ui/Icons.tsx"

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: (_: boolean) => any;
    onMatrixLogin?: (userId: string, password: string) => Promise<boolean>;
    exportToClipboard?: () => Promise<boolean>;
    importFromClipboard?: () => Promise<boolean>;
    exportToMatrix?: (roomId: string) => Promise<boolean>;
    importFromMatrix?: (roomId: string) => Promise<boolean>;
}

function DataModal({
    isOpen,
    onOpenChange,
    onMatrixLogin,
    exportToClipboard,
    importFromClipboard,
    exportToMatrix,
    importFromMatrix
}: LoginModalProps) {

    const [roomId, setRoomId] = useState(() => {
        return localStorage.getItem('matrixRoomId') || '#id:matrix.org'
    })

    useEffect(() => {
        localStorage.setItem('matrixRoomId', roomId)
    }, [roomId])

    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [isMatrixLoggedIn, setIsMatrixLoggedIn] = useState(false)
    const [isOperationInProgress, setIsOperationInProgress] = useState(false)

    const handleExportToClipboard = async () => {
        if (!exportToClipboard || isOperationInProgress) return

        setIsOperationInProgress(true)
        await exportToClipboard()
        setIsOperationInProgress(false)
    };

    const handleImportFromClipboard = async () => {
        if (!importFromClipboard || isOperationInProgress) return

        setIsOperationInProgress(true)
        await importFromClipboard()
        setIsOperationInProgress(false)
    };

    const handleLoginToMatrix = async () => {
        if (isOperationInProgress || !onMatrixLogin) return

        setIsOperationInProgress(true)
        setIsLoggingIn(true)
        const client = await onMatrixLogin(userId, password)
        if (client) {
            setIsMatrixLoggedIn(true)
        }
        setIsLoggingIn(false)
        setIsOperationInProgress(false)
    }

    const handleExportToMatrix = async () => {
        if (!exportToMatrix || !roomId || isOperationInProgress) return

        setIsOperationInProgress(true)
        await exportToMatrix(roomId)
        setIsOperationInProgress(false)
    }

    const handleImportFromMatrix = async () => {
        if (!importFromMatrix || !roomId) return

        setIsOperationInProgress(true)
        await importFromMatrix(roomId)
        setIsOperationInProgress(false)
    }

    return (
        <Modal
            placement="center"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Notes Import/Export</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <div className="text-medium font-semibold mb-2">Clipboard Operations</div>
                                <div className="flex gap-2">
                                    <Button
                                        color="default"
                                        variant="bordered"
                                        onPress={handleExportToClipboard}
                                        isDisabled={isOperationInProgress}
                                        startContent={(<ExportIcon className="size-4 text-zinc-800 pointer-events-none"/>)}
                                    >
                                        Export to Clipboard
                                    </Button>
                                    <Button
                                        color="default"
                                        variant="bordered"
                                        onPress={handleImportFromClipboard}
                                        isDisabled={isOperationInProgress}
                                        startContent={(<ImportIcon className="size-4 text-zinc-800 pointer-events-none"/>)}
                                    >
                                        Import from Clipboard
                                    </Button>
                                </div>
                            </div>

                            <div className="text-medium font-semibold">Matrix Operations</div>

                            {!isMatrixLoggedIn && (
                                <div className="flex flex-col gap-3">
                                    <Input
                                        key="mail"
                                        label="User ID"
                                        value={userId}
                                        onValueChange={setUserId}
                                    />

                                    <Input
                                        key="password"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onValueChange={setPassword}
                                    />

                                    <Button
                                        className="mb-4"
                                        color="default"
                                        variant="flat"
                                        isDisabled={isLoggingIn || isOperationInProgress}
                                        onPress={handleLoginToMatrix}
                                        startContent={(<GlobeIcon className="size-4 text-zinc-800 pointer-events-none"/>)}
                                    >
                                        Login to Matrix
                                    </Button>
                                </div>
                            )}

                            <Input
                                key="room"
                                value={roomId}
                                onValueChange={value => setRoomId(value)}
                                label="Matrix Room ID (#…)"
                            />

                            <div className="flex gap-2">
                                <Button
                                    color="default"
                                    variant="bordered"
                                    onPress={handleExportToMatrix}
                                    isDisabled={!isMatrixLoggedIn || !roomId || isOperationInProgress}
                                    startContent={(<WebExportIcon className="size-4 text-zinc-800 pointer-events-none"/>)}
                                >
                                    Export to Matrix
                                </Button>
                                <Button
                                    color="default"
                                    variant="bordered"
                                    onPress={handleImportFromMatrix}
                                    isDisabled={!isMatrixLoggedIn || !roomId || isOperationInProgress}
                                    startContent={(<WebImportIcon className="size-4 text-zinc-800 pointer-events-none"/>)}
                                >
                                    Import from Matrix
                                </Button>
                            </div>

                            <Progress
                                value={0}
                                isIndeterminate={isLoggingIn || isOperationInProgress}
                                aria-label="Operation Progress"
                                size="sm"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onPress={() => onClose()}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default DataModal
