"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavSubItem {
  title: string
  url: string
}

interface NavSectionItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  isSeparator?: boolean
  items?: NavSubItem[]
}

function isActive(url: string, pathname: string): boolean {
  if (url === "/dashboard") {
    return pathname === "/dashboard"
  }
  return pathname === url || pathname.startsWith(url + "/")
}

function hasActiveChild(items: NavSubItem[] | undefined, pathname: string): boolean {
  if (!items) return false
  return items.some((item) => isActive(item.url, pathname))
}

export function NavMain({ items }: { items: NavSectionItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (item.isSeparator) {
            return (
              <li
                key={`sep-${item.title}`}
                style={{
                  padding: "12px 12px 4px",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--sidebar-foreground, oklch(0.55 0 0))",
                  opacity: 0.6,
                  userSelect: "none",
                  listStyle: "none",
                }}
              >
                {item.title}
              </li>
            )
          }

          const active = isActive(item.url, pathname)
          const childActive = hasActiveChild(item.items, pathname)

          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} isActive={active} asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={active || childActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={active}>
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const subActive = isActive(subItem.url, pathname)
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton isActive={subActive} asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
