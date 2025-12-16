import React from "react";

import Identicon from "react-identicons";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useAccount, useChainId, useEnsAvatar, useEnsName } from "wagmi";

import { getChain } from "consts/chains";
import { shortenAddress } from "utils/shortenAddress";

import clsx from "clsx";

interface IIdenticonOrAvatar {
  size?: `${number}`;
  address?: `0x${string}`;
}

export const IdenticonOrAvatar: React.FC<IIdenticonOrAvatar> = ({ size = "16", address: propAddress }) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data: name } = useEnsName({
    address,
    chainId: 1,
  });
  const { data: avatar } = useEnsAvatar({
    name: normalize(name ?? ""),
    chainId: 1,
  });

  return avatar ? (
    <img className="object-cover rounded-[50%]" src={avatar} alt="avatar" width={size} height={size} />
  ) : (
    <Identicon size={size} string={address} />
  );
};

interface IAddressOrName {
  address?: `0x${string}`;
}

export const AddressOrName: React.FC<IAddressOrName> = ({ address: propAddress }) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data } = useEnsName({
    address,
    chainId: 1,
  });

  return <label>{data ?? (isAddress(address!) ? shortenAddress(address) : address)}</label>;
};

export const ChainDisplay: React.FC = () => {
  const chainId = useChainId();
  const chain = getChain(chainId);
  return <label>{chain?.name}</label>;
};

const AccountDisplay: React.FC = () => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-between items-center gap-2 h-auto p-0",
        "lg:flex-row lg:content-center lg:rounded-[300px] lg:gap-0 lg:py-0 lg:px-3",
        "cursor-pointer bg-klerosUIComponentsWhiteBackground lg:bg-white-low-opacity-subtle",
        "lg:hover:bg-white-low-opacity-strong lg:hover:transition-[background-color_0.1s]",
        "hover:[&_label]:text-white hover:[&_label]:transition-colors hover:[&_label]:duration-200"
      )}
    >
      <div
        className={clsx(
          "flex items-center w-fit min-h-8 gap-2 lg:gap-3",
          "[&>label]:text-base [&>label]:font-semibold lg:[&>label]:text-sm lg:[&>label]:font-normal"
        )}
      >
        <IdenticonOrAvatar size="32" />
        <AddressOrName />
      </div>
      <div
        className={clsx(
          "flex w-fit min-h-8 items-center pl-0 lg:hidden",
          "[&>label]:text-klerosUIComponentsSuccess [&>label]:text-base [&>label]:font-medium",
          "before:content-[''] before:w-2 before:h-2 before:rounded-[50%] before:bg-klerosUIComponentsSuccess before:my-0 before:mr-[13px] before:ml-[3px]"
        )}
      >
        <ChainDisplay />
      </div>
    </div>
  );
};

export default AccountDisplay;
