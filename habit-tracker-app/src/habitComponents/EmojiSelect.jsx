import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "../habit-creation.css"

function EmojiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const getPickerPosition = () => {
        if (!buttonRef.current) return { top: 0, left: 0 };
        const rect = buttonRef.current.getBoundingClientRect();
        return {
            top: rect.bottom + 8,
            left: rect.left,
        };
    };

  return (
    open ?(
      <div>
        <EmojiPicker
        style={{ position: "fixed", zIndex: 9999 , ...getPickerPosition() }}
          onEmojiClick={(emojiData) => {
            onChange(emojiData.emoji);
            setOpen(false);
          }}
          searchDisabled={false}
          skinTonesDisabled={false}
          lazyLoadEmojis={true}
        />
      </div>
    ):(
      <div>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            <button type="button" id="emoji-picker" onClick={() => setOpen(!open)}>
            {value || "📝"}
            </button>
            <br />
            <br />
        </div>
      </div>
    )
  );
}

export default EmojiSelect;