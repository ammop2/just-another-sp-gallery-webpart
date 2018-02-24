import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from '../store';
import JustAnotherGallery from '../components/JustAnotherGallery';

const mapStateToProps = (state: IState) => ({
  description: state.webpart.properties.description
});

const DefaultContainer = ({ description }) => (
  <div>
    <JustAnotherGallery description={description} />
  </div>
);

export default connect(mapStateToProps)(DefaultContainer);
