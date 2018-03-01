import { PictureLibraryActions } from './actionTypes'
import {ISPImage} from "../interfaces/ISPImage";

export interface IApplyPicturesAction {
  type: PictureLibraryActions.ApplyPictures;
  pictures: ISPImage[];
}


export type IPictureAction = IApplyPicturesAction

export function applyPictures(pictures: ISPImage[]) {
  return { type: PictureLibraryActions.ApplyPictures, pictures };
}

