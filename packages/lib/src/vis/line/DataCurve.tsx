import { extend, useThree } from '@react-three/fiber';
import type { Object3DNode } from '@react-three/fiber';
import { useLayoutEffect, useState } from 'react';
import { BufferGeometry, Line } from 'three';

import ErrorBars from './ErrorBars';
import GlyphMaterial from './GlyphMaterial';
import { useCanvasPoints } from './hooks';
import { CurveType, GlyphType } from './models';

extend({ Line_: Line });

// https://github.com/pmndrs/react-three-fiber/issues/1152
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      line_: Object3DNode<Line, typeof Line>;
    }
  }
}

interface Props {
  abscissas: number[];
  ordinates: number[];
  errors?: number[];
  showErrors?: boolean;
  color: string;
  curveType?: CurveType;
}

function DataCurve(props: Props) {
  const {
    abscissas,
    ordinates,
    errors,
    showErrors,
    color,
    curveType = CurveType.LineOnly,
  } = props;

  const [dataGeometry] = useState(() => new BufferGeometry());
  const points = useCanvasPoints(abscissas, ordinates, errors);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    dataGeometry.setFromPoints(points.data);
    invalidate();
  }, [dataGeometry, invalidate, points.data]);

  const showLine = curveType !== CurveType.GlyphsOnly;
  const showGlyphs = curveType !== CurveType.LineOnly;

  return (
    <>
      <line_ visible={showLine} geometry={dataGeometry}>
        <lineBasicMaterial color={color} linewidth={2} />
      </line_>
      <points visible={showGlyphs} geometry={dataGeometry}>
        <GlyphMaterial glyphType={GlyphType.Cross} color={color} size={6} />
      </points>
      {showErrors && errors && (
        <ErrorBars
          barsSegments={points.bars}
          capsPoints={points.caps}
          color={color}
        />
      )}
    </>
  );
}

export default DataCurve;
