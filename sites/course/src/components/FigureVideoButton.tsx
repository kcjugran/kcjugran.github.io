/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Play, Youtube, BookOpen, Search, ExternalLink, X } from 'lucide-react';

export type ResourceKind = 'channel' | 'video' | 'article' | 'search';

export interface StudyResource {
  url: string;
  label: string;
  kind: ResourceKind;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

interface FigureVideoButtonProps {
  resource: StudyResource;
}

export default function FigureVideoButton({ resource }: FigureVideoButtonProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const videoId = extractYouTubeId(resource.url);
  // Only channel/demo videos with a real YouTube id can play inline. Articles, papers,
  // and searches always open in a new tab (redirect) since they can't be embedded.
  const canEmbed = (resource.kind === 'channel' || resource.kind === 'video') && !!videoId;

  const handleClick = () => {
    if (canEmbed) {
      setShowEmbed(true);
    } else {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (showEmbed && videoId) {
    return (
      <div className="mt-2 space-y-1.5">
        <div className="aspect-video w-full rounded overflow-hidden border border-stone-200 bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={resource.label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <button
          onClick={() => setShowEmbed(false)}
          className="w-full flex items-center justify-center gap-1 py-1 text-[9px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-600"
        >
          <X className="w-3 h-3" />
          Close video
        </button>
      </div>
    );
  }

  const style =
    resource.kind === 'channel'
      ? 'bg-[#4A5D4E] text-white hover:bg-[#3A4A3E]'
      : resource.kind === 'video'
      ? 'bg-white border border-[#8C8578]/50 text-stone-700 hover:bg-[#F2EFE9]'
      : resource.kind === 'article'
      ? 'bg-[#F2EFE9] border border-[#8C6E4A]/50 text-[#6E5233] hover:bg-[#EAE4D8]'
      : 'bg-transparent border border-dashed border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400';

  const icon =
    resource.kind === 'channel' ? (
      <Youtube className="w-3.5 h-3.5 shrink-0" />
    ) : resource.kind === 'video' ? (
      <Play className="w-3 h-3 shrink-0 fill-current" />
    ) : resource.kind === 'article' ? (
      <BookOpen className="w-3.5 h-3.5 shrink-0" />
    ) : (
      <Search className="w-3.5 h-3.5 shrink-0" />
    );

  return (
    <button
      onClick={handleClick}
      className={`mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-xs transition-colors ${style}`}
    >
      {icon}
      {resource.label}
      {!canEmbed && <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />}
    </button>
  );
}
