import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useWindowSize } from "react-use";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import Title from "./EscrowDetails/Title";
import TypeOfEscrow from "./EscrowDetails/TypeOfEscrow";
import HeroImage from "./HeroImage";
import Preview from "./Preview";
import Deadline from "./Terms/Deadline";
import Deliverable from "./Terms/Deliverable";
import Notifications from "./Terms/Notifications";
import Payment from "./Terms/Payment";
import Timeline from "./Timeline";
import { responsiveSize } from "utils/responsiveSize";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: ${responsiveSize(24, 32)};
  padding-top: ${responsiveSize(36, 42)};
  padding-bottom: ${responsiveSize(76, 96)};
  max-width: 1780px;
  margin: 0 auto;
`;

const MiddleContentContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Home: React.FC = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const isPreviewPage = location.pathname.includes("/preview");
  const isMobileView = width <= BREAKPOINT_LANDSCAPE;

  return (
    <>
      {!isPreviewPage || isMobileView ? <HeroImage /> : null}
      <Container>
        {!isPreviewPage ? <Timeline /> : null}
        <MiddleContentContainer>
          <Routes>
            <Route index element={<Navigate to="typeOfEscrow" replace />} />
            <Route path="/typeOfEscrow/*" element={<TypeOfEscrow />} />
            <Route path="/title/*" element={<Title />} />
            <Route path="/deliverable/*" element={<Deliverable />} />
            <Route path="/payment/*" element={<Payment />} />
            <Route path="/deadline/*" element={<Deadline />} />
            <Route path="/notifications/*" element={<Notifications />} />
            <Route path="/preview/*" element={<Preview />} />
          </Routes>
        </MiddleContentContainer>
      </Container>
    </>
  );
};

export default Home;
