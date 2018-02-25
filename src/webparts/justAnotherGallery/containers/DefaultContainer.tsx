import * as React from 'react';
import {connect} from 'react-redux';

import {IState} from '../store';
import ListsComponent from '../components/ListsComponent';

const mapStateToProps = (state: IState) => ({
  pictures: state.gallery.pictures,
});

const DefaultContainer = ({pictures}) => (
  <div>
    <ListsComponent pictures={pictures}/>
  </div>
);

export default connect(mapStateToProps)(DefaultContainer);
