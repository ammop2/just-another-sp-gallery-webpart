import { combineReducers, Reducer } from 'redux';

import galleryReducer, { IGalleryState } from './gallery';

export interface IState {
  gallery: IGalleryState;
}

export const rootReducer: Reducer<IState> = combineReducers<IState>({
  gallery: galleryReducer
});
