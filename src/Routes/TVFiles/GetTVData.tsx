import { useQuery } from "react-query";

const API_KEY = "dcbad9ac7abbeb5a64c3012897391ecb";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IProps {
  tvId: number;
}

export interface IRunningTime {
  first_air_date: string;
  last_air_date: string;
}

const GetTVData = ({ tvId }: IProps) => {
  const { data, isLoading } = useQuery<IRunningTime>(
    ["RunningTime", tvId],
    () =>
      fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then((response) =>
        response.json()
      )
  );

  const firstAirDate = `${data?.first_air_date.slice(
    0,
    4
  )}/${data?.first_air_date.slice(5, 7)}/${data?.first_air_date.slice(8, 10)}`;
  const lastAirDate = `${data?.last_air_date.slice(
    0,
    4
  )}/${data?.last_air_date.slice(5, 7)}/${data?.last_air_date.slice(8, 10)}`;

  return (
    <>
      {isLoading ? null : (
        <>
          <span style={{ marginRight: "2px" }}>{firstAirDate}</span>
          <span style={{ marginRight: "2px" }}>~</span>
          <span style={{ marginRight: "0px" }}>{lastAirDate}</span>
        </>
      )}
    </>
  );
};

export default GetTVData;
