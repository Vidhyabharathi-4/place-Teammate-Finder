import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function MessageInput({ onSendMessage, onTyping, disabled = false }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");

    if (onTyping) {
      onTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
          className="flex-1 max-h-36 bg-transparent resize-none border-none outline-hidden text-sm sm:text-[14.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 py-1.5 px-2.5 leading-relaxed"
        />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 transition shadow-sm shrink-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          title="Send Message"
          aria-label="Send Message"
        >
          <Send size={18} className={text.trim() ? "translate-x-0.5" : ""} />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
