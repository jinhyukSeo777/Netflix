import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GetSimilarMovie, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

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
              <Link
                key={index}
                to={`/detail/movie/${movie.id}`}
                style={{ textDecoration: "none", color: "#e5e5e5" }}
              >
                <Box bgphoto={makeImagePath(movie.backdrop_path, "w500")}>
                  <div>{movie.title}</div>
                </Box>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
};

export default GetSimilarMovies;
