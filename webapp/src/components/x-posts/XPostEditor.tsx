import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "./XIcon";
import { Hash, Plus, X, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPostEditorProps {
  value: string;
  onChange: (value: string) => void;
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  suggestedHashtags?: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function XPostEditor({
  value,
  onChange,
  hashtags,
  onHashtagsChange,
  suggestedHashtags = [],
  placeholder = "Was passiert gerade?",
  disabled = false,
}: XPostEditorProps) {
  const [newHashtag, setNewHashtag] = useState("");
  const charCount = value.length;
  const charPercentage = Math.min((charCount / 280) * 100, 100);
  const isNearLimit = charCount > 250;
  const isOverLimit = charCount > 280;
  const remainingChars = 280 - charCount;

  const addHashtag = (tag: string) => {
    const cleanTag = tag.replace(/^#/, "").trim();
    if (cleanTag && !hashtags.includes(cleanTag)) {
      onHashtagsChange([...hashtags, cleanTag]);
    }
    setNewHashtag("");
  };

  const removeHashtag = (tag: string) => {
    onHashtagsChange(hashtags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newHashtag.trim()) {
      e.preventDefault();
      addHashtag(newHashtag);
    }
  };

  // Calculate character ring stroke
  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference - (charPercentage / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Editor */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[150px] resize-none border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500",
            "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
            isOverLimit && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />

        {/* Character count indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {isOverLimit ? (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {remainingChars}
            </span>
          ) : (
            <>
              {/* Circular progress */}
              <div className="relative h-6 w-6">
                <svg className="h-6 w-6 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    className="stroke-zinc-700"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-150",
                      isOverLimit
                        ? "stroke-red-500"
                        : isNearLimit
                        ? "stroke-amber-500"
                        : "stroke-blue-400"
                    )}
                  />
                </svg>
                {isNearLimit && !isOverLimit ? (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-amber-400">
                    {remainingChars}
                  </span>
                ) : null}
              </div>
              <span
                className={cn(
                  "text-xs transition-colors",
                  isOverLimit
                    ? "text-red-400"
                    : isNearLimit
                    ? "text-amber-400"
                    : "text-zinc-500"
                )}
              >
                {charCount}/280
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hashtags section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-zinc-400" />
          <span className="text-sm text-zinc-400">Hashtags</span>
        </div>

        {/* Current hashtags */}
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            >
              #{tag}
              <button
                onClick={() => removeHashtag(tag)}
                className="ml-1 rounded-full hover:bg-blue-500/30"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Add hashtag input */}
          <div className="flex items-center">
            <span className="text-zinc-500">#</span>
            <input
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value.replace(/\s/g, ""))}
              onKeyDown={handleKeyDown}
              placeholder="Hinzufugen..."
              className="w-20 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
            />
            {newHashtag ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                onClick={() => addHashtag(newHashtag)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Suggested hashtags */}
        {suggestedHashtags.length > 0 ? (
          <div className="space-y-2">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Sparkles className="h-3 w-3" />
              Vorgeschlagen
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags
                .filter((tag) => !hashtags.includes(tag))
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addHashtag(tag)}
                    className="rounded-full border border-dashed border-zinc-700 px-2 py-0.5 text-xs text-zinc-400 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                  >
                    #{tag}
                  </button>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
