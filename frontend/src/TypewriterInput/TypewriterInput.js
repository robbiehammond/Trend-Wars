import React, { useState, useEffect, useRef } from 'react';

export const TypewriterInput = ({ firstWord = "Hello", onValueChange, handleKeyDown }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Reset state when firstWord changes
  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    setUserInput('');
  }, [firstWord]);

  // Typewriter effect for the first word
  useEffect(() => {
    if (displayedText.length < firstWord.length) {
      const timer = setTimeout(() => {
        setDisplayedText(firstWord.slice(0, displayedText.length + 1));
      }, 100); // Adjust typing speed here
      return () => clearTimeout(timer);
    } else {
      // Add a small delay before allowing user input
      const completeTimer = setTimeout(() => {
        setIsTypingComplete(true);
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [displayedText, firstWord]);

  const handleContainerClick = () => {
    if (isTypingComplete && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    minHeight: '56px',
    padding: '12px 16px',
    border: `2px solid ${isFocused ? 'rgb(144 143 187 / var(--tw-bg-opacity, 1))' : '#e0e0e0'}`,
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    cursor: 'text',
    backgroundColor: '#8FBB90',
    boxShadow: isFocused ? '0 4px 20px rgba(144, 143, 187, 0.5)' : 'none',
    margin: '0 auto'
  };

  const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '32px'
  };

  const firstWordStyle = {
    color: '#333',
    fontWeight: '500',
    userSelect: 'none'
  };

  const cursorStyle = {
    animation: 'blink 1s infinite'
  };

  const inputStyle = {
    flex: '1',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#333',
    border: 'none',
	fontSize: '3rem',
    minWidth: '100px'
  };

  const labelStyle = {
    position: 'absolute',
    left: '16px',
    transition: 'all 0.2s ease',
    pointerEvents: 'none',
    top: isFocused || displayedText || userInput ? '-8px' : '16px',
    fontSize: isFocused || displayedText || userInput ? '12px' : '16px',
    backgroundColor: '#8FBB90',
    padding: '0 4px',
    color: 'white'// isFocused || displayedText || userInput ? '#2196F3' : '#999'
  };

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typewriter-container:hover {
          border-color: #bdbdbd;
        }
      `}</style>
      
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={containerStyle}
        className="typewriter-container word"
      >
        <div style={contentStyle}>
          {/* First word with typewriter effect */}
          <span style={firstWordStyle}>
            {displayedText}
            {!isTypingComplete && (
              <span style={cursorStyle}>|</span>
            )}
          </span>
          
          {/* Spacer and user input */}
          {isTypingComplete && (
            <>
              <span style={{ width: '8px' }} /> {/* Space after first word */}
              <input
			   autoFocus
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
                placeholder="continue typing..."
              />
            </>
          )}
        </div>
        
        {/* Floating label effect */}
        <div style={labelStyle}>
          Current Phrase
        </div>
      </div>
    </>
  );
};