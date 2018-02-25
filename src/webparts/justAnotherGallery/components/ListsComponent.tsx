import * as React from 'react';

import {ISPList} from "../interfaces/ISPList";
import {ISPImage} from "../interfaces/ISPImage";

export interface IListComponentProps {
  pictures: ISPImage[];
}


const ListComponent = ({pictures}: IListComponentProps) => (
  <div>
    {pictures != null ? pictures.map((list, i) => <img src={list.FileRef} key={'image-'+i}/>) : 'no picutures'}
  </div>
);

export default ListComponent;
