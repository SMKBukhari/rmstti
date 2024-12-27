'use client';

import { userRoutes, adminRoutes, employeeRoutes, managerRoutes, ceoRoutes } from '@/lib/data';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';

// Define types for routes and actions
type Route = {
  label: string;
  href: string;
  subitems?: Route[];
};

type Action = {
  id: string;
  name: string;
  keywords: string;
  section: string;
  subtitle: string;
  perform: () => void;
};

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navigateTo = (url: string) => {
    router.push(url);
  };

  // These actions are for the navigation
  const actions = useMemo(() => {
    const generateActions = (routes: Route[], section: string): Action[] => {
      return routes.flatMap((route) => {
        const baseAction: Action = {
          id: `${route.label.toLowerCase()}Action`,
          name: route.label,
          keywords: route.label.toLowerCase(),
          section: section,
          subtitle: `Go to ${route.label}`,
          perform: () => navigateTo(route.href)
        };

        const subActions: Action[] = route.subitems
          ? route.subitems.map((subitem) => ({
              id: `${subitem.label.toLowerCase()}Action`,
              name: subitem.label,
              keywords: subitem.label.toLowerCase(),
              section: `${section} - ${route.label}`,
              subtitle: `Go to ${subitem.label}`,
              perform: () => navigateTo(subitem.href)
            }))
          : [];

        return [baseAction, ...subActions];
      });
    };

    return [
      ...generateActions(userRoutes, 'User'),
      ...generateActions(adminRoutes, 'Admin'),
      ...generateActions(employeeRoutes, 'Employee'),
      ...generateActions(managerRoutes, 'Manager'),
      ...generateActions(ceoRoutes, 'CEO')
    ];
  }, [navigateTo]); // Include navigateTo in the dependency array

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}

const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/80  !p-0 backdrop-blur-sm">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-background text-foreground shadow-lg">
            <div className="bg-background">
              <div className="border-x-0 border-b-2">
                <KBarSearch className="w-full border-none bg-background px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};

