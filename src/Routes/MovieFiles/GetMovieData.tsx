import { useQuery } from "react-query";
import { GetMovieDetail } from "../api";

const API_KEY = "dcbad9ac7abbeb5a64c3012897391ecb";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IProps {
  movieId: number;
}

export interface IRunningTime {
  release_date: string;
  runtime: number;
}

const GetMovieData = ({ movieId }: IProps) => {
  const { data, isLoading } = useQuery<IRunningTime>(
    ["RunningTime", movieId],
    () => GetMovieDetail(movieId as any)
  );

  const releaseDate = `${data?.release_date.slice(0, 4)}년`;
  const hour = data ? data.runtime / 60 : null;
  const minute = data ? data.runtime % 60 : null;

  return (
    <>
      {isLoading ? null : (
        <>
          <span>{releaseDate}</span>
          <span>
            {hour?.toFixed(0)}시간{minute}분
          </span>
        </>
      )}
    </>
  );
};

export default GetMovieData;
