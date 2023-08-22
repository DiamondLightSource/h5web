import type { NumArray } from '@h5web/shared';
import { assertDefined, getDims } from '@h5web/shared';
import type { NdArray } from 'ndarray';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

import type { DefaultInteractionsConfig } from '../../interactions/DefaultInteractions';
import DefaultInteractions from '../../interactions/DefaultInteractions';
import ResetZoomButton from '../../toolbar/floating/ResetZoomButton';
import styles from '../heatmap/HeatmapVis.module.css';
import { usePixelEdgeValues } from '../heatmap/hooks';
import { useAxisDomain } from '../hooks';
import type { Aspect, AxisParams } from '../models';
import VisCanvas from '../shared/VisCanvas';
import { ImageType } from './models';
import RgbMesh from './RgbMesh';
import { toRgbSafeNdArray } from './utils';

interface Props {
  dataArray: NdArray<NumArray>;
  aspect?: Aspect;
  showGrid?: boolean;
  title?: string;
  imageType?: ImageType;
  abscissaParams?: AxisParams;
  ordinateParams?: AxisParams;
  flipXAxis?: boolean;
  flipYAxis?: boolean;
  children?: ReactNode;
  interactions?: DefaultInteractionsConfig;
}

function RgbVis(props: Props) {
  const {
    dataArray,
    aspect = 'equal',
    showGrid = false,
    title,
    imageType = ImageType.RGB,
    abscissaParams = {},
    ordinateParams = {},
    flipXAxis,
    flipYAxis = true,
    children,
    interactions,
  } = props;

  const { label: abscissaLabel, value: abscissaValue } = abscissaParams;
  const { label: ordinateLabel, value: ordinateValue } = ordinateParams;
  const { rows, cols } = getDims(dataArray);

  const abscissas = usePixelEdgeValues(abscissaValue, cols);
  const abscissaDomain = useAxisDomain(abscissas);
  assertDefined(abscissaDomain, 'Abscissas have undefined domain');

  const ordinates = usePixelEdgeValues(ordinateValue, rows);
  const ordinateDomain = useAxisDomain(ordinates);
  assertDefined(ordinateDomain, 'Ordinates have undefined domain');

  const safeDataArray = useMemo(() => toRgbSafeNdArray(dataArray), [dataArray]);

  return (
    <figure className={styles.root} aria-label={title} data-keep-canvas-colors>
      <VisCanvas
        title={title}
        aspect={aspect}
        abscissaConfig={{
          visDomain: abscissaDomain,
          showGrid,
          isIndexAxis: true,
          label: abscissaLabel,
          flip: flipXAxis,
        }}
        ordinateConfig={{
          visDomain: ordinateDomain,
          showGrid,
          isIndexAxis: true,
          flip: flipYAxis,
          label: ordinateLabel,
        }}
      >
        <DefaultInteractions {...interactions} />
        <ResetZoomButton />

        <RgbMesh
          values={safeDataArray}
          bgr={imageType === ImageType.BGR}
          flipXAxis
          flipYAxis
        />

        {children}
      </VisCanvas>
    </figure>
  );
}

export default RgbVis;
