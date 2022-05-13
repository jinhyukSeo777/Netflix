import { useQuery } from "react-query";
import styled, { keyframes } from "styled-components";
import { makeImagePath } from "./utils";
import {
  getAiringTodayTV,
  getOnTheAirTV,
  getTopLatedTV,
  IGetTVResult,
} from "./api";
import TopLatedTV from "./TVFiles/TopLatedTV";
import OnTheAirTV from "./TVFiles/OnTheAirTV";
import AiringTodayTV from "./TVFiles/AiringTodayTV";
import Footer from "../components/Footer";
import GetBigTV from "./TVFiles/GetBigTV";
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

const TV = () => {
  const { data: TopLatedTVData, isLoading: isLoading } = useQuery<IGetTVResult>(
    ["TVs", "TopLated"],
    getTopLatedTV
  );
  const { data: OnTheAirData, isLoading: isLoading2 } = useQuery<IGetTVResult>(
    ["TVs", "OnTheAir"],
    getOnTheAirTV
  );
  const { data: AiringTodayData, isLoading: isLoading3 } =
    useQuery<IGetTVResult>(["TVs", "AiringToday"], getAiringTodayTV);

  return (
    <Wrapper>
      {isLoading || isLoading2 || isLoading3 ? (
        <Loader>
          <Ring></Ring>
          <span>Loading...</span>
        </Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              TopLatedTVData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{TopLatedTVData?.results[0].name}</Title>
            <Overview>{TopLatedTVData?.results[0].overview}</Overview>
            <div style={{ display: "flex", marginTop: "25px" }}>
              <PlayButton>
                <FontAwesomeIcon icon={faPlay} />
                <span>Play</span>
              </PlayButton>
              <Link
                to={`/detail/tv/${TopLatedTVData?.results[0].id}`}
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
            <TopLatedTV />
            <OnTheAirTV />
            <AiringTodayTV />
          </div>
          <GetBigTV />
          <Footer />
        </>
      )}
    </Wrapper>
  );
};

export default TV;
