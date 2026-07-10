/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { getChapterQuiz } from '../data/quizData';

interface ChapterQuizProps {
  chapterId: string;
  chapterTitle: string;
  onClose: () => void;
}

export function getChapterQuizResult(chapterId: string): { score: number; total: number } | null {
  try {
    const raw = localStorage.getItem(`chapter_quiz_${chapterId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ChapterQuiz({ chapterId, chapterTitle, onClose }: ChapterQuizProps) {
  const questions = getChapterQuiz(chapterId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every(q => answers[q.id] !== undefined);
  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0);

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      localStorage.setItem(
        `chapter_quiz_${chapterId}`,
        JSON.stringify({ score, total: questions.length, completedAt: new Date().toISOString() })
      );
    } catch {
      // localStorage unavailable — non-critical
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (questions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/50 flex items-start justify-center overflow-y-auto p-4 sm:p-8" onClick={onClose}>
      <div
        className="bg-white rounded-sm shadow-2xl w-full max-w-2xl my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#E5E1DA] p-5 flex items-center justify-between z-10 rounded-t-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A5D4E] font-mono block mb-0.5">Practice Quiz</span>
            <h3 className="text-lg font-serif italic text-[#1A1A1A]">{chapterTitle}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 rounded hover:bg-[#F2EFE9]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {!submitted && (
            <p className="text-sm text-stone-500">
              {questions.length} questions based on this chapter. Not required to move on — just a quick check on how well the material has landed.
            </p>
          )}

          {submitted && (
            <div className="p-5 bg-[#F2EFE9] border-l-4 border-[#4A5D4E] rounded-r flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] block mb-1">Your Score</span>
                <span className="text-2xl font-serif italic text-[#1A1A1A]">{score} / {questions.length}</span>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#E5E1DA] hover:bg-white text-stone-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {questions.map((q, qIdx) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className="space-y-2.5">
                <p className="text-sm font-semibold text-stone-900">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selected === oIdx;
                    const isCorrect = oIdx === q.correctIndex;
                    let stateClasses = 'border-[#E5E1DA] hover:border-[#8C8578] bg-white';
                    if (submitted) {
                      if (isCorrect) stateClasses = 'border-emerald-400 bg-emerald-50';
                      else if (isSelected && !isCorrect) stateClasses = 'border-red-300 bg-red-50';
                    } else if (isSelected) {
                      stateClasses = 'border-[#4A5D4E] bg-[#F2EFE9] ring-1 ring-[#4A5D4E]';
                    }
                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                        className={`w-full text-left px-3.5 py-2.5 border rounded-sm text-xs sm:text-sm text-stone-800 transition-colors flex items-center gap-2.5 ${stateClasses}`}
                      >
                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full py-3 bg-[#4A5D4E] hover:bg-[#3A4A3E] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors"
            >
              {allAnswered ? 'Check My Answers' : `Answer all ${questions.length} questions to submit`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
