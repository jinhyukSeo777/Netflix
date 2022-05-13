import { useQuery } from "react-query";
import styled from "styled-components";
import { GetSimilarMovie, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const API_KEY = "dcbad9ac7abbeb5a64c3012897391ecb";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IProps {
  movieId: number;
}

const Box = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
  div {
    opacity: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &:hover {
    div {
      opacity: 1;
    }
  }
`;

const GetSimilarMovies = ({ movieId }: IProps) => {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["SimilarMovies", movieId],
    () => GetSimilarMovie(movieId as any)
  );
  const similarMovies = data?.results.slice(0, 3);

  return (
    <>
      {isLoading ? null : (
        <>
          {similarMovies?.map((movie, index) => {
            return (
              <Box
                key={index}
                bgphoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <div>{movie.title}</div>
              </Box>
            );
          })}
        </>
      )}
    </>
  );
};

export default GetSimilarMovies;
