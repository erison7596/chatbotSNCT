import { useState, useEffect, useRef } from 'react';

const TypingText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const textRef = useRef('');
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    textRef.current = '';
    setDisplayedText('');

    const typeText = () => {
      if (indexRef.current < text.length) {
        textRef.current += text[indexRef.current];
        indexRef.current += 1;
        setDisplayedText(textRef.current);
      } else {
        clearInterval(intervalRef.current);
      }
    };

    if (text.length > 0) {
      intervalRef.current = setInterval(typeText, 50);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [text]);

  return <span>{displayedText}</span>;
};

export default TypingText;
