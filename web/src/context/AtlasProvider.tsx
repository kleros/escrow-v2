import React from "react";
import { AtlasProvider as _AtlasProvider, SignupProduct, IpfsProduct } from "@kleros/kleros-app";
import { useConfig } from "wagmi";

const AtlasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wagmiConfig = useConfig();

  return (
    <_AtlasProvider
      config={{
        uri: import.meta.env.REACT_APP_ATLAS_URI,
        //Used to select templates. CourtV2 is what is used for Escrow V2.
        signupProduct: SignupProduct.CourtV2,
        ipfsProduct: IpfsProduct.Escrow,
        wagmiConfig,
      }}
    >
      {children}
    </_AtlasProvider>
  );
};

export default AtlasProvider;
