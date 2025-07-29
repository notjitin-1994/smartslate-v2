export interface CardData {
  id: number;
  title: string;
  description: string;
  quote: string;
  note: string;
  value: string;
  label: string;
}

export interface NavItem {
  title: string;
  href: string;
  isButton?: boolean;
}

export interface HeaderProps {
  activePage: string;
  onNavClick: (href: string) => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}
