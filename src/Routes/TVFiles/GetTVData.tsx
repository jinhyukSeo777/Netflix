import { useQuery } from "react-query";
import { GetTVDetail } from "../api";

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
    () => GetTVDetail(tvId as any)
  );

  const firstAirDate = `${data?.first_air_date?.slice(
    0,
    4
  )}/${data?.first_air_date?.slice(5, 7)}/${data?.first_air_date?.slice(
    8,
    10
  )}`;
  const lastAirDate = `${data?.last_air_date?.slice(
    0,
    4
  )}/${data?.last_air_date?.slice(5, 7)}/${data?.last_air_date?.slice(8, 10)}`;

  return (
    <>
      {isLoading ? null : (
        <>
          {data?.first_air_date && data.last_air_date ? (
            <>
              <span style={{ marginRight: "2px" }}>{firstAirDate}</span>
              <span style={{ marginRight: "2px" }}>~</span>
              <span style={{ marginRight: "0px" }}>{lastAirDate}</span>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default GetTVData;
