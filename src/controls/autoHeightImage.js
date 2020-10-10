import PropTypes from 'prop-types';
import React, { useState, useMemo, useCallback } from 'react';
import { Image, Dimensions } from 'react-native';

export const AutoHeightImage = ({
  source, style, initialWidth, ...props
}) => {
  const [height, setHeight] = useState(() => (source.height * initialWidth) / source.width);
  const imageStyle = useMemo(() => [...style, { height }], [style, height]);
  const onLayout = useCallback(({ nativeEvent: { layout } }) => setHeight((source.height * layout.width) / source.width), [source]);

  return (
    <Image
      style={imageStyle}
      source={source}
      onLayout={onLayout}
      {...props}
    />
  );
};

AutoHeightImage.propTypes = {
  source: PropTypes.object.isRequired,
  style: PropTypes.arrayOf(PropTypes.object.isRequired),
  initialWidth: PropTypes.number,
};

AutoHeightImage.defaultProps = {
  style: [],
  initialWidth: Dimensions.get('window').width,
};
