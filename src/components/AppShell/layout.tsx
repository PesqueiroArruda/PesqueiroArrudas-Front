import { ReactNode } from 'react';
import Image from 'next/image';
import { ArrowLeft, Menu } from 'lucide-react';

import { Avatar, AvatarFallback } from 'components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from 'components/ui/sheet';
import { cn } from 'lib/utils';
import Logo from '../../assets/logo.jpeg';
import { navItems } from './navItems';

interface Props {
  children: ReactNode;
  pathname: string;
  isAdmin: boolean;
  loggedUser: string;
  handleLinkToPage: (path: string) => void;
  hasBackPageBtn?: boolean;
  handleBackPage?: () => void;
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (open: boolean) => void;
}

const Brand = () => (
  <div className="flex items-center gap-2.5 px-1">
    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
      <Image src={Logo} alt="Arruda's" fill className="object-contain" />
    </div>
    <span className="font-heading text-base font-extrabold text-text-on-navy">Arruda&apos;s</span>
  </div>
);

const NavList = ({
  pathname,
  handleLinkToPage,
  onNavigate,
}: {
  pathname: string;
  handleLinkToPage: (path: string) => void;
  onNavigate?: () => void;
}) => (
  <nav className="flex flex-col gap-1">
    {navItems.map(({ text, icon: ItemIcon, path }) => {
      const isActive = pathname === path;
      return (
        <button
          key={`nav-item-${path}`}
          type="button"
          onClick={() => {
            handleLinkToPage(path);
            onNavigate?.();
          }}
          className={cn(
            'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-bold transition-colors',
            isActive
              ? 'bg-navy-hover text-nav-active'
              : 'text-nav-inactive hover:bg-navy-hover/70',
          )}
        >
          <ItemIcon className="h-4 w-4" />
          {text}
        </button>
      );
    })}
  </nav>
);

export const AppShellLayout = ({
  children,
  pathname,
  isAdmin,
  loggedUser,
  handleLinkToPage,
  hasBackPageBtn,
  handleBackPage,
  isSideMenuOpen,
  setIsSideMenuOpen,
}: Props) => (
  <div className="flex min-h-screen flex-col bg-background md:flex-row">
    {/* Desktop sidebar */}
    <aside className="hidden w-60 shrink-0 flex-col bg-navy px-4 py-5 md:flex">
      <div className="flex items-center gap-2">
        {hasBackPageBtn && (
          <button
            type="button"
            onClick={handleBackPage}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-on-navy/80 hover:bg-navy-hover"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <Brand />
      </div>
      {isAdmin && (
        <div className="mt-7">
          <NavList pathname={pathname} handleLinkToPage={handleLinkToPage} />
        </div>
      )}
      {loggedUser && (
        <div className="mt-auto flex items-center gap-2.5 px-1 pt-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{loggedUser.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-text-on-navy">{loggedUser}</span>
        </div>
      )}
    </aside>

    {/* Mobile topbar */}
    <header className="flex h-16 shrink-0 items-center gap-2 bg-navy px-4 md:hidden">
      {hasBackPageBtn && (
        <button
          type="button"
          onClick={handleBackPage}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-on-navy/80 hover:bg-navy-hover"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <Brand />
      {isAdmin && (
        <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-text-on-navy/80 hover:bg-navy-hover"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col px-4 py-5">
            <Brand />
            <div className="mt-7">
              <NavList
                pathname={pathname}
                handleLinkToPage={handleLinkToPage}
                onNavigate={() => setIsSideMenuOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </header>

    <main className="min-w-0 flex-1 px-4 py-6 md:px-9 md:py-8">{children}</main>
  </div>
);
