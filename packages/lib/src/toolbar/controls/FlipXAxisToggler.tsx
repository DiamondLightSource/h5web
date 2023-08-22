import { MdSwapHoriz } from 'react-icons/md';

import ToggleBtn from './ToggleBtn';

interface Props {
  value: boolean;
  onToggle: () => void;
}

function FlipXAxisToggler(props: Props) {
  const { value, onToggle } = props;

  return (
    <ToggleBtn
      label="Flip X"
      icon={MdSwapHoriz}
      value={value}
      onToggle={onToggle}
    />
  );
}

export default FlipXAxisToggler;
