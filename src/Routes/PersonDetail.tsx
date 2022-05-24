import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { GetPerSonDetail, GetSearchPerson } from "./api";
import { makeImagePath } from "./utils";
import { Scrollbars } from "react-custom-scrollbars";
import Footer from "../components/Footer";

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

const Container = styled.div<{ bgphoto: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgphoto});
  background-color: rgba(0, 0, 0, 0.35);
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const Poster = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  height: 560px;
  width: 420px;
  border-radius: 3px;
  margin-right: 40px;
`;

const InfoContainer = styled.div`
  height: 560px;
  width: 900px;
`;

const InfoBox = styled.div`
  color: ${(props) => props.theme.white.darker};
`;

const Title = styled.span`
  font-size: 35px;
`;

const SemiInfo = styled.div`
  margin: 20px 0;
  span {
    margin-right: 8px;
  }
`;

const Overview = styled.p`
  font-size: 17px;
  line-height: 28px;
`;

const SimilarMovieWord = styled.span`
  font-size: 20px;
  margin-top: 15px;
  display: block;
  color: ${(props) => props.theme.white.darker};
`;

const SimilarMovieBoxs = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: ${(props) => props.theme.black.veryDark};
`;

const SimilarMovieBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const SimilarMovieImg = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  width: 160px;
  height: 210px;
  border-radius: 3px;
  cursor: pointer;
  div {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    opacity: 0;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 5px;
    box-sizing: border-box;
    font-size: 17px;
    color: ${(props) => props.theme.white.lighter};
  }
  &:hover {
    div {
      opacity: 1;
    }
  }
`;

interface IPersonDetail {
  birthday: string;
  deathday: string;
  name: string;
  also_known_as: string[];
  biography: string;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  gender: number;
}

interface IKnwonFor {
  poster_path: string;
  id: number;
  media_type: string;
  vote_average: number;
}

interface IPerson {
  profile_path: string;
  id: number;
  known_for: IKnwonFor[];
}

interface IPersonSearch {
  page: number;
  results: IPerson[];
}

const PersonDetail = () => {
  const { personId } = useParams<{ personId: string }>();
  const { data, isLoading } = useQuery<IPersonDetail>(
    ["personDetail", personId],
    () => GetPerSonDetail(personId as any)
  );
  const { data: searchPersonData, isLoading: isLoading2 } =
    useQuery<IPersonSearch>(["personSearch", data?.name], () =>
      GetSearchPerson(data?.name as any)
    );
  const similarMovies = searchPersonData?.results.find(
    (v) => v.id + "" === personId
  );

  return (
    <>
      {isLoading || isLoading2 ? (
        <Loader>
          <Ring></Ring>
          <span>Loading...</span>
        </Loader>
      ) : (
        <>
          <Container
            bgphoto={data ? makeImagePath(data.profile_path, "w500") : ""}
          >
            <Poster
              bgphoto={data ? makeImagePath(data.profile_path, "w500") : ""}
            ></Poster>
            <InfoContainer>
              <Scrollbars thumbSize={80} style={{ width: 900, height: 560 }}>
                <InfoBox>
                  <Title>{data?.name}</Title>
                  <SemiInfo>
                    <div style={{ marginBottom: "25px" }}>
                      <span>{data?.birthday.slice(0, 4)} ~</span>
                      <span> {data?.deathday ? data.deathday : "Now"}</span>
                      <span>▪ {data?.place_of_birth}</span>
                      <span>▪ {data?.known_for_department}</span>
                      <span>▪ {data?.gender === 2 ? "Male" : "Female"}</span>
                    </div>
                    <div style={{ marginBottom: "50px" }}>
                      <span
                        style={{
                          display: "block",
                          marginBottom: "15px",
                          color: "#c19e35",
                          fontSize: "20px",
                        }}
                      >
                        Alse Known As
                      </span>
                      {data?.also_known_as.map((v, index) => (
                        <span key={index} style={{ marginRight: "15px" }}>
                          {v}
                          {index !== data.also_known_as.length - 1 ? "," : null}
                        </span>
                      ))}
                    </div>
                  </SemiInfo>
                  <span
                    style={{
                      display: "block",
                      marginBottom: "15px",
                      color: "#c19e35",
                      fontSize: "20px",
                    }}
                  >
                    Biography
                  </span>
                  <Overview>{data?.biography}</Overview>
                </InfoBox>
              </Scrollbars>
            </InfoContainer>
          </Container>

          <div style={{ padding: "0 70px" }}>
            <SimilarMovieWord>Works</SimilarMovieWord>
            <Scrollbars
              thumbSize={80}
              style={{
                width: "100%",
                height: "228px",
                margin: "10px 0 30px 0",
                backgroundColor: "#141414",
              }}
            >
              <SimilarMovieBoxs>
                {similarMovies?.known_for.map((similarMovie) => {
                  return (
                    <SimilarMovieBox key={similarMovie.id}>
                      <Link
                        to={
                          similarMovie.media_type === "movie"
                            ? `/detail/movie/${similarMovie.id}`
                            : `/detail/tv/${similarMovie.id}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <SimilarMovieImg
                          bgphoto={makeImagePath(
                            similarMovie.poster_path,
                            "w500"
                          )}
                        >
                          <div>
                            ⭐ {similarMovie.vote_average.toFixed(1)}
                            /10
                          </div>
                        </SimilarMovieImg>
                      </Link>
                    </SimilarMovieBox>
                  );
                })}
              </SimilarMovieBoxs>
            </Scrollbars>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default PersonDetail;
