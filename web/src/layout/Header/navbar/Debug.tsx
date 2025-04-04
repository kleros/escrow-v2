import React from "react";
import styled from "styled-components";
// import { useSortitionModulePhase } from "hooks/contracts/generated";
import { GIT_BRANCH, GIT_DIRTY, GIT_HASH, GIT_TAGS, GIT_URL, RELEASE_VERSION } from "consts/index";
import { StyledA, StyledLabel } from "components/StyledTags";

const Container = styled.div`
  label,
  a {
    font-family: "Roboto Mono", monospace;
    line-height: 10px;
    font-size: 10px;
    color: ${({ theme }) => theme.stroke};
  }
`;

const Version = () => (
  <StyledLabel>
    v{RELEASE_VERSION}{" "}
    <StyledA href={GIT_URL} target="_blank" rel="noreferrer">
      #{GIT_HASH}
    </StyledA>
    {GIT_BRANCH && GIT_BRANCH !== "HEAD" && ` ${GIT_BRANCH}`}
    {GIT_TAGS && ` ${GIT_TAGS}`}
    {GIT_DIRTY && ` dirty`}
  </StyledLabel>
);

enum Phases {
  staking,
  generating,
  drawing,
}

// const Phase = () => {
//   const { data: phase } = useSortitionModulePhase({
//     watch: true,
//   });
//   return (
//     <>
//       {phase !== undefined && (
//         <label>
//           <br />
//           phase: {Phases[phase]}
//         </label>
//       )}
//     </>
//   );
// };

const Debug: React.FC = () => {
  return (
    <Container>
      <Version />
      {/* <Phase /> */}
    </Container>
  );
};

export default Debug;
