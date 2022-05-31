import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  getAiringTodayTV,
  getOnTheAirTV,
  getTopLatedTV,
  IGetTVResult,
} from "../api";
import { makeImagePath } from "../utils";
import GetSimilarTVs from "./GetSimilarTVs";
import GetTVActors from "./GetTVActors";
import {
  BigActors,
  BigCover,
  BigDivs,
  BigMovie,
  BigOverview,
  BigTitle,
  ExitButton,
  Overlay,
} from "../styledComponents";
import { useRecoilState } from "recoil";
import { likeTVAtom } from "../../Atoms";

const GetBigTV = () => {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{
    tvId: string;
    clickedSession: string;
  }>("/tvs/:tvId/:clickedSession");
  const { scrollY } = useViewportScroll();
  const [atom, setAtom] = useRecoilState(likeTVAtom);

  const { data: TopLatedTVData } = useQuery<IGetTVResult>(
    ["TVs", "TopLated"],
    getTopLatedTV
  );
  const { data: OnTheAirTVData } = useQuery<IGetTVResult>(
    ["TVs", "OnTheAir"],
    getOnTheAirTV
  );
  const { data: AiringTodayTVData } = useQuery<IGetTVResult>(
    ["TVs", "AiringToday"],
    getAiringTodayTV
  );

  const matchingTopLated =
    bigMovieMatch?.params.tvId &&
    TopLatedTVData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId);
  const matchingOnTheAir =
    bigMovieMatch?.params.tvId &&
    OnTheAirTVData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId);
  const matchingAiringToday =
    bigMovieMatch?.params.tvId &&
    AiringTodayTVData?.results.find(
      (tv) => tv.id === +bigMovieMatch.params.tvId
    );
  const matchingLiked =
    bigMovieMatch?.params.tvId &&
    atom.find((tv) => tv.id === +bigMovieMatch.params.tvId);

  let clickedMovie;
  if (
    matchingTopLated !== undefined &&
    bigMovieMatch.params.clickedSession === "TopLated"
  ) {
    clickedMovie = matchingTopLated;
  }
  if (
    matchingOnTheAir !== undefined &&
    bigMovieMatch.params.clickedSession === "OnTheAir"
  ) {
    clickedMovie = matchingOnTheAir;
  }
  if (
    matchingAiringToday !== undefined &&
    bigMovieMatch.params.clickedSession === "AiringToday"
  ) {
    clickedMovie = matchingAiringToday;
  }
  if (
    matchingLiked !== undefined &&
    bigMovieMatch.params.clickedSession === "Liked"
  ) {
    clickedMovie = matchingLiked;
  }

  return (
    <>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={() => history.push("/tv")}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 40 }}
              layoutId={
                bigMovieMatch.params.movieId +
                bigMovieMatch.params.clickedSession
              }
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path
                      )})`,
                    }}
                  >
                    <ExitButton onClick={() => history.push("/tv")}>
                      <FontAwesomeIcon icon={faX} />
                    </ExitButton>
                  </BigCover>
                  <BigTitle>{clickedMovie.name}</BigTitle>
                  <div style={{ display: "flex" }}>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                    <BigActors>
                      <GetTVActors tvId={clickedMovie.id} />
                    </BigActors>
                  </div>
                  <BigDivs>
                    <span>Similar TV Shows</span>
                    <GetSimilarTVs tvId={clickedMovie.id} />
                  </BigDivs>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default GetBigTV;
