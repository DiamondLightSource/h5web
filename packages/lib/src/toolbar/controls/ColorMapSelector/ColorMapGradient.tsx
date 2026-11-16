import { useInterpolator } from '../../../vis/heatmap/hooks';
import { type ColorMap } from '../../../vis/heatmap/models';
import { getLinearGradient } from '../../../vis/heatmap/utils';
import styles from './ColorMapSelector.module.css';

interface Props {
  colorMap: ColorMap;
}

function ColorMapGradient(props: Props) {
  const { colorMap } = props;
  const interpolator = useInterpolator(colorMap, false);

  return (
    <div
      className={styles.gradient}
      style={{
        backgroundImage: getLinearGradient(interpolator, 'right'),
      }}
      data-keep-colors
    />
  );
}

export default ColorMapGradient;
