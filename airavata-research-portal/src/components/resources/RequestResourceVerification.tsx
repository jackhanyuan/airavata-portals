import { Resource } from "@/interfaces/ResourceType";
import { Button, Dialog, useDialog, CloseButton } from "@chakra-ui/react";
import { MdOutlineVerifiedUser } from "react-icons/md";

export const RequestResourceVerification = ({
  resource,
  onRequestSubmitted,
}: {
  resource: Resource;
  onRequestSubmitted?: () => void;
}) => {
  const dialog = useDialog();

  const onSubmitForVerification = async () => {
    console.log("Submitting resource for verification:", resource.id);
    dialog.setOpen(false);
    onRequestSubmitted?.();
  };

  return (
    <>
      <Dialog.RootProvider size="sm" value={dialog}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Resource Verification</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              When you submit <b>{resource.name}</b> for verification, the
              Airavata team will review it to ensure it meets the necessary
              safety standards. This process may take some time, and you will be
              notified once the verification is complete.
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                width="100%"
                colorPalette="yellow"
                onClick={onSubmitForVerification}
              >
                Submit
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.RootProvider>

      <Button
        size="2xs"
        colorPalette={"yellow"}
        onClick={() => {
          dialog.setOpen(true);
        }}
      >
        <MdOutlineVerifiedUser />
        Request Verification
      </Button>
    </>
  );
};
