import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetTVResult } from "../api";
import { makeImagePath } from "../utils";

const API_KEY = "dcbad9ac7abbeb5a64c3012897391ecb";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IProps {
  tvId: number;
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

const GetSimilarTVs = ({ tvId }: IProps) => {
  const { data, isLoading } = useQuery<IGetTVResult>(["SimilarTVs", tvId], () =>
    fetch(`${BASE_PATH}/tv/${tvId}/similar?api_key=${API_KEY}`).then(
      (response) => response.json()
    )
  );
  const similarTVs = data?.results.slice(0, 3);

  return (
    <>
      {isLoading ? null : (
        <>
          {similarTVs?.map((tv, index) => {
            return (
              <Box
                key={index}
                bgphoto={makeImagePath(tv.backdrop_path, "w500")}
              >
                <div>{tv.name}</div>
              </Box>
            );
          })}
        </>
      )}
    </>
  );
};

export default GetSimilarTVs;
