import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GetSimilarTV, IGetTVResult } from "../api";
import { makeImagePath } from "../utils";

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
    background-color: rgba(0, 0, 0, 0.6);
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
    GetSimilarTV(tvId as any)
  );
  const similarTVs = data?.results.slice(0, 3);

  return (
    <>
      {isLoading ? null : (
        <>
          {similarTVs?.map((tv, index) => {
            return (
              <Link
                key={index}
                to={`/detail/tv/${tv.id}`}
                style={{ textDecoration: "none", color: "#e5e5e5" }}
              >
                <Box bgphoto={makeImagePath(tv.backdrop_path, "w500")}>
                  <div>{tv.name}</div>
                </Box>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
};

export default GetSimilarTVs;
