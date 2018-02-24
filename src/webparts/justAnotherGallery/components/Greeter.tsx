import * as React from 'react';

import styles from './JustAnotherGallery.module.scss';

export interface IGreeterProps {
  description: string;
}

const Greeter = ({ description }: IGreeterProps) => (
  <div className={styles.description}>
    Hello {description}!
  </div>
);

export default Greeter;
