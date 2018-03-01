import * as React from 'react';
import styles from './JustAnotherGallery.module.scss';
import { IJustAnotherGalleryProps } from './IJustAnotherGalleryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ImageGallery from 'react-image-gallery';

export default class JustAnotherGallery extends React.Component<IJustAnotherGalleryProps, {}> {
  public render(): React.ReactElement<IJustAnotherGalleryProps> {

    return (
      <div className={ styles.justAnotherGallery }>
        <div className={ styles.container }>
          <ImageGallery items={this.props.images.map((img, i) => {
            return {
              original: img.FileRef,
              thumbnail: img.EncodedAbsThumbnailUrl,
              thumbnailClass: `thumbnail thumbnail-${i}`,
              originalClass: `just-another-image-gallery-image image-${i}`,
            };
          })}/>
        </div>
      </div>
    );
  }
}
