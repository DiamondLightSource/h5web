import React, { ReactElement } from 'react';
import styles from './ScalarVis.module.css';
import type { HDF5Value } from '../providers/hdf5-models';
import { assertNumOrStr } from '../guards';

interface Props {
  value: HDF5Value;
}

function ScalarVis(props: Props): ReactElement {
  const { value } = props;
  assertNumOrStr(value);
  return <div className={styles.scalar}>{value.toString()}</div>;
}

export type { Props as ScalarVisProps };
export default ScalarVis;
