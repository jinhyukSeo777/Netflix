import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { makeImagePath } from "../utils";
import { getMovieGenres, IGenres } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPlay,
  faPlus,
  faAngleDown,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import GetMovieData from "./GetMovieData";
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
import { likeMovieAtom } from "../../Atoms";

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

const LikedMovie = () => {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isback, setIsBack] = useState(false);
  const [atom, setAtom] = useRecoilState(likeMovieAtom);
  const history = useHistory();

  const { data: genresData } = useQuery<IGenres>(
    ["Movie", "Genres"],
    getMovieGenres
  );

  const increaseIndex = () => {
    if (atom) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = atom.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (atom) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = atom.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setIsBack(false);
    }
  };
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}/Liked`);
  };
  const onUnLikeClicked = (movieId: number) => {
    setAtom((oldAtom) => {
      const clickedAtomIndex = atom.findIndex((value) => value.id === movieId);
      return [
        ...oldAtom.slice(0, clickedAtomIndex),
        ...oldAtom.slice(clickedAtomIndex + 1),
      ];
    });
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
    <FullLine style={{ marginBottom: "0px" }}>
      <Slider>
        <PrevPage onClick={prevClicked}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PrevPage>
        <AnimatePresence
          initial={false}
          onExitComplete={() => setLeaving(false)}
        >
          <Block key={"LikedMovies"}></Block>
          <RowTitle>My Movies</RowTitle>
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
            {atom
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <SummaryBox
                  key={movie.id}
                  variants={summaryBoxVariants}
                  whileHover="hover"
                  transition={{ type: "tween" }}
                >
                  <Box
                    bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    transition={{ type: "tween" }}
                    layoutId={movie.id + "Liked"}
                  >
                    <Img src={require("../../images/NetflixIcon.png")} />
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
                        <Button onClick={() => onUnLikeClicked(movie.id)}>
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </Button>
                      </div>
                      <div>
                        <Button onClick={() => onBoxClicked(movie.id)}>
                          <FontAwesomeIcon icon={faAngleDown} />
                        </Button>
                      </div>
                    </Buttons>
                    <RunningTime>
                      <span>{movie.title}</span>
                      <GetMovieData movieId={movie.id} />
                    </RunningTime>
                    <Categories>
                      {movie.genre_ids.slice(0, 3).map((genreId) => {
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

export default LikedMovie;
