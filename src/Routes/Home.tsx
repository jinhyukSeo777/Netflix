import { useQuery } from "react-query";
import styled, { keyframes } from "styled-components";
import { makeImagePath } from "./utils";
import {
  getLatestMovie,
  getNowPlayingMovie,
  getTopLatedMovie,
  getUpcomingMovie,
  IGetLatestResult,
  IGetMoviesResult,
} from "./api";
import TopLatedMovie from "./MovieFiles/TopLatedMovie";
import UpComingMovie from "./MovieFiles/UpcomingMovie";
import NowPlayingMovie from "./MovieFiles/NowPlayingMovie";
import Footer from "../components/Footer";
import GetBigMovie from "./MovieFiles/GetBigMovie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
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

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 25px; ;
`;

const Overview = styled.p`
  font-size: 22px;
  width: 50%;
`;

const PlayButton = styled.div`
  width: 130px;
  height: 45px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.white.lighter};
  color: ${(props) => props.theme.black.veryDark};
  margin-right: 15px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  span {
    margin-left: 7px;
  }
`;

const DetailButton = styled.div`
  width: 170px;
  height: 45px;
  border-radius: 3px;
  background-color: #5e6567;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  span {
    margin-left: 7px;
  }
`;

const Home = () => {
  const { data: NowPlayingMovieData, isLoading: isLoading } =
    useQuery<IGetMoviesResult>(["Movies", "NowPlaying"], getNowPlayingMovie);
  const { data: TopLatedMovieData, isLoading: isLoading2 } =
    useQuery<IGetMoviesResult>(["Movies", "TopLated"], getTopLatedMovie);
  const { data: UpcomingMovieData, isLoading: isLoading3 } =
    useQuery<IGetMoviesResult>(["Movies", "UpComing"], getUpcomingMovie);
  const { data: LatestMovieData, isLoading: isLoading4 } =
    useQuery<IGetLatestResult>(["Movies", "Latest"], getLatestMovie);

  return (
    <Wrapper>
      {isLoading || isLoading2 || isLoading3 || isLoading4 ? (
        <Loader>
          <Ring></Ring>
          <span>Loading...</span>
        </Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              NowPlayingMovieData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{NowPlayingMovieData?.results[0].title}</Title>
            <Overview>{NowPlayingMovieData?.results[0].overview}</Overview>
            <div style={{ display: "flex", marginTop: "25px" }}>
              <PlayButton>
                <FontAwesomeIcon icon={faPlay} />
                <span>Play</span>
              </PlayButton>
              <Link
                to={`/detail/movie/${NowPlayingMovieData?.results[0].id}`}
                style={{ textDecoration: "none" }}
              >
                <DetailButton>
                  <FontAwesomeIcon icon={faCircleInfo} />
                  <span>More Info</span>
                </DetailButton>
              </Link>
            </div>
          </Banner>
          <div style={{ padding: "0 60px" }}>
            <TopLatedMovie />
            <NowPlayingMovie />
            <UpComingMovie />
          </div>
          <GetBigMovie />
          <Footer />
        </>
      )}
    </Wrapper>
  );
};

export default Home;
