import * as React from 'react';

import {ISPList} from "../interfaces/ISPList";
import {ISPImage} from "../interfaces/ISPImage";

export interface IListComponentProps {
  pictures: ISPImage[];
  takeThumbnail: boolean;
}


const ListComponent = ({pictures, takeThumbnail}: IListComponentProps) => (
  <div>
    {pictures != null ? pictures.map((list, i) => <img src={ takeThumbnail ? list.EncodedAbsThumbnailUrl:list.FileRef} key={'image-'+i}/>) : 'no picutures'}
  </div>
);

export default ListComponent;
