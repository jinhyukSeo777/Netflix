import { useQuery } from "react-query";
import { Link, useHistory, useParams } from "react-router-dom";
import { getMovieGenres, GetSearchResult, getTVGenres, IGenres } from "./api";
import styled, { keyframes } from "styled-components";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { makeImagePath } from "./utils";
import {
  Box,
  Button,
  Buttons,
  Categories,
  Img,
  InfoBox,
  PlayButton,
  RowTitle,
  RunningTime,
} from "./styledComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPlay,
  faPlus,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import GetMovieData from "./MovieFiles/GetMovieData";
import { useRecoilState } from "recoil";
import { likeMovieAtom, likeTVAtom } from "../Atoms";
import GetTVData from "./TVFiles/GetTVData";
import GetBigSearch from "./GetBigSearch";
import { useState } from "react";

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 100vh;
`;

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: #737373;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    line-height: 200px;
  }
`;

const RingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
    box-shadow: 1px 4px 2px #e65c00;
  }
  50% {
    transform: rotate(180deg);
    box-shadow: 1px 4px 2px #18b201;
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 1px 4px 2px #0456c8;
  }
`;

const Ring = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  animation: ${RingAnimation} 2s linear infinite;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
`;

const summaryBoxVariants = {
  hover: {
    y: -65,
    scaleX: 1.5,
    scaleY: 1.5,
    zIndex: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  active: {
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

interface IResult {
  backdrop_path: string;
  id: number;
  genre_ids: number[];
  media_type: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  name: string;
  vote_average: number;
}

interface IResults {
  backdrop_path: string;
  id: number;
  genre_ids: number[];
  media_type: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  name: string;
  vote_average: number;
  known_for: IResult[];
}

export interface ISearch {
  results: IResults[];
  total_results: number;
}

const Container = styled.div`
  margin-top: 140px;
  padding: 0 60px;
`;

const SearchBoxs = styled.div<{ nofbox: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.nofbox}, 1fr);
  gap: 6px;
  row-gap: 0px;
  margin-top: 15px;
  margin-bottom: 200px;
`;

const SummaryBox = styled(motion.div)<{ nofbox: number }>`
  height: 240px;
  &:hover {
    ${InfoBox} {
      opacity: 1;
      box-shadow: 0px 4px 10px ${(props) => props.theme.black.darker};
      transition-delay: 0.3s;
    }
    ${Box} {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
  &:nth-child(${(props) => props.nofbox}n) {
    transform-origin: center right;
  }
  &:nth-child(${(props) => props.nofbox}n + 1) {
    transform-origin: center left;
  }
`;

const Search = () => {
  const { keyword, mediaType, movieId } = useParams<{
    keyword: string;
    mediaType: string;
    movieId: string;
  }>();
  const history = useHistory();
  const [MovieAtom, setMovieAtom] = useRecoilState(likeMovieAtom);
  const [TvAtom, setTvAtom] = useRecoilState(likeTVAtom);

  const { data, isLoading } = useQuery<ISearch>(`${keyword}`, () =>
    GetSearchResult(keyword as any)
  );

  const { data: MovieGenresData } = useQuery<IGenres>(
    ["Movie", "Genres"],
    getMovieGenres
  );

  const { data: TvGenresData } = useQuery<IGenres>(
    ["TV", "Genres"],
    getTVGenres
  );

  const onBoxClicked = (mediaType: string, movieId: number) => {
    history.push(`/search/${keyword}/${mediaType}/${movieId}`);
  };

  const onMovieLikeClicked = (
    movieId: number,
    movieBackdrop_path: string,
    moviePoster_path: string,
    movieTitle: string,
    movieOverview: string,
    movieVote_average: number,
    movieGenre_ids: number[]
  ) => {
    const isDuplicate = MovieAtom.find((value) => value.id === movieId);
    if (isDuplicate) return;

    setMovieAtom((prev) => [
      ...prev,
      {
        id: movieId,
        backdrop_path: movieBackdrop_path,
        poster_path: moviePoster_path,
        title: movieTitle,
        overview: movieOverview,
        genre_ids: movieGenre_ids,
        vote_average: movieVote_average,
      },
    ]);
  };

  const onTvLikeClicked = (
    movieId: number,
    movieBackdrop_path: string,
    moviePoster_path: string,
    movieTitle: string,
    movieOverview: string,
    movieVote_average: number,
    movieGenre_ids: number[]
  ) => {
    const isDuplicate = TvAtom.find((value) => value.id === movieId);
    if (isDuplicate) return;

    setTvAtom((prev) => [
      ...prev,
      {
        id: movieId,
        backdrop_path: movieBackdrop_path,
        poster_path: moviePoster_path,
        name: movieTitle,
        overview: movieOverview,
        genre_ids: movieGenre_ids,
        vote_average: movieVote_average,
      },
    ]);
  };

  const getNumberOfBoxs = () => {
    const width = window.outerWidth;
    let value = 0;
    if (width >= 2280) value = 9;
    else if (width >= 1980) value = 8;
    else if (width >= 1680) value = 7;
    else if (width >= 1380) value = 6;
    else if (width >= 1080) value = 5;
    else if (width >= 780) value = 4;
    else value = 3;

    return value;
  };
  const [offset, setOffset] = useState(getNumberOfBoxs());

  let timer: NodeJS.Timeout;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setOffset(getNumberOfBoxs());
    }, 100);
  });

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <Ring></Ring>
          <span>Loading...</span>
        </Loader>
      ) : (
        <Container>
          <RowTitle>
            Search Results : <span>{keyword}</span>
          </RowTitle>
          {data ? (
            <SearchBoxs nofbox={offset}>
              {data?.results.map((movie) => {
                if (!movie.known_for && movie.media_type === "movie") {
                  return (
                    <SummaryBox
                      nofbox={offset}
                      key={movie.id}
                      variants={summaryBoxVariants}
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <Box
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        transition={{ type: "tween" }}
                        layoutId={movie.id + "SearchMovie"}
                      >
                        <Img src={require("../images/NetflixIcon.png")} />
                      </Box>
                      <InfoBox variants={infoVariants}>
                        <Buttons>
                          <div>
                            <PlayButton>
                              <FontAwesomeIcon icon={faPlay} />
                            </PlayButton>
                            <Link to={`/detail/movie/${movie.id}`}>
                              <Button>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </Link>
                            <Button
                              onClick={() =>
                                onMovieLikeClicked(
                                  movie.id,
                                  movie.backdrop_path,
                                  movie.poster_path,
                                  movie.title,
                                  movie.overview,
                                  movie.vote_average,
                                  movie.genre_ids
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </Button>
                          </div>
                          <div>
                            <Button
                              onClick={() =>
                                onBoxClicked(movie.media_type, movie.id)
                              }
                            >
                              <FontAwesomeIcon icon={faAngleDown} />
                            </Button>
                          </div>
                        </Buttons>
                        <RunningTime>
                          <span>{movie.title}</span>
                          <GetMovieData movieId={movie.id} />
                        </RunningTime>
                        <Categories>
                          {movie.genre_ids?.slice(0, 3).map((genreId) => {
                            const genreString = MovieGenresData?.genres.find(
                              (value) => value.id === genreId
                            );
                            return (
                              <span key={genreId}>• {genreString?.name} </span>
                            );
                          })}
                        </Categories>
                      </InfoBox>
                    </SummaryBox>
                  );
                } else if (!movie.known_for && movie.media_type === "tv") {
                  return (
                    <SummaryBox
                      nofbox={offset}
                      key={movie.id}
                      variants={summaryBoxVariants}
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <Box
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        transition={{ type: "tween" }}
                        layoutId={movie.id + "SearchTV"}
                      >
                        <Img src={require("../images/NetflixIcon.png")} />
                      </Box>
                      <InfoBox variants={infoVariants}>
                        <Buttons>
                          <div>
                            <PlayButton>
                              <FontAwesomeIcon icon={faPlay} />
                            </PlayButton>
                            <Link to={`/detail/tv/${movie.id}`}>
                              <Button>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </Link>
                            <Button
                              onClick={() =>
                                onTvLikeClicked(
                                  movie.id,
                                  movie.backdrop_path,
                                  movie.poster_path,
                                  movie.name,
                                  movie.overview,
                                  movie.vote_average,
                                  movie.genre_ids
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </Button>
                          </div>
                          <div>
                            <Button
                              onClick={() =>
                                onBoxClicked(movie.media_type, movie.id)
                              }
                            >
                              <FontAwesomeIcon icon={faAngleDown} />
                            </Button>
                          </div>
                        </Buttons>
                        <RunningTime>
                          <span>{movie.name}</span>
                          <GetTVData tvId={movie.id} />
                        </RunningTime>
                        <Categories>
                          {movie.genre_ids?.slice(0, 3).map((genreId) => {
                            const genreString = TvGenresData?.genres.find(
                              (value) => value.id === genreId
                            );
                            return (
                              <span key={genreId}>• {genreString?.name} </span>
                            );
                          })}
                        </Categories>
                      </InfoBox>
                    </SummaryBox>
                  );
                } else {
                  return movie.known_for.map((v) => {
                    if (v.media_type === "movie") {
                      return (
                        <SummaryBox
                          nofbox={offset}
                          key={v.id}
                          variants={summaryBoxVariants}
                          whileHover="hover"
                          transition={{ type: "tween" }}
                        >
                          <Box
                            bgphoto={makeImagePath(v.backdrop_path, "w500")}
                            transition={{ type: "tween" }}
                            layoutId={v.id + "SearchMovie"}
                          >
                            <Img src={require("../images/NetflixIcon.png")} />
                          </Box>
                          <InfoBox variants={infoVariants}>
                            <Buttons>
                              <div>
                                <PlayButton>
                                  <FontAwesomeIcon icon={faPlay} />
                                </PlayButton>
                                <Link to={`/detail/movie/${v.id}`}>
                                  <Button>
                                    <FontAwesomeIcon icon={faPlus} />
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() =>
                                    onMovieLikeClicked(
                                      v.id,
                                      v.backdrop_path,
                                      v.poster_path,
                                      v.title,
                                      v.overview,
                                      v.vote_average,
                                      v.genre_ids
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faThumbsUp} />
                                </Button>
                              </div>
                              <div>
                                <Button
                                  onClick={() =>
                                    onBoxClicked(v.media_type, v.id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faAngleDown} />
                                </Button>
                              </div>
                            </Buttons>
                            <RunningTime>
                              <span>{v.title}</span>
                              <GetMovieData movieId={v.id} />
                            </RunningTime>
                            <Categories>
                              {v.genre_ids?.slice(0, 3).map((genreId) => {
                                const genreString =
                                  MovieGenresData?.genres.find(
                                    (value) => value.id === genreId
                                  );
                                return (
                                  <span key={genreId}>
                                    • {genreString?.name}{" "}
                                  </span>
                                );
                              })}
                            </Categories>
                          </InfoBox>
                        </SummaryBox>
                      );
                    } else {
                      return (
                        <SummaryBox
                          nofbox={offset}
                          key={v.id}
                          variants={summaryBoxVariants}
                          whileHover="hover"
                          transition={{ type: "tween" }}
                        >
                          <Box
                            bgphoto={makeImagePath(v.backdrop_path, "w500")}
                            transition={{ type: "tween" }}
                            layoutId={v.id + "SearchTV"}
                          >
                            <Img src={require("../images/NetflixIcon.png")} />
                          </Box>
                          <InfoBox variants={infoVariants}>
                            <Buttons>
                              <div>
                                <PlayButton>
                                  <FontAwesomeIcon icon={faPlay} />
                                </PlayButton>
                                <Link to={`/detail/tv/${v.id}`}>
                                  <Button>
                                    <FontAwesomeIcon icon={faPlus} />
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() =>
                                    onTvLikeClicked(
                                      v.id,
                                      v.backdrop_path,
                                      v.poster_path,
                                      v.name,
                                      v.overview,
                                      v.vote_average,
                                      v.genre_ids
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faThumbsUp} />
                                </Button>
                              </div>
                              <div>
                                <Button
                                  onClick={() =>
                                    onBoxClicked(v.media_type, v.id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faAngleDown} />
                                </Button>
                              </div>
                            </Buttons>
                            <RunningTime>
                              <span>{v.name}</span>
                              <GetTVData tvId={v.id} />
                            </RunningTime>
                            <Categories>
                              {v.genre_ids?.slice(0, 3).map((genreId) => {
                                const genreString = TvGenresData?.genres.find(
                                  (value) => value.id === genreId
                                );
                                return (
                                  <span key={genreId}>
                                    • {genreString?.name}{" "}
                                  </span>
                                );
                              })}
                            </Categories>
                          </InfoBox>
                        </SummaryBox>
                      );
                    }
                  });
                }
              })}
            </SearchBoxs>
          ) : null}
          {mediaType && movieId ? <GetBigSearch /> : null}
          <Footer />
        </Container>
      )}
    </Wrapper>
  );
};

export default Search;
