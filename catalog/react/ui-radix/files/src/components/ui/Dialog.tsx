import * as RadixDialog from '@radix-ui/react-dialog'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export function DialogContent({ children, ...props }: RadixDialog.DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <RadixDialog.Content
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '1.5rem', borderRadius: '8px', minWidth: '320px' }}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export const DialogTitle = RadixDialog.Title
export const DialogDescription = RadixDialog.Description
