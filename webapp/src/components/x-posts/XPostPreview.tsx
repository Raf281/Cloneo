import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XIcon } from "./XIcon";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";

interface XPostPreviewProps {
  text: string;
  hashtags: string[];
  userName?: string;
  userHandle?: string;
  userAvatar?: string;
  timestamp?: string;
}

export function XPostPreview({
  text,
  hashtags,
  userName = "John Doe",
  userHandle = "@johndoe",
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  timestamp = "now",
}: XPostPreviewProps) {
  // Add hashtags to text if they are not already included
  const hashtagText = hashtags
    .filter((tag) => !text.toLowerCase().includes(`#${tag.toLowerCase()}`))
    .map((tag) => `#${tag}`)
    .join(" ");

  const fullText = hashtagText ? `${text}\n\n${hashtagText}` : text;
  const charCount = fullText.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="rounded-xl border border-zinc-800 bg-black p-4">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-zinc-800 text-sm text-zinc-400">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-white">{userName}</span>
              <svg
                className="h-4 w-4 text-blue-400"
                viewBox="0 0 22 22"
                fill="currentColor"
              >
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            </div>
            <span className="text-sm text-zinc-500">{userHandle}</span>
          </div>
        </div>
        <XIcon className="h-5 w-5 text-white" />
      </div>

      {/* Tweet content */}
      <div className="mb-3">
        <p
          className={`whitespace-pre-wrap text-[15px] leading-relaxed ${
            isOverLimit ? "text-red-400" : "text-white"
          }`}
        >
          {fullText}
        </p>
      </div>

      {/* Timestamp */}
      <div className="mb-3 text-sm text-zinc-500">
        {timestamp} - <span className="text-blue-400">X Post Preview</span>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      {/* Engagement stats */}
      <div className="my-3 flex gap-6 text-sm text-zinc-500">
        <span>
          <strong className="text-white">0</strong> Reposts
        </span>
        <span>
          <strong className="text-white">0</strong> Quotes
        </span>
        <span>
          <strong className="text-white">0</strong> Likes
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      {/* Action buttons */}
      <div className="mt-3 flex justify-around text-zinc-500">
        <button className="rounded-full p-2 transition-colors hover:bg-blue-500/10 hover:text-blue-400">
          <MessageCircle className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400">
          <Repeat2 className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 transition-colors hover:bg-pink-500/10 hover:text-pink-400">
          <Heart className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 transition-colors hover:bg-blue-500/10 hover:text-blue-400">
          <Share className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
