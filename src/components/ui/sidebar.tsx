"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

type SidebarContext = {
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ defaultOpen = false, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [setOpenProp, open],
  )

  const toggleSidebar = React.useCallback(() => {
    setOpen((open) => !open)
  }, [setOpen])

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      open,
      setOpen,
      isMobile,
      toggleSidebar,
    }),
    [open, setOpen, isMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className={cn("flex flex-col min-h-svh w-full", className)} ref={ref} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, open } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-10 w-10 md:hidden order-2 md:order-1 relative", className)}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <div className="relative w-6 h-6">
          <span 
            className={cn(
              "absolute block w-6 h-0.5 bg-white transition-all duration-300",
              open ? "rotate-45 top-3" : "top-1"
            )}
          />
          <span 
            className={cn(
              "absolute block w-6 h-0.5 bg-white transition-all duration-300 top-3",
              open ? "opacity-0" : "opacity-100"
            )}
          />
          <span 
            className={cn(
              "absolute block w-6 h-0.5 bg-white transition-all duration-300",
              open ? "-rotate-45 top-3" : "top-5"
            )}
          />
        </div>
        <span className="sr-only">메뉴 토글</span>
      </Button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInternalTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, open } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-10 w-10 relative", className)}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <div className="relative w-6 h-6">
          <span 
            className={cn(
              "absolute block w-6 h-0.5 bg-white transition-all duration-300",
              open ? "rotate-45 top-3" : "top-1"
            )}
          />
          <span 
            className={cn(
              "absolute block w-6 h-0.5 bg-white transition-all duration-300 top-3",
              open ? "opacity-0" : "opacity-100"
            )}
          />
          <span 
            className={cn(
              "absolute block w-6 h-0.5 bg-white transition-all duration-300",
              open ? "-rotate-45 top-3" : "top-5"
            )}
          />
        </div>
        <span className="sr-only">메뉴 토글</span>
      </Button>
    )
  },
)
SidebarInternalTrigger.displayName = "SidebarInternalTrigger"

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSidebar()

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
          side="left" 
          className={cn(
            "w-full bg-black border-gray-800 p-2",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            "[&>button]:hidden",
            className
          )} 
          {...props}
        >
          <div className="flex h-full w-full flex-col">
            <div className="flex justify-end">
              <SidebarInternalTrigger />
            </div>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-2 p-4 border-b border-gray-800", className)} {...props} />
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex min-h-0 flex-1 flex-col gap-2 p-4 overflow-auto", className)} {...props} />
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-2 p-4 border-t border-gray-800", className)} {...props} />
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    const { setOpen } = useSidebar()

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors",
          className,
        )}
        onClick={() => {
          if (asChild) {
            setOpen(false)
          }
        }}
        {...props}
      />
    )
  },
)
SidebarItem.displayName = "SidebarItem"

const useIsMobileContext = React.createContext(false)

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInternalTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  useSidebar,
}
