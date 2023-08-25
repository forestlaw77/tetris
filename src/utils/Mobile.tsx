// utils/Mobile.tsx
import { useMediaQuery } from "react-responsive";
import { ReactNode, FunctionComponent } from "react";

interface MobileProps {
  children: ReactNode;
}

/*
const Mobile = ({ children }: MobileProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};
*/

const Mobile: FunctionComponent<MobileProps> = ({ children }: MobileProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? <>{children}</> : null;
};

export default Mobile;
