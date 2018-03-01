import * as React from 'react';
import {connect} from 'react-redux';

import {IState} from '../store';
import JustAnotherGallery from '../components/JustAnotherGallery';

const mapStateToProps = (state: IState) => ({
  images: state.gallery.pictures,
});

const DefaultContainer = ({images}) => (
  <div>
    <JustAnotherGallery images={images}/>
  </div>
);

export default connect(mapStateToProps)(DefaultContainer);
