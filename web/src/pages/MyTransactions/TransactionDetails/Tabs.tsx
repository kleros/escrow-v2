import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs as TabsComponent } from "@kleros/ui-components-library";
import EyeIcon from "assets/svgs/icons/eye.svg";
import HandshakeIcon from "assets/svgs/icons/handshake.svg";
import BalanceIcon from "assets/svgs/icons/law-balance.svg";

const StyledTabs = styled(TabsComponent)`
  width: 100%;
  margin-bottom: 48px;
  > * {
    display: flex;
    flex-wrap: wrap;
    > svg {
      margin-right: 8px !important;
    }
  }
`;

const TABS = [
  {
    text: "Overview",
    value: 0,
    Icon: EyeIcon,
    path: "overview",
  },
  {
    text: "Settlement",
    value: 1,
    Icon: HandshakeIcon,
    path: "settlement",
  },
  {
    text: "Dispute",
    value: 2,
    Icon: BalanceIcon,
    path: "Dispute",
    disabled: true,
  },
];

const Tabs: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const currentPathName = location.pathname.split("/").at(-1);

  const findTabIndex = (pathName) => TABS.findIndex(({ path }) => path === pathName);
  const [currentTab, setCurrentTab] = useState(findTabIndex(currentPathName));

  useEffect(() => {
    const newTabIndex = findTabIndex(currentPathName);
    if (currentTab !== newTabIndex) {
      setCurrentTab(newTabIndex);
    }
  }, [currentPathName, currentTab]);

  const handleTabChange = (n: number) => {
    if (n !== currentTab) {
      setCurrentTab(n);
      navigate(`/myTransactions/${id}/${TABS[n].path}`);
    }
  };

  return <StyledTabs currentValue={currentTab} items={TABS} callback={handleTabChange} />;
};

export default Tabs;
