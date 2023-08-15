import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Stage from "./components/Stage";

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Stage />
    </ChakraProvider>
  );
};

export default App;
