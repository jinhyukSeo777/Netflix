import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  GetMovieCredits,
  GetMovieDetail,
  GetMovieTrailer,
  GetSimilarMovie,
  IGetMoviesResult,
  ITrailers,
} from "../api";
import { makeImagePath } from "../utils";
import { Scrollbars } from "react-custom-scrollbars";
import { IActros } from "./GetMovieActors";
import Footer from "../../components/Footer";

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
  padding: 0 70px;
  box-sizing: border-box;
`;

const Poster = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  height: 560px;
  width: 420px;
  margin-top: 130px;
  border-radius: 3px;
  margin-right: 40px;
`;

const InfoContainer = styled.div`
  margin-top: 130px;
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
    margin-right: 10px;
  }
`;

const Overview = styled.p`
  font-size: 19px;
  line-height: 28px;
`;

const Actors = styled.div`
  width: 900px;
  margin-top: 20px;
`;

const ActorBoxs = styled.div`
  display: flex;
  margin-top: 10px;
`;

const ActorBox = styled.div`
  height: 110px;
  width: 80px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ActorImg = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  height: 80px;
  width: 80px;
  border-radius: 3px;
  cursor: pointer;
`;

const ActorName = styled.div`
  height: 30px;
  width: 80px;
  span {
    text-align: center;
    height: 15px;
    width: 80px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  span:first-child {
    font-weight: 600;
    margin-top: 5px;
  }
`;

const TrailerContainer = styled.div`
  height: 200px;
  width: 900px;
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  span {
    color: ${(props) => props.theme.white.darker};
    font-size: 17px;
  }
`;

const TrailerBoxs = styled.div`
  display: flex;
  margin-top: 10px;
`;

const TrailerBox = styled.div`
  height: 160px;
  width: 300px;
  margin-right: 10px;
  border-radius: 3px;
`;

const SimilarMovieWord = styled.span`
  font-size: 20px;
  margin-left: 70px;
  margin-top: 15px;
  display: block;
  color: ${(props) => props.theme.white.darker};
`;

const SimilarMovieBoxs = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 70px;
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

interface IGenre {
  id: number;
  name: string;
}

interface IDetail {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genres: IGenre[];
  runtime: number;
  release_date: string;
  vote_average: number;
}

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { data, isLoading } = useQuery<IDetail>(["movieDetail", movieId], () =>
    GetMovieDetail(movieId as any)
  );
  const { data: credits, isLoading: isLoading2 } = useQuery<IActros>(
    ["Actors", movieId],
    () => GetMovieCredits(movieId as any)
  );
  const { data: trailers, isLoading: isLoading3 } = useQuery<ITrailers>(
    ["Trailers", movieId],
    () => GetMovieTrailer(movieId as any)
  );
  const { data: similarMovies, isLoading: isLoading4 } =
    useQuery<IGetMoviesResult>(["SimilarMovies", movieId], () =>
      GetSimilarMovie(movieId as any)
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
            bgphoto={data ? makeImagePath(data.backdrop_path, "w500") : ""}
          >
            <Poster
              bgphoto={data ? makeImagePath(data.poster_path, "w500") : ""}
            ></Poster>
            <InfoContainer>
              <Scrollbars thumbSize={80} style={{ width: 900, height: 330 }}>
                <InfoBox>
                  <Title>{data?.title}</Title>
                  <SemiInfo>
                    <span>⭐{data?.vote_average}</span>
                    <span>{data?.release_date.slice(0, 4)}</span>
                    <span>{data?.runtime}min</span>
                    {data?.genres.map((genre) => {
                      return <span key={genre.id}>{genre.name}</span>;
                    })}
                  </SemiInfo>
                  <Overview>{data?.overview}</Overview>
                </InfoBox>
                <Actors>
                  <span style={{ fontSize: "17px" }}>Cast</span>
                  <Scrollbars
                    thumbSize={80}
                    style={{ width: 900, height: 140 }}
                  >
                    <ActorBoxs>
                      {credits?.cast.slice(0, 20).map((credit) => {
                        return (
                          <ActorBox key={credit.id}>
                            <ActorImg
                              bgphoto={makeImagePath(
                                credit.profile_path,
                                "w500"
                              )}
                            ></ActorImg>
                            <ActorName>
                              <span>{credit.name}</span>
                              <span>{credit.character}</span>
                            </ActorName>
                          </ActorBox>
                        );
                      })}
                    </ActorBoxs>
                  </Scrollbars>
                </Actors>
              </Scrollbars>
              <TrailerContainer>
                <span>Trailer</span>
                <Scrollbars thumbSize={80} style={{ width: 900, height: 200 }}>
                  <TrailerBoxs>
                    {trailers?.results.map((value) => {
                      return (
                        <TrailerBox key={value.key}>
                          <iframe
                            width="300"
                            height="160"
                            src={`https://www.youtube.com/embed/${value.key}`}
                            allowFullScreen
                          ></iframe>
                        </TrailerBox>
                      );
                    })}
                  </TrailerBoxs>
                </Scrollbars>
              </TrailerContainer>
            </InfoContainer>
          </Container>

          <SimilarMovieWord>Similar Movies</SimilarMovieWord>
          <Scrollbars
            thumbSize={80}
            style={{
              width: "100%",
              height: "210px",
              margin: "10px 0 30px 0",
              backgroundColor: "#141414",
            }}
          >
            <SimilarMovieBoxs>
              {similarMovies?.results.map((similarMovie) => {
                return (
                  <SimilarMovieBox key={similarMovie.id}>
                    <Link
                      to={`/detail/movie/${similarMovie.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <SimilarMovieImg
                        bgphoto={makeImagePath(
                          similarMovie.poster_path,
                          "w500"
                        )}
                      >
                        <div>⭐ {similarMovie.vote_average.toFixed(1)}/10</div>
                      </SimilarMovieImg>
                    </Link>
                  </SimilarMovieBox>
                );
              })}
            </SimilarMovieBoxs>
          </Scrollbars>
          <Footer />
        </>
      )}
    </>
  );
};

export default MovieDetail;
