"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  LogOut,
  LayoutGrid,
  Package,
  Image as ImageIcon,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { logout } from "@/lib/auth/actions";

const SidebarContent = () => (
  <>
    <div className="p-6 border-b flex items-center gap-2">
      <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
        B
      </div>
      <span className="font-bold text-lg">BME Dashboard</span>
    </div>

    <nav className="flex-1 overflow-auto p-4 space-y-2 flex flex-col">
      <Button
        variant="secondary"
        className="w-full justify-start gap-2"
        asChild
      >
        <a href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
        <a href="/dashboard/users">
          <Users className="h-4 w-4" />
          Users
        </a>
      </Button>

      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
        <a href="/dashboard/pages-content">
          <FileText className="h-4 w-4" />
          Pages Content
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
        <a href="/dashboard/category">
          <LayoutGrid className="h-4 w-4" />
          Categories
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
        <a href="/dashboard/products">
          <Package className="h-4 w-4" />
          Products
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
        <a href="/dashboard/gallery-images">
          <ImageIcon className="h-4 w-4" />
          Gallery Images
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
        <a href="/dashboard/orders">
          <Package className="h-4 w-4" />
          Orders
        </a>
      </Button>
    </nav>

    <div className="p-4 border-t">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
        onClick={() => logout()}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  </>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-3 relative">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 flex flex-col w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-bold">BME Dashboard</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    A
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Admin User
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@bmepharma.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => logout()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
