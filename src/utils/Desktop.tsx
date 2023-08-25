// utils/Desktop.tsx
import { useMediaQuery } from "react-responsive";
import { ReactNode, FunctionComponent } from "react";

interface DesktopProps {
  children: ReactNode;
}

/*
const Desktop = ({ children }: DesktopProps) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return isDesktop ? children : null;
};
*/

const Desktop: FunctionComponent<DesktopProps> = ({
  children,
}: DesktopProps) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return isDesktop ? <>{children}</> : null;
};

export default Desktop;
