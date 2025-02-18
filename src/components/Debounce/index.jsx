import React, { useState, useCallback } from 'react';

const Debounce = ({ onChange, delay = 300, children }) => {
  const [timer, setTimer] = useState(null);

  const handleInputChange = useCallback((event) => {
    const value = event.target.value;
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => onChange(value), delay));
  }, [onChange, delay, timer]);

  return React.cloneElement(children, { onChange: handleInputChange });
};

export default Debounce;
