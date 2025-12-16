import React from "react";
// import { useSortitionModulePhase } from "hooks/contracts/generated";
import { GIT_BRANCH, GIT_DIRTY, GIT_HASH, GIT_TAGS, GIT_URL, RELEASE_VERSION } from "consts/index";

const Version = () => (
  <label className="text-[10px] leading-2.5 text-klerosUIComponentsStroke font-[Roboto_Mono,monospace]">
    v{RELEASE_VERSION}{" "}
    <a
      className="text-inherit text-[10px] leading-2.5 font-[Roboto_Mono,monospace]"
      href={GIT_URL}
      target="_blank"
      rel="noreferrer"
    >
      #{GIT_HASH}
    </a>
    {GIT_BRANCH && GIT_BRANCH !== "HEAD" && ` ${GIT_BRANCH}`}
    {GIT_TAGS && ` ${GIT_TAGS}`}
    {GIT_DIRTY && ` dirty`}
  </label>
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
    <div>
      <Version />
      {/* <Phase /> */}
    </div>
  );
};

export default Debug;
