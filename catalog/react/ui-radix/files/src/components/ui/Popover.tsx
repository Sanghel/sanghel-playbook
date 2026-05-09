import * as RadixPopover from '@radix-ui/react-popover'

export const Popover = RadixPopover.Root
export const PopoverTrigger = RadixPopover.Trigger

export function PopoverContent({ children, ...props }: RadixPopover.PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        style={{ background: 'white', padding: '1rem', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        sideOffset={4}
        {...props}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  )
}
