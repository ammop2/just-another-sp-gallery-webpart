import { assign } from 'lodash';
import {IApplyPicturesAction, IPictureAction} from "../actions/pictureAction";
import {PictureLibraryActions} from '../actions/actionTypes'
import {ISPImage} from "../interfaces/ISPImage";

export interface IGalleryState {
  pictures: ISPImage[];
}

export const initialState: IGalleryState = {
  pictures: []
};

export default (state = initialState, action: IPictureAction) => {
  switch (action.type) {
    case PictureLibraryActions.ApplyPictures:
      return assign({}, state, {
        pictures: (<IApplyPicturesAction>action).pictures
      });
    default:
      return state;
  }
};
