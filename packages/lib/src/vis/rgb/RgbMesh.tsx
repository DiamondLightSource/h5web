import type { NdArray } from 'ndarray';
import { useMemo } from 'react';

import VisMesh from '../shared/VisMesh';
import { getUniforms, VERTEX_SHADER } from '../utils';
import { getData3DTexture } from './utils';

interface Props {
  values: NdArray<Uint8Array | Uint8ClampedArray | Float32Array>;
  bgr?: boolean;
  flipXAxis?: boolean;
  flipYAxis?: boolean;
}

function RgbMesh(props: Props) {
  const { values, bgr = false, flipXAxis = false, flipYAxis = true } = props;

  const dataTexture = useMemo(() => getData3DTexture(values), [values]);

  const shader = {
    uniforms: getUniforms({ data: dataTexture, bgr }),
    vertexShader: VERTEX_SHADER,
    fragmentShader: `
      uniform highp sampler3D data;
      uniform bool bgr;

      varying vec2 coords;

      void main() {
        float red = texture(data, vec3(0., coords)).r;
        float green = texture(data, vec3(0.5, coords)).r;
        float blue = texture(data, vec3(1., coords)).r;

        if (bgr) {
          gl_FragColor = vec4(blue, green, red, 1.);
        } else {
          gl_FragColor = vec4(red, green, blue, 1.);
        }
      }
    `,
  };

  return (
    <VisMesh scale={[flipXAxis ? -1 : 1, flipYAxis ? -1 : 1, 1]}>
      <shaderMaterial args={[shader]} />
    </VisMesh>
  );
}

export default RgbMesh;
