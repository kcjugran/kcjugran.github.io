/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ReactNode } from 'react';
import { chapters, Chapter, ContentBlock } from './data/chaptersData';

// Root-absolute paths (e.g. '/assets/images/foo.jpg') resolve against the domain root,
// which breaks once the site is served from a subpath (GitHub Pages project sites live at
// <user>.github.io/<repo>/). Prefix every such path with Vite's configured base URL so it
// resolves correctly both locally (base '/') and in production (base '/repo-name/').
function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}

// Each chapter also lives at a real, static, independently-crawlable URL
// (/chapters/<id>/ — see scripts/generate-seo.ts, which emits an actual dist/chapters/<id>/index.html
// for each one at build time). This lets AI answer engines and search cite a specific chapter
// rather than only the book as a whole. Here we just keep the visible URL in sync with the
// selected chapter for real visitors — shareable links, working back/forward, correct tab title.
function chapterIdFromPath(): string | null {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = window.location.pathname;
  const prefix = `${base}/chapters/`;
  if (!path.startsWith(prefix)) return null;
  const rest = path.slice(prefix.length);
  const id = rest.split('/')[0];
  return id && chapters.some((c) => c.id === id) ? id : null;
}

function chapterUrl(chapterId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return chapterId === 'front-matter' ? `${base}/` : `${base}/chapters/${chapterId}/`;
}
import { getChapterQuiz } from './data/quizData';
import InteractiveAssessments from './components/InteractiveAssessments';
import ChapterQuiz, { getChapterQuizResult } from './components/ChapterQuiz';
import FigureVideoButton, { type StudyResource } from './components/FigureVideoButton';
import {
  BookOpen,
  BookOpenCheck,
  ChevronRight,
  Menu,
  X,
  Search,
  ClipboardCheck,
  Download,
} from 'lucide-react';

// Each figure offers further study material — a channel video, a demonstration video, an
// in-depth article/study, or a topic search. Sources are matched in order (first hit wins)
// against the combined figure caption + section title + image src. Keyword arrays are
// ordered most-specific-first so e.g. "romanian deadlift" wins over the generic "deadlift".
//
// Special case: the 1-2-3-4 Framework chapter is Paul Chek's model, so those figures link
// out to Chek's own writing rather than a generic fitness video.

const CHANNEL_VIDEO_MATCHES: { keywords: string[]; url: string; title: string }[] = [
  { keywords: ['plank'], url: 'https://www.youtube.com/watch?v=bOolYOIvugk', title: 'How To Do The Perfect Plank' },
  { keywords: ['lunge variation', '5 unique lunge'], url: 'https://www.youtube.com/watch?v=DZGJ1Kcxjic', title: '5 Unique Lunge Variations' },
  { keywords: ['static hold'], url: 'https://www.youtube.com/watch?v=PyCdvzlQ67I', title: '5 Static Holds Before Running' },
  { keywords: ['meat protocol', 'capacity-based recovery'], url: 'https://www.youtube.com/watch?v=UQl9wmgpsHM', title: 'Understanding Injuries in Training — The Capacity-Based Recovery Method' },
  { keywords: ['low back pain', 'lower back pain'], url: 'https://www.youtube.com/watch?v=ubz-_Ga2Y7M', title: 'Why You have Low Back Pain | FIX it Now' },
  { keywords: ['knee pain'], url: 'https://www.youtube.com/watch?v=Fp3QN6VrvQQ', title: 'Working Out With Knee Pain' },
  { keywords: ['wrist pain'], url: 'https://www.youtube.com/watch?v=cy6FKOab-8g', title: 'Fix Your Wrist Pain' },
  { keywords: ['neck pain'], url: 'https://www.youtube.com/watch?v=VOh-zn7ZLpU', title: 'Neck Pain cure' },
  { keywords: ['breathe correctly', 'breathing mechanics', 'pranayama', 'box breathing', 'ladder breathing', 'nasal vs. mouth', 'nasal vs mouth'], url: 'https://www.youtube.com/watch?v=GzoC0xON0P8', title: 'This is how to Breathe Correctly' },
  { keywords: ['fat loss', 'energy balance — calories'], url: 'https://www.youtube.com/watch?v=T1QcAsya2Rg', title: 'Principles Of Fat loss (For all diets)' },
  { keywords: ['muscle gain'], url: 'https://www.youtube.com/watch?v=1fFi11Munk8', title: 'Truth About muscle Gain' },
  { keywords: ['supplement', 'multivitamin', 'creatine', 'protein powder'], url: 'https://www.youtube.com/watch?v=MIRd8BOkY9E', title: 'Should everyone take supplements? Yes!' },
  { keywords: ['pre-workout', 'preworkout', 'stimulant', 'caffeine'], url: 'https://www.youtube.com/watch?v=NG1PFExkrzY', title: 'Natural Preworkouts (No Supplements)' },
  { keywords: ['males vs. females', 'men vs women', 'male vs. female'], url: 'https://www.youtube.com/watch?v=n4eWairWSKw', title: 'Men vs Women Exercises' },
  { keywords: ['stacking', 'bracing', 'neutral spine'], url: 'https://www.youtube.com/watch?v=I9k2dcoUFJU', title: "Don't Exercise Before Learning This" },
];

// Specific real videos from other creators, found by search, for topics the channel
// doesn't cover. Most-specific phrases first so e.g. "romanian deadlift" is checked
// before the generic "deadlift" fallback.
const OTHER_CREATOR_VIDEO_MATCHES: { keywords: string[]; url: string }[] = [
  { keywords: ['zercher squat'], url: 'https://www.youtube.com/watch?v=Qq3yteWfVGE' },
  { keywords: ['zercher deadlift'], url: 'https://www.youtube.com/watch?v=T63jZSUHdRk' },
  { keywords: ['goblet squat'], url: 'https://www.youtube.com/watch?v=k_EhLGvM8TQ' },
  { keywords: ['front squat'], url: 'https://www.youtube.com/watch?v=tCS4p5lS5rk' },
  { keywords: ['back squat'], url: 'https://www.youtube.com/watch?v=CWl0apMgshk' },
  { keywords: ['butt wink'], url: 'https://www.youtube.com/watch?v=Ftbxu_9gCQw' },
  { keywords: ['cat-cow', 'cat cow'], url: 'https://www.youtube.com/watch?v=xyNwxiuERXc' },
  { keywords: ['stock-deadlift'], url: 'https://www.youtube.com/watch?v=VL5Ab0T07e4' },
  { keywords: ['romanian deadlift', 'rdl'], url: 'https://www.youtube.com/watch?v=2SHsk9AzdjA' },
  { keywords: ['farmer carr'], url: 'https://www.youtube.com/watch?v=lLAw6fUccKA' },
  { keywords: ['lifting strap'], url: 'https://www.youtube.com/watch?v=kfRqJi4gaGk' },
  { keywords: ['good morning'], url: 'https://www.youtube.com/watch?v=6ldOlMqQGtU' },
  { keywords: ['push-up', 'push up'], url: 'https://www.youtube.com/watch?v=mECzqUIDWfU' },
  { keywords: ['bench press'], url: 'https://www.youtube.com/watch?v=gRVjAtPip0Y' },
  { keywords: ['poliquin press'], url: 'https://www.youtube.com/watch?v=SYqv4_4QtFs' },
  { keywords: ['incline overhead press', 'high-incline overhead press', 'incline dumbbell press'], url: 'https://www.youtube.com/watch?v=IP4oeKh1Sd4' },
  { keywords: ['inverted row', 'australian pull-up', 'australian pull up'], url: 'https://www.youtube.com/watch?v=5Vy6mjhXg7s' },
  { keywords: ['standard pull-up'], url: 'https://www.youtube.com/watch?v=sIvJTfGxdFo' },
  { keywords: ['shallow lat row'], url: 'https://www.youtube.com/watch?v=NSnju6gDDq4' },
  { keywords: ['one-arm cable row bench', 'one-arm cable row'], url: 'https://www.youtube.com/watch?v=mBPKhWJ1s9k' },
  { keywords: ['one-arm dumbbell row', 'one arm dumbbell row'], url: 'https://www.youtube.com/watch?v=PQ1X977ag5E' },
  { keywords: ['supported two-arm row', 'chest supported row'], url: 'https://www.youtube.com/watch?v=eOdH8EQKyUA' },
  { keywords: ['upper-back focused pulldown'], url: 'https://www.youtube.com/watch?v=7JnP8dFbS14' },
  { keywords: ['lat-focused pulldown', 'lat pulldown'], url: 'https://www.youtube.com/watch?v=SALxEARiMkw' },
  { keywords: ['reverse cable deadlift'], url: 'https://www.youtube.com/watch?v=4oZ_0_bQcOg' }, // closest real demo is a low-cable pull-through; no video exists for the exact high-cable, facing-away variant
  { keywords: ['bulgarian split squat'], url: 'https://www.youtube.com/watch?v=hiLF_pF3EJM' },
  { keywords: ['split squat'], url: 'https://www.youtube.com/watch?v=Ft-NS5Ogti0' },
  { keywords: ['leg press'], url: 'https://www.youtube.com/watch?v=8ZrJ8Q9SNbY' },
  { keywords: ['nordic curl'], url: 'https://www.youtube.com/watch?v=nn743teTMTc' },
  { keywords: ['hip thrust'], url: 'https://www.youtube.com/watch?v=pF17m_CXfL0' },
  { keywords: ['reverse crunch'], url: 'https://www.youtube.com/watch?v=gAyTBB4lm3I' },
  { keywords: ['cable lateral raise', 'side raise'], url: 'https://www.youtube.com/watch?v=qitQHqNZbeM' },
  { keywords: ['cable chest press'], url: 'https://www.youtube.com/watch?v=1XHA9ikNOCI' },
  { keywords: ['spider curl'], url: 'https://www.youtube.com/watch?v=jmXXRM755MM' },
  { keywords: ['preacher curl'], url: 'https://www.youtube.com/watch?v=BPmUhDtdQfw' },
  { keywords: ['calf raise'], url: 'https://www.youtube.com/watch?v=SorIB5_zO9A' },
  { keywords: ['jefferson curl'], url: 'https://www.youtube.com/watch?v=YGlAdtSKQaU' },
  { keywords: ['knee extension'], url: 'https://www.youtube.com/watch?v=2lvdnQg04PM' },
  { keywords: ['back extension', 'hyperextension'], url: 'https://www.youtube.com/watch?v=9IHwhIgxmD0' },
  { keywords: ['prone y-raise', 'prone y raise'], url: 'https://www.youtube.com/watch?v=ZJZRgsJJj90' },
  { keywords: ['seated rear delt'], url: 'https://www.youtube.com/watch?v=XO9Y7fyvALg' },
  { keywords: ['y-raise', 'y raise', 'rear delt'], url: 'https://www.youtube.com/watch?v=V0FueWLtMTg' },
  { keywords: ['dumbbell pullover'], url: 'https://www.youtube.com/watch?v=xNLbJhrjNcQ' },
  { keywords: ['pulley pushdown'], url: 'https://www.youtube.com/watch?v=qHDrQglWgS4' },
  { keywords: ['overhead triceps extension'], url: 'https://www.youtube.com/watch?v=57fWTQID-1Y' },
  { keywords: ['dumbbell flyes', 'dumbbell flies'], url: 'https://www.youtube.com/watch?v=LzFvciCdoW0' },
  { keywords: ['tibialis raise'], url: 'https://www.youtube.com/watch?v=VzIcGAgBiaM' },
  { keywords: ['downdog to lunge', 'ankle mobility', 'hip mobility', 'mobility drill'], url: 'https://www.youtube.com/watch?v=wsOWV2VsMHM' },
  { keywords: ['progressive overload'], url: 'https://www.youtube.com/watch?v=9udG51uTuls' },
  { keywords: ['flexibility and mobility', 'active vs. passive range'], url: 'https://www.youtube.com/watch?v=W5Ms5UH2R8I' },
];

// Topics where an in-depth written study serves the reader better than a video, or where
// the best previously-linked video is no longer available. Labeled "Read the deep-dive".
const ARTICLE_MATCHES: { keywords: string[]; url: string }[] = [
  { keywords: ['doms', 'muscle soreness'], url: 'https://www.strongerbyscience.com/doms/' },
];

// Paul Chek's own material for the 1-2-3-4 Framework chapter, keyed by section topic.
const CHEK_RESOURCES: { keywords: string[]; url: string }[] = [
  { keywords: ['love', 'life aim', 'purpose'], url: 'https://chekinstitute.com/blog/the-fastest-way-to-health-part-2-dr-happiness/' },
  { keywords: ['forces', 'yin and yang', 'yin', 'yang'], url: 'https://chekinstitute.com/blog/working-with-yin-to-balance-yang-for-daily-energy/' },
  { keywords: ['choices'], url: 'https://www.paulcheksblog.com/the-fastest-way-to-health-part-1/' },
  { keywords: ['four doctors', 'doctors'], url: 'https://chekinstitute.com/paul-chek/' },
];

function findMatch(list: { keywords: string[]; url: string; title?: string }[], text: string): { url: string; title?: string } | null {
  for (const entry of list) {
    if (entry.keywords.some(k => text.includes(k))) {
      return { url: entry.url, title: entry.title };
    }
  }
  return null;
}

function getStudyResource(matchText: string, displayTerm: string, chapterId: string): StudyResource {
  const lower = matchText.toLowerCase();

  // The 1-2-3-4 Framework chapter routes entirely to Paul Chek's own writing.
  if (chapterId === 'framework-1234') {
    const chek = findMatch(CHEK_RESOURCES, lower);
    if (chek) {
      return { url: chek.url, label: 'Read Paul Chek on this', kind: 'article' };
    }
    const q = encodeURIComponent(`Paul Chek ${displayTerm.trim()}`);
    return { url: `https://www.google.com/search?q=${q}`, label: "Explore Paul Chek's work", kind: 'search' };
  }

  const channelMatch = findMatch(CHANNEL_VIDEO_MATCHES, lower);
  if (channelMatch) {
    return { url: channelMatch.url, label: 'Watch on my channel', kind: 'channel' };
  }
  const articleMatch = findMatch(ARTICLE_MATCHES, lower);
  if (articleMatch) {
    return { url: articleMatch.url, label: 'Read the deep-dive', kind: 'article' };
  }
  const otherMatch = findMatch(OTHER_CREATOR_VIDEO_MATCHES, lower);
  if (otherMatch) {
    return { url: otherMatch.url, label: 'Watch Video', kind: 'video' };
  }
  const query = encodeURIComponent(displayTerm.trim());
  return { url: `https://www.youtube.com/results?search_query=${query}+tutorial`, label: 'Find a demonstration', kind: 'search' };
}

// Lightweight inline markup for body text: **bold** for key principles/definitions,
// *italic* for secondary emphasis, and ==highlight== for standout numbers/warnings.
// Content data uses this instead of raw markdown so it renders as real bold/italic/mark
// elements rather than literal asterisks.
const INLINE_MARKUP = /\*\*(.+?)\*\*|\*(.+?)\*|==(.+?)==/g;

function formatText(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  INLINE_MARKUP.lastIndex = 0;
  while ((match = INLINE_MARKUP.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyPrefix}-${i++}`;
    if (match[1] !== undefined) {
      nodes.push(<strong key={key} className="font-bold text-[#1A1A1A]">{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      nodes.push(<mark key={key} className="bg-[#F2D98A]/60 text-[#1A1A1A] px-0.5 rounded-sm">{match[3]}</mark>);
    }
    lastIndex = INLINE_MARKUP.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

// Strips trailing parenthetical/dash commentary from a caption to get a clean search term
function toSearchTerm(caption: string): string {
  return caption.split(/[—-]/)[0].replace(/\([^)]*\)/g, '').trim();
}

// Floated figures only wrap nicely if text follows them in DOM order. Where a figure
// trails a run of paragraphs/lists with nothing after it to wrap around, move it to the
// front of that run so the surrounding text flows around the image instead of past it.
function reorderForFloat(blocks: ContentBlock[]): ContentBlock[] {
  const result = [...blocks];
  for (let i = 0; i < result.length; i++) {
    if (result[i].type !== 'figure' && result[i].type !== 'video-only') continue;
    const next = result[i + 1];
    const nextIsText = next && (next.type === 'paragraph' || next.type === 'list');
    if (nextIsText) continue;
    let start = i;
    while (start > 0 && (result[start - 1].type === 'paragraph' || result[start - 1].type === 'list')) {
      start--;
    }
    if (start < i) {
      const [fig] = result.splice(i, 1);
      result.splice(start, 0, fig);
    }
  }
  return result;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'book' | 'interactive'>('book');
  const [selectedChapterId, setSelectedChapterIdRaw] = useState<string>(() => chapterIdFromPath() || 'front-matter');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [quizOpenForChapter, setQuizOpenForChapter] = useState<string | null>(null);
  const [showDownloads, setShowDownloads] = useState<boolean>(false);

  // Wraps setSelectedChapterId to also push a real, shareable URL (/chapters/<id>/) so
  // links to a specific chapter work, browser back/forward works, and each chapter has
  // its own address to be cited by. pushToHistory is false when responding to a
  // popstate event, since the URL is already correct in that case.
  const setSelectedChapterId = (id: string, pushToHistory = true) => {
    setSelectedChapterIdRaw(id);
    if (pushToHistory && typeof window !== 'undefined') {
      const url = chapterUrl(id);
      if (window.location.pathname !== url) {
        window.history.pushState({ chapterId: id }, '', url);
      }
    }
  };

  useEffect(() => {
    const onPopState = () => {
      setSelectedChapterId(chapterIdFromPath() || 'front-matter', false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const chapter = chapters.find((c) => c.id === selectedChapterId);
    if (chapter) {
      document.title =
        chapter.id === 'front-matter'
          ? 'Personal Training Foundations — KC Jugran'
          : `${chapter.title} — Personal Training Foundations — KC Jugran`;
    }
  }, [selectedChapterId]);

  // Active Chapter resolution
  const currentChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const chapterQuizResult = getChapterQuizResult(selectedChapterId);

  // Global search implementation across all chapters, sections, exercises, and cues
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { chapterId: string; title: string; matchText: string; type: 'Chapter' | 'Section' }[] = [];

    chapters.forEach(ch => {
      // Match chapter title/summary
      if (ch.title.toLowerCase().includes(query) || ch.summary.toLowerCase().includes(query)) {
        results.push({
          chapterId: ch.id,
          title: `Ch ${ch.number}: ${ch.title}`,
          matchText: ch.summary.substring(0, 100) + '...',
          type: 'Chapter'
        });
      }

      ch.sections.forEach(sec => {
        const sectionText = sec.content
          .filter(b => b.type === 'paragraph')
          .map(b => b.text || '')
          .join(' ');
        if (sec.title.toLowerCase().includes(query) || sectionText.toLowerCase().includes(query)) {
          const firstParagraph = sec.content.find(b => b.type === 'paragraph')?.text || '';
          results.push({
            chapterId: ch.id,
            title: `Ch ${ch.number} - ${sec.title}`,
            matchText: firstParagraph.substring(0, 100) + '...',
            type: 'Section'
          });
        }
      });
    });

    return results.slice(0, 8); // limit results
  };

  const searchResults = getSearchResults();

  const handleSearchResultClick = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSearchQuery('');
    setActiveTab('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cover image from generated resources or beautiful Unsplash
  const heroBackground = withBase("/assets/images/hero_gym_coaching_1782501730722.jpg");

  return (
    <div id="app" className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans select-text antialiased">
      {/* HEADER BANNER */}
      <header id="main-header" className="bg-white border-b border-[#E5E1DA] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              id="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded hover:bg-[#F2EFE9] lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <img
                src={withBase("/assets/logo.png")}
                alt="Living Foundations logo"
                className="w-9 h-9 object-contain shrink-0"
              />
              <div>
                <span className="text-sm font-serif italic text-[#1A1A1A] tracking-tight block leading-tight">Living Foundations</span>
                <span className="text-[10px] font-bold text-[#8C8578] uppercase tracking-widest block font-mono">Press Manual</span>
              </div>
            </div>
          </div>

          {/* MAIN TABS */}
          <nav id="main-nav" className="hidden sm:flex gap-1 bg-[#F2EFE9] border border-[#E5E1DA] p-1 rounded">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                activeTab === 'book'
                  ? 'bg-white text-stone-950 border border-[#E5E1DA] shadow-xs'
                  : 'text-stone-600 hover:text-[#4A5D4E] hover:bg-[#EAE6DF]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Manual Chapters
            </button>
            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                activeTab === 'interactive'
                  ? 'bg-white text-stone-950 border border-[#E5E1DA] shadow-xs'
                  : 'text-stone-600 hover:text-[#4A5D4E] hover:bg-[#EAE6DF]'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Test Your Knowledge
            </button>
          </nav>

          {/* CROSS-SECTION LINKS + GLOBAL KEYWORD SEARCH */}
          <div className="flex items-center gap-4">
            {/* Plain anchors on purpose — these leave the SPA, not client-side routes. */}
            <nav className="hidden md:flex items-center gap-3 text-[11px] font-medium text-[#8C8578]">
              <a href="/coaching/" className="hover:text-[#4A5D4E] transition-colors whitespace-nowrap">Personal Coaching</a>
              <a href="/articles/" className="hover:text-[#4A5D4E] transition-colors whitespace-nowrap">Articles</a>
              <a href="/clarity/" className="hover:text-[#4A5D4E] transition-colors whitespace-nowrap">Clarity</a>
            </nav>
          <div className="relative w-44 sm:w-64">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manual..."
                className="w-full pl-9 pr-4 py-2 border border-[#E5E1DA] hover:border-[#8C8578] focus:border-[#4A5D4E] text-xs font-medium rounded-sm focus:outline-hidden transition-all bg-[#F9F8F6]"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8C8578]" />
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E1DA] rounded shadow-md z-50 overflow-hidden divide-y divide-[#E5E1DA]">
                <div className="p-2 bg-[#F2EFE9] text-[10px] font-bold text-[#8C8578] tracking-wider uppercase">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((res, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSearchResultClick(res.chapterId)}
                      className="w-full px-4 py-3 text-left hover:bg-[#F2EFE9] transition-colors flex flex-col gap-0.5"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-[#2C2C2C]">{res.title}</span>
                        <span className="text-[9px] font-mono uppercase bg-[#E5E1DA] text-[#5C574F] px-1.5 py-0.5 rounded">
                          {res.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 leading-normal line-clamp-1">{res.matchText}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-xs text-stone-500 text-center">
                    No matching coaching concepts found.
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* MOBILE TABS COMPONENT */}
      <div id="mobile-tabs" className="sm:hidden border-b border-[#E5E1DA] bg-white p-2 flex gap-1 justify-center sticky top-16 z-30">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
            activeTab === 'book' ? 'bg-[#F2EFE9] text-[#4A5D4E]' : 'text-stone-600'
          }`}
        >
          <BookOpen className="w-3 h-3 text-[#4A5D4E]" />
          Book
        </button>
        <button
          onClick={() => setActiveTab('interactive')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
            activeTab === 'interactive' ? 'bg-[#F2EFE9] text-[#4A5D4E]' : 'text-stone-600'
          }`}
        >
          <BookOpenCheck className="w-3 h-3 text-[#4A5D4E]" />
          Test
        </button>
      </div>

      {/* BODY GRID */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row relative">
        
        {/* SIDEBAR FOR CHAPTERS TAB */}
        {activeTab === 'book' && (
          <aside 
            id="chapters-sidebar"
            className={`fixed inset-y-0 left-0 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:sticky lg:top-16 lg:translate-x-0 transition-transform duration-200 ease-in-out z-50 w-72 bg-[#F2EFE9] border-r border-[#E5E1DA] flex flex-col shrink-0 lg:h-[calc(100vh-4rem)]`}
          >
            {/* Sidebar Title */}
            <div className="p-5 border-b border-[#E5E1DA] flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.2em] text-[#8C8578] font-bold font-mono">Table of Contents</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Full Chapter List — every chapter visible without scrolling */}
            <div className="flex-1 overflow-y-auto p-2.5">
              {chapters.map((ch, chIdx) => {
                const isSelected = selectedChapterId === ch.id;
                const isLast = chIdx === chapters.length - 1;
                return (
                  <div key={ch.id} className={isLast ? '' : 'border-b border-[#E5E1DA] mb-1.5 pb-1.5'}>
                    <button
                      onClick={() => {
                        setSelectedChapterId(ch.id);
                        setShowDownloads(false);
                        setSidebarOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      title={ch.subtitle}
                      className={`w-full py-1.5 px-2.5 rounded-sm text-left transition-colors flex items-center gap-2.5 group relative border border-transparent ${
                        isSelected
                          ? 'bg-white text-[#1A1A1A] font-semibold border-[#E5E1DA] shadow-xs'
                          : 'hover:bg-[#EAE6DF] text-stone-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-mono shrink-0 border ${
                        isSelected
                          ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white'
                          : 'bg-[#EAE6DF] border-[#E5E1DA] text-[#8C8578] opacity-70'
                      }`}>
                        {ch.number}
                      </span>
                      <span className="text-[15px] tracking-tight truncate font-sans font-medium leading-tight flex-1">
                        {ch.title}
                      </span>
                      {isSelected && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Downloads — its own section, separate from the chapter list, so the
                book file is only ever fetched if a visitor deliberately opens this. */}
            <div className="p-2.5 border-t border-[#E5E1DA]">
              <button
                onClick={() => {
                  setShowDownloads(true);
                  setSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full py-2 px-2.5 rounded-sm text-left transition-colors flex items-center gap-2.5 border ${
                  showDownloads
                    ? 'bg-white text-[#1A1A1A] font-semibold border-[#E5E1DA] shadow-xs'
                    : 'border-transparent hover:bg-[#EAE6DF] text-stone-700'
                }`}
              >
                <span className="w-5 h-5 rounded flex items-center justify-center shrink-0 border bg-[#EAE6DF] border-[#E5E1DA] text-[#8C8578]">
                  <Download className="w-3 h-3" />
                </span>
                <span className="text-[15px] tracking-tight font-sans font-medium leading-tight flex-1">
                  Downloads
                </span>
              </button>
            </div>
          </aside>
        )}

        {/* MAIN DISPLAY STAGE */}
        <main id="main-content-stage" className="flex-1 p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
          {activeTab === 'book' && showDownloads && (
            <div id="downloads-section" className="bg-white border border-[#E5E1DA] rounded-sm p-6 md:p-10 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest bg-[#F2EFE9] text-[#4A5D4E] px-2.5 py-1 rounded">
                  Downloads
                </span>
                <h2 className="text-3xl md:text-4xl font-serif italic text-[#1A1A1A] tracking-tight leading-tight mt-3">
                  Take the Full Book With You
                </h2>
                <div className="h-px w-24 bg-[#4A5D4E] my-4"></div>
                <p className="text-base text-[#5C5C5C] leading-relaxed max-w-xl">
                  Every chapter of Personal Training Foundations, formatted as a single Word document you can read offline, print, or annotate.
                </p>
              </div>
              <a
                href={withBase("/downloads/Personal_Training_Foundations.docx")}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4E] hover:bg-[#3A4A3E] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Book (.docx)
              </a>
            </div>
          )}

          {activeTab === 'book' && !showDownloads && (
            <article className="space-y-12">

              {/* IF FRONT MATTER, SHOW LUXURIOUS BOOK COVER FIRST */}
              {selectedChapterId === 'front-matter' && (
                <div id="book-cover-banner" className="bg-white border border-[#E5E1DA] rounded-sm p-6 md:p-10 shadow-xs relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                  
                  {/* Spine design strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#4A5D4E] hidden md:block"></div>
                  
                  <div className="w-full md:w-3/5 space-y-6 relative z-10 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest text-[#4A5D4E] uppercase font-mono bg-[#4A5D4E]/10 border border-[#4A5D4E]/20 px-2.5 py-0.5 rounded-sm">
                        First Edition · 2025
                      </span>
                    </div>
                    <div className="space-y-3">
                      <h1 className="text-3xl md:text-5xl font-serif italic text-[#1A1A1A] tracking-tight leading-tight">
                        Fundamental Guide to Training the Gen Pop
                      </h1>
                      <div className="h-px w-24 bg-[#4A5D4E] my-3"></div>
                      <h2 className="text-base md:text-lg font-light text-[#4A4A4A] leading-relaxed">
                        Personal Training Foundations — A Practical Manual for Coaches, Trainers & Fitness Enthusiasts
                      </h2>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-[#8C8578] pt-4 border-t border-[#E5E1DA]">
                      <div>
                        <span className="block font-bold text-stone-900 uppercase">Author</span>
                        KC Jugran
                      </div>
                      <div className="w-px h-6 bg-[#E5E1DA]"></div>
                      <div>
                        <span className="block font-bold text-stone-900 uppercase">Focus</span>
                        Holistic Lifestyle Coaching
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-2/5 shrink-0 rounded-sm overflow-hidden aspect-video md:aspect-[3/4] border border-[#E5E1DA] relative">
                    <img
                      src={heroBackground}
                      alt="Living Foundations Gym Cover"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent"></div>
                  </div>
                </div>
              )}

              {/* CHAPTER HEADER */}
              <header id="chapter-header" className="space-y-3 pb-6 border-b border-[#E5E1DA]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest bg-[#F2EFE9] text-[#4A5D4E] px-2.5 py-1 rounded">
                    Chapter {currentChapter.number}
                  </span>
                  <span className="text-[#8C8578]">·</span>
                  <span className="text-xs font-semibold text-[#8C8578] tracking-wider uppercase font-mono">
                    Living Foundations Press
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif italic text-[#1A1A1A] tracking-tight leading-tight">
                  {currentChapter.title}
                </h2>
                <div className="h-px w-24 bg-[#4A5D4E] my-3"></div>
                <p className="text-base font-medium text-stone-500 leading-normal max-w-2xl italic">
                  {currentChapter.subtitle}
                </p>
                <div className="p-6 bg-[#F2EFE9] border-l-4 border-[#4A5D4E] rounded-r text-base">
                  <span className="font-bold uppercase tracking-tight text-[#1A1A1A] block mb-2 font-serif italic">Chapter Summary</span>
                  <p className="text-[#5C5C5C] leading-relaxed">{currentChapter.summary}</p>
                </div>
              </header>

              {/* CHAPTER SECTIONS */}
              <div id="chapter-body" className="space-y-12">
                {currentChapter.sections.map((section, sIdx) => (
                  <section key={sIdx} className="space-y-6">
                    {section.title && (
                      section.headingLevel === 'h3' ? (
                        <h4 className="text-xl md:text-2xl font-semibold text-[#2C2C2C] font-sans tracking-tight pl-4 border-l-2 border-[#8C8578]">
                          {section.title}
                        </h4>
                      ) : (
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] font-sans tracking-tight border-l-4 border-[#4A5D4E] pl-4">
                          {section.title}
                        </h3>
                      )
                    )}

                    <div className="text-stone-800 text-lg leading-[1.8] font-sans">
                      {reorderForFloat(section.content).map((block: ContentBlock, bIdx: number) => {
                        if (block.type === 'paragraph') {
                          return (
                            <p key={bIdx} className="mb-5">
                              {block.label && (
                                <span className="font-bold text-[#1A1A1A]">{block.label} — </span>
                              )}
                              {formatText(block.text ?? '', `p-${bIdx}`)}
                            </p>
                          );
                        }
                        if (block.type === 'list') {
                          return (
                            <ul key={bIdx} className="space-y-2.5 pl-1 mb-5">
                              {block.items?.map((item, iIdx) => (
                                <li key={iIdx} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D4E] mt-2.5 shrink-0"></span>
                                  <span>{formatText(item, `l-${bIdx}-${iIdx}`)}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (block.type === 'figure') {
                          // Plain figures (e.g. the author portrait) are shown for their own
                          // sake — transparent PNG, no frame, no study-resource button.
                          if (block.plain) {
                            return (
                              <figure key={bIdx} className="w-40 mx-auto mb-4 sm:float-right sm:clear-right sm:ml-6 sm:w-[200px]">
                                <img
                                  src={withBase(block.src ?? '')}
                                  alt={block.caption || ''}
                                  className="w-full h-auto object-contain drop-shadow-md"
                                  loading="lazy"
                                />
                                {block.caption && (
                                  <figcaption className="mt-1 text-center text-[10px] font-mono tracking-wide text-stone-500">
                                    {block.caption}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          }
                          const searchTerm = toSearchTerm(block.caption || section.title || currentChapter.title);
                          const matchText = `${block.caption || ''} ${section.title || ''} ${block.src || ''}`;
                          const studyResource: StudyResource = getStudyResource(matchText, searchTerm, currentChapter.id);
                          return (
                            <figure key={bIdx} className={`w-full mb-4 sm:float-right sm:clear-right sm:ml-6 ${block.small ? 'sm:w-[170px]' : 'sm:w-[260px]'}`}>
                              <div className="rounded overflow-hidden border border-stone-200/80 bg-stone-100 shadow-xs">
                                <img
                                  src={withBase(block.src ?? '')}
                                  alt={block.caption || ''}
                                  className="w-full h-auto object-contain"
                                  loading="lazy"
                                />
                                {block.caption && (
                                  <figcaption className="p-2 bg-white text-center border-t border-stone-100 text-[9px] font-mono tracking-wide text-stone-500 leading-snug">
                                    {formatText(block.caption, `cap-${bIdx}`)}
                                  </figcaption>
                                )}
                              </div>
                              <FigureVideoButton resource={studyResource} />
                            </figure>
                          );
                        }
                        if (block.type === 'video-only') {
                          // For exercises with no correct stock photo available — still surface
                          // a study-resource link, just without a figure/image wrapper.
                          const searchTerm = toSearchTerm(block.text || section.title || currentChapter.title);
                          const matchText = `${block.text || ''} ${section.title || ''}`;
                          const studyResource: StudyResource = getStudyResource(matchText, searchTerm, currentChapter.id);
                          return (
                            <div key={bIdx} className="w-full sm:w-[260px] sm:float-right sm:clear-right sm:ml-6 mb-4">
                              <FigureVideoButton resource={studyResource} />
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="clear-both"></div>
                    </div>
                  </section>
                ))}
              </div>

              {/* Navigation footer within book */}
              <footer id="chapter-navigation" className="flex justify-between items-center pt-8 border-t border-[#E5E1DA] gap-3">
                {/* Previous Button */}
                {chapters.findIndex(c => c.id === selectedChapterId) > 0 ? (
                  <button
                    onClick={() => {
                      const idx = chapters.findIndex(c => c.id === selectedChapterId);
                      setSelectedChapterId(chapters[idx - 1].id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E5E1DA] hover:bg-[#EAE6DF] text-stone-700 text-xs font-semibold rounded-sm transition-colors shrink-0"
                  >
                    &larr; Previous Chapter
                  </button>
                ) : <div />}

                <div className="flex items-center gap-3">
                  {/* Practice Button */}
                  {getChapterQuiz(selectedChapterId).length > 0 && (
                    <button
                      onClick={() => setQuizOpenForChapter(selectedChapterId)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#4A5D4E]/30 bg-[#4A5D4E]/5 hover:bg-[#4A5D4E]/10 text-[#4A5D4E] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shrink-0"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      Practice
                      {chapterQuizResult && (
                        <span className="font-mono normal-case tracking-normal opacity-70">
                          ({chapterQuizResult.score}/{chapterQuizResult.total})
                        </span>
                      )}
                    </button>
                  )}

                  {/* Next Button */}
                  {chapters.findIndex(c => c.id === selectedChapterId) < chapters.length - 1 ? (
                    <button
                      onClick={() => {
                        const idx = chapters.findIndex(c => c.id === selectedChapterId);
                        setSelectedChapterId(chapters[idx + 1].id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4E] hover:bg-[#3A4A3E] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors shrink-0"
                    >
                      Next Chapter &rarr;
                    </button>
                  ) : <div />}
                </div>
              </footer>
            </article>
          )}

          {quizOpenForChapter && (
            <ChapterQuiz
              chapterId={quizOpenForChapter}
              chapterTitle={chapters.find(c => c.id === quizOpenForChapter)?.title || ''}
              onClose={() => setQuizOpenForChapter(null)}
            />
          )}

          {/* TEST YOUR KNOWLEDGE TAB */}
          {activeTab === 'interactive' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h2 className="text-2xl font-black text-stone-900 font-display tracking-tight leading-none uppercase text-amber-600 mb-2">
                  Test Your Knowledge
                </h2>
                <p className="text-xs text-stone-500 leading-normal max-w-xl">
                  Take the full 100-question exam, run hydration algorithms, grade your active recovery metrics, use the breath test timer, or practice real-world client scenarios.
                </p>
              </div>
              <InteractiveAssessments />
            </div>
          )}

        </main>
      </div>

      {/* FOOTER SYSTEM SUMMARY */}
      <footer id="app-footer" className="bg-stone-900 text-stone-400 py-6 border-t border-stone-850 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="font-extrabold text-white">Living Foundations Press</span>
            <span>·</span>
            <span>Personal Training Foundations © 2025</span>
            <span>·</span>
            <a href="/coaching/" className="underline hover:text-white">Work with KC 1:1</a>
            <span>·</span>
            <a href="/articles/" className="underline hover:text-white">Articles</a>
            <span>·</span>
            <a href="/clarity/" className="underline hover:text-white">Clarity</a>
          </div>
          <p className="text-[10px] text-stone-500 max-w-md text-left sm:text-right">
            Disclaimer: The information on this educational portal is for educational purposes only. Always consult a qualified health provider before commencing training.
          </p>
        </div>
      </footer>
    </div>
  );
}
