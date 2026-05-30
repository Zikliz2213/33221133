interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = {
  'Смайлы': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  'Жесты': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖', '👏', '🙌'],
  'Сердца': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Символы': ['🔥', '✨', '💫', '⭐', '🌟', '💥', '💢', '💨', '💦', '💤', '🕳️', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉'],
};

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute bottom-16 right-4 bg-white dark:bg-tg-dark-secondary rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 w-80 max-h-96 overflow-y-auto scrollbar-thin">
        {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
          <div key={category} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">{category}</h3>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSelect(emoji);
                    onClose();
                  }}
                  className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
