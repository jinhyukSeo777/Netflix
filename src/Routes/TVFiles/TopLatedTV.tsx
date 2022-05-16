import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { makeImagePath } from "../utils";
import { getTopLatedTV, getTVGenres, IGenres, IGetTVResult } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPlay,
  faPlus,
  faAngleDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import GetTVData from "./GetTVData";
import {
  Block,
  Box,
  Button,
  Buttons,
  Categories,
  FullLine,
  Img,
  InfoBox,
  NextPage,
  PlayButton,
  PrevPage,
  Row,
  RowTitle,
  RunningTime,
  Slider,
  SummaryBox,
} from "../styledComponents";
import { useRecoilState } from "recoil";
import { likeTVAtom } from "../../Atoms";

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -(window.outerWidth + 10) : +(window.outerWidth + 10),
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? +(window.outerWidth + 10) : -(window.outerWidth + 10),
    opacity: 0,
  }),
};

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

const TopLatedTV = () => {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isback, setIsBack] = useState(false);
  const [atom, setAtom] = useRecoilState(likeTVAtom);
  const history = useHistory();

  const { data } = useQuery<IGetTVResult>(["TVs", "TopLated"], getTopLatedTV);

  const { data: genresData } = useQuery<IGenres>(["TV", "Genres"], getTVGenres);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setIsBack(false);
    }
  };
  const onBoxClicked = (tvId: number) => {
    history.push(`/tvs/${tvId}/TopLated`);
  };
  const onLikeClicked = (
    movieId: number,
    movieBackdrop_path: string,
    moviePoster_path: string,
    movieTitle: string,
    movieOverview: string,
    movieVote_average: number,
    movieGenre_ids: number[]
  ) => {
    const isDuplicate = atom.find((value) => value.id === movieId);
    if (isDuplicate) return;

    setAtom((prev) => [
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
  const prevClicked = () => {
    setIsBack(true);
    setTimeout(decreaseIndex, 10);
  };
  const nextClicked = () => {
    setIsBack(false);
    setTimeout(increaseIndex, 10);
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
      setIndex(0);
    }, 100);
  });

  return (
    <FullLine>
      <Slider>
        <PrevPage onClick={prevClicked}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PrevPage>
        <AnimatePresence
          initial={false}
          onExitComplete={() => setLeaving(false)}
        >
          <Block key={"TopLatedTV"}></Block>
          <RowTitle>Popular on Netflix</RowTitle>
          <Row
            custom={isback}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={offset * 100 + index}
            nofbox={offset}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <SummaryBox
                  key={tv.id}
                  variants={summaryBoxVariants}
                  whileHover="hover"
                  transition={{ type: "tween" }}
                >
                  <Box
                    bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    transition={{ type: "tween" }}
                    layoutId={tv.id + "TopLated"}
                  >
                    <Img src={require("../../images/NetflixIcon.png")} />
                  </Box>
                  <InfoBox variants={infoVariants}>
                    <Buttons>
                      <div>
                        <PlayButton>
                          <FontAwesomeIcon icon={faPlay} />
                        </PlayButton>
                        <Link to={`/detail/tv/${tv.id}`}>
                          <Button>
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </Link>
                        <Button
                          onClick={() =>
                            onLikeClicked(
                              tv.id,
                              tv.backdrop_path,
                              tv.poster_path,
                              tv.name,
                              tv.overview,
                              tv.vote_average,
                              tv.genre_ids
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </Button>
                      </div>
                      <div>
                        <Button onClick={() => onBoxClicked(tv.id)}>
                          <FontAwesomeIcon icon={faAngleDown} />
                        </Button>
                      </div>
                    </Buttons>
                    <RunningTime>
                      <span>{tv.name}</span>
                      <GetTVData tvId={tv.id} />
                    </RunningTime>
                    <Categories>
                      {tv.genre_ids.slice(0, 3).map((genreId) => {
                        const genreString = genresData?.genres.find(
                          (value) => value.id === genreId
                        );
                        return (
                          <span key={genreId}>• {genreString?.name} </span>
                        );
                      })}
                    </Categories>
                  </InfoBox>
                </SummaryBox>
              ))}
          </Row>
        </AnimatePresence>
        <NextPage onClick={nextClicked}>
          <FontAwesomeIcon icon={faAngleRight} />
        </NextPage>
      </Slider>
    </FullLine>
  );
};

export default TopLatedTV;
