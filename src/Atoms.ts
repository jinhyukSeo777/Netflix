import { atom } from "recoil";
import { IMovie, ITV } from "./Routes/api";

export const likeMovieAtom = atom({
  key: "likeMovieAtom",
  default: [] as IMovie[],
});

export const likeTVAtom = atom({
  key: "likeTVAtom",
  default: [] as ITV[],
});
