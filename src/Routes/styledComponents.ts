import { motion } from "framer-motion";
import styled from "styled-components";

export const FullLine = styled.div`
  position: relative;
  margin-top: 100px;
  margin-bottom: 200px;
`;

export const NextPage = styled.div`
  position: absolute;
  top: 45px;
  right: -55px;
  width: 55px;
  height: 120px;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  &:hover {
    font-size: 32px;
  }
`;

export const PrevPage = styled.div`
  position: absolute;
  top: 45px;
  left: -55px;
  width: 55px;
  height: 120px;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  &:hover {
    font-size: 32px;
  }
`;

export const Slider = styled.div`
  position: relative;
  top: -190px;
  :hover {
    ${PrevPage}, ${NextPage} {
      opacity: 1;
    }
  }
`;

export const Block = styled.div`
  position: absolute;
  top: 170px;
  left: 0;
  width: 100%;
  height: 120px;
  z-index: 1;
`;

export const RowTitle = styled.h1`
  font-size: 25px;
  padding-bottom: 20px;
  span {
    font-size: 22px;
    opacity: 0.6;
  }
`;

export const Row = styled(motion.div)<{ nofbox: number }>`
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(${(props) => props.nofbox}, 1fr);
  position: absolute;
  width: 100%;
`;

export const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 50%;
  overflow: hidden;
  border-radius: 3px;
  cursor: pointer;
`;

export const InfoBox = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  height: 50%;
  opacity: 0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  transition-delay: 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${(props) => props.theme.white.lighter};
`;

export const SummaryBox = styled(motion.div)`
  height: 240px;
  &:hover {
    ${InfoBox} {
      opacity: 1;
      box-shadow: 0px 4px 10px ${(props) => props.theme.black.darker};
      transition-delay: 0.3s;
    }
    ${Box} {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
`;

export const Buttons = styled.div`
  height: 33%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
  }
`;

export const Button = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 0.5px solid ${(props) => props.theme.white.lighter};
  margin-right: 9px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    border-color: white;
    transform: scale(1.15);
  }
`;

export const PlayButton = styled(Button)`
  color: ${(props) => props.theme.black.lighter};
  background-color: white;
  border: none;
  &:hover {
    background-color: #f0efef;
    transform: scale(1.15);
  }
`;

export const RunningTime = styled.div`
  height: 33%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  span {
    margin-right: 8px;
  }
`;

export const Categories = styled.div`
  height: 33%;
  width: 100%;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  span {
    margin-right: 10px;
  }
`;

export const Img = styled.img`
  position: relative;
  top: 8px;
  left: 8px;
  width: 13px;
  height: 23px;
`;

//////////////////////////////////////////////////////////////////////////

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  z-index: 99;
`;

export const ExitButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.black.darker};
  font-size: 18px;
  cursor: pointer;
`;

export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 800px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  z-index: 100;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;

export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 300px;
  position: relative;
`;

export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: absolute;
  top: 210px;
  left: 0;
`;

export const BigOverview = styled.p`
  padding: 20px 30px 20px 20px;
  width: 55%;
  line-height: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

export const BigActors = styled.div`
  width: 35%;
  height: 170px;
`;

export const BigDivs = styled.div`
  margin: 0 8px;
  padding: 20px 0 20px 0;
  height: 180px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  position: relative;
  span {
    position: absolute;
    top: 35px;
    left: 15px;
    font-size: 20px;
  }
  div {
    width: 240px;
    height: 130px;
  }
`;
