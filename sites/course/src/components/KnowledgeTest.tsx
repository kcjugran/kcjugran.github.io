/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { getMasterTestQuestions, QuizQuestion } from '../data/quizData';

const STORAGE_KEY = 'living_foundations_master_test_result';
const ADVANCE_DELAY_MS = 900;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function KnowledgeTest() {
  const allQuestions = useMemo(() => getMasterTestQuestions(), []);
  const [order, setOrder] = useState<QuizQuestion[]>(() => shuffle(allQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const total = order.length;
  const currentQuestion = order[currentIndex];
  const isLastQuestion = currentIndex === total - 1;

  const score = order.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const topicBreakdown = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    order.forEach(q => {
      const entry = map.get(q.topic) || { correct: 0, total: 0 };
      entry.total += 1;
      if (answers[q.id] === q.correctIndex) entry.correct += 1;
      map.set(q.topic, entry);
    });
    return Array.from(map.entries()).map(([topic, v]) => ({ topic, ...v }));
  }, [order, answers]);

  const handleSelect = (oIdx: number) => {
    if (selectedOption !== null) return; // already answered this question
    setSelectedOption(oIdx);
    const updatedAnswers = { ...answers, [currentQuestion.id]: oIdx };
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (isLastQuestion) {
        const finalScore = order.reduce((acc, q) => acc + (updatedAnswers[q.id] === q.correctIndex ? 1 : 0), 0);
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ score: finalScore, total, percentage: Math.round((finalScore / total) * 100), completedAt: new Date().toISOString() })
          );
        } catch {
          // localStorage unavailable — non-critical
        }
        setFinished(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    }, ADVANCE_DELAY_MS);
  };

  const handleRetry = () => {
    setOrder(shuffle(allQuestions));
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setFinished(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (finished) {
    return (
      <div className="space-y-8">
        <div className="border-b border-[#E5E1DA] pb-4 space-y-2">
          <h3 className="text-xl font-serif italic text-[#1A1A1A] tracking-tight">Full Knowledge Test — 100 Questions</h3>
          <p className="text-sm text-[#5C5C5C] leading-relaxed max-w-2xl">
            Every topic in the manual, condensed into 100 multiple-choice questions, presented one at a time in random order.
          </p>
        </div>
        <div className="p-6 bg-[#F2EFE9] border-l-4 border-[#4A5D4E] rounded-r space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-[#4A5D4E]" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] block">Your Result</span>
                <span className="text-3xl font-serif italic text-[#1A1A1A]">{percentage}%</span>
                <span className="text-xs text-[#8C8578] font-mono ml-2">({score} / {total} correct)</span>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E1DA] hover:bg-white bg-white/60 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Test
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-[#E5E1DA]">
            {topicBreakdown.map(({ topic, correct, total: topicTotal }) => (
              <div key={topic} className="bg-white border border-[#E5E1DA] rounded-sm px-3 py-2">
                <span className="text-[10px] text-[#8C8578] uppercase tracking-wide block truncate">{topic}</span>
                <span className="text-sm font-bold text-stone-900">{correct}/{topicTotal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E1DA] pb-4 space-y-2">
        <h3 className="text-xl font-serif italic text-[#1A1A1A] tracking-tight">Full Knowledge Test — 100 Questions</h3>
        <p className="text-sm text-[#5C5C5C] leading-relaxed max-w-2xl">
          One question at a time, in random order. Pick an answer and the next one appears automatically.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <div className="h-2 flex-1 max-w-xs bg-[#F2EFE9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A5D4E] transition-all duration-300"
              style={{ width: `${(currentIndex / total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#8C8578]">Question {currentIndex + 1} / {total}</span>
        </div>
      </div>

      <div className="space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A5D4E] font-mono">{currentQuestion.topic}</span>
        <p className="text-base font-semibold text-stone-900">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((opt, oIdx) => {
            const isSelected = selectedOption === oIdx;
            const isCorrect = oIdx === currentQuestion.correctIndex;
            let stateClasses = 'border-[#E5E1DA] hover:border-[#8C8578] bg-white';
            if (selectedOption !== null) {
              if (isCorrect) stateClasses = 'border-emerald-400 bg-emerald-50';
              else if (isSelected && !isCorrect) stateClasses = 'border-red-300 bg-red-50';
            }
            return (
              <button
                key={oIdx}
                disabled={selectedOption !== null}
                onClick={() => handleSelect(oIdx)}
                className={`w-full text-left px-4 py-3 border rounded-sm text-sm text-stone-800 transition-colors flex items-center gap-2.5 ${stateClasses}`}
              >
                {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
