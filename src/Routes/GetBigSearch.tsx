import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import GetSimilarMovies from "./MovieFiles/GetSimilarMovies";
import GetMovieActors from "./MovieFiles/GetMovieActors";
import GetSimilarTVs from "./TVFiles/GetSimilarTVs";
import GetTVActors from "./TVFiles/GetTVActors";
import { GetSearchResult } from "./api";
import { makeImagePath } from "./utils";
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
} from "./styledComponents";
import { ISearch } from "./Search";

const GetBigSearch = () => {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{
    keyword: string;
    mediaType: string;
    movieId: string;
  }>("/search/:keyword/:mediaType/:movieId");
  const { scrollY } = useViewportScroll();

  const { data } = useQuery<ISearch>(`${bigMovieMatch.params.keyword}`, () =>
    GetSearchResult(bigMovieMatch.params.keyword as any)
  );

  let clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  if (bigMovieMatch && !clickedMovie) {
    data?.results.map((movie) => {
      if (movie.known_for !== undefined) {
        movie.known_for.map((v) => {
          if (v.id === +bigMovieMatch.params.movieId) clickedMovie = v;
        });
      }
    });
  }

  return (
    <>
      <AnimatePresence>
        <Overlay
          onClick={() =>
            history.push(`/search/${bigMovieMatch.params.keyword}`)
          }
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        {bigMovieMatch.params.mediaType === "movie" ? (
          <BigMovie
            key={bigMovieMatch.params.movieId}
            style={{ top: scrollY.get() + 40 }}
            layoutId={bigMovieMatch.params.movieId + "SearchMovie"}
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
                  <ExitButton
                    onClick={() =>
                      history.push(`/search/${bigMovieMatch.params.keyword}`)
                    }
                  >
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
        ) : (
          <BigMovie
            key={bigMovieMatch.params.movieId}
            style={{ top: scrollY.get() + 40 }}
            layoutId={bigMovieMatch.params.movieId + "SearchTV"}
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
                  <ExitButton
                    onClick={() =>
                      history.push(`/search/${bigMovieMatch.params.keyword}`)
                    }
                  >
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
        )}
      </AnimatePresence>
    </>
  );
};

export default GetBigSearch;
