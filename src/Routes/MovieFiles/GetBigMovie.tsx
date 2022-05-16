import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import GetSimilarMovies from "./GetSimilarMovies";
import {
  getNowPlayingMovie,
  getTopLatedMovie,
  getUpcomingMovie,
  IGetMoviesResult,
} from "../api";
import GetMovieActors from "./GetMovieActors";
import { makeImagePath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
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
import { likeMovieAtom } from "../../Atoms";

const GetBigMovie = () => {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{
    movieId: string;
    clickedSession: string;
  }>("/movies/:movieId/:clickedSession");
  const { scrollY } = useViewportScroll();
  const [atom, setAtom] = useRecoilState(likeMovieAtom);

  const { data: NowPlayingMovieData } = useQuery<IGetMoviesResult>(
    ["Movies", "NowPlaying"],
    getNowPlayingMovie
  );
  const { data: TopLatedMovieData } = useQuery<IGetMoviesResult>(
    ["Movies", "TopLated"],
    getTopLatedMovie
  );
  const { data: UpcomingMovieData } = useQuery<IGetMoviesResult>(
    ["Movies", "UpComing"],
    getUpcomingMovie
  );

  const matchingNowPlaying =
    bigMovieMatch?.params.movieId &&
    NowPlayingMovieData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  const matchingTopLated =
    bigMovieMatch?.params.movieId &&
    TopLatedMovieData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  const matchingUpcoming =
    bigMovieMatch?.params.movieId &&
    UpcomingMovieData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  const matchingLiked =
    bigMovieMatch?.params.movieId &&
    atom.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  let clickedMovie;
  if (
    matchingNowPlaying !== undefined &&
    bigMovieMatch.params.clickedSession === "NowPlaying"
  ) {
    clickedMovie = matchingNowPlaying;
  }
  if (
    matchingTopLated !== undefined &&
    bigMovieMatch.params.clickedSession === "TopLated"
  ) {
    clickedMovie = matchingTopLated;
  }
  if (
    matchingUpcoming !== undefined &&
    bigMovieMatch.params.clickedSession === "Upcoming"
  ) {
    clickedMovie = matchingUpcoming;
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
              onClick={() => history.push("/")}
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
                    <ExitButton onClick={() => history.push("/")}>
                      <FontAwesomeIcon icon={faX} />
                    </ExitButton>
                  </BigCover>
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <div style={{ display: "flex" }}>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                    <BigActors>
                      <GetMovieActors movieId={clickedMovie.id} />
                    </BigActors>
                  </div>
                  <BigDivs>
                    <span>Similar Movies</span>
                    <GetSimilarMovies movieId={clickedMovie.id} />
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

export default GetBigMovie;
