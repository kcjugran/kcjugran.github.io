/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  Droplets,
  ShieldAlert,
  Moon,
  Timer,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Play,
  Square,
  RotateCcw,
  Dumbbell,
  Star,
  Trash2,
  Check,
  Sparkles,
  Plus,
  BookOpen,
  History
} from 'lucide-react';
import { exercises as allExercises, Exercise } from '../data/chaptersData';
import KnowledgeTest from './KnowledgeTest';
import { ClipboardList } from 'lucide-react';

interface ExerciseLog {
  id: string;
  exerciseId: string;
  reps: number;
  weight: number;
  focusRating: number;
  stackMaintained: boolean;
  braceInitiated: boolean;
  notes: string;
  date: string;
}

export default function InteractiveAssessments() {
  const [activeSubTab, setActiveSubTab] = useState<'test' | 'exercises' | 'water' | 'sleep' | 'breath' | 'simulator'>('test');

  // --- Exercise Worksheets State ---
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'Push' | 'Pull' | 'Lower Body' | 'Core & Isolation'>('Push');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  // Practice Logger Form State
  const [practiceWeight, setPracticeWeight] = useState<number>(20);
  const [practiceReps, setPracticeReps] = useState<number>(10);
  const [practiceRating, setPracticeRating] = useState<number>(4);
  const [practiceStack, setPracticeStack] = useState<boolean>(true);
  const [practiceBrace, setPracticeBrace] = useState<boolean>(true);
  const [practiceNotes, setPracticeNotes] = useState<string>('');

  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLog[]>>(() => {
    try {
      const saved = localStorage.getItem('living_foundations_exercise_logs');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('living_foundations_exercise_logs', JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  // Exercises are imported directly from chaptersData

  const getExercisesForCategoryTab = (tab: 'Push' | 'Pull' | 'Lower Body' | 'Core & Isolation') => {
    if (tab === 'Core & Isolation') {
      return allExercises.filter(ex => ex.category === 'Core' || ex.category === 'Isolation' || ex.category === 'Holistic');
    }
    return allExercises.filter(ex => ex.category === tab);
  };

  useEffect(() => {
    const pushExercises = getExercisesForCategoryTab('Push');
    if (pushExercises.length > 0 && !selectedExerciseId) {
      setSelectedExerciseId(pushExercises[0].id);
    }
  }, [allExercises]);

  const activeExercise = allExercises.find(ex => ex.id === selectedExerciseId);

  const handleLogExercise = (exerciseId: string) => {
    const newLog: ExerciseLog = {
      id: Date.now().toString(),
      exerciseId,
      reps: practiceReps,
      weight: practiceWeight,
      focusRating: practiceRating,
      stackMaintained: practiceStack,
      braceInitiated: practiceBrace,
      notes: practiceNotes,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setExerciseLogs(prev => {
      const currentLogs = prev[exerciseId] || [];
      return {
        ...prev,
        [exerciseId]: [newLog, ...currentLogs]
      };
    });

    setPracticeNotes('');
    setPracticeStack(true);
    setPracticeBrace(true);
  };

  const handleDeleteLog = (exerciseId: string, logId: string) => {
    setExerciseLogs(prev => {
      const currentLogs = prev[exerciseId] || [];
      return {
        ...prev,
        [exerciseId]: currentLogs.filter(l => l.id !== logId)
      };
    });
  };

  // --- Water Calculator State ---
  const [weight, setWeight] = useState<number>(70);
  const [exerciseHours, setExerciseHours] = useState<number>(1);
  const [sunHours, setSunHours] = useState<number>(0);
  const [useSalt, setUseSalt] = useState<boolean>(true);

  // Hydration formula calculation
  const baseWater = 0.033 * weight;
  const exerciseWater = exerciseHours * 0.7; // 700ml per hour of exercise
  const sunWater = sunHours * 0.7; // 700ml per hour of direct sun exposure
  const totalWater = baseWater + exerciseWater + sunWater;
  const saltPinch = Math.ceil(totalWater); // 1 pinch of mineral salt per litre

  // --- Sleep Assessment State ---
  const [sleepAnswers, setSleepAnswers] = useState({
    consistentTime: false,
    troubleFalling: false,
    sleep7Hours: false,
    wakeRested: false,
    drinkAlcohol: false,
    eatNearBedtime: false,
    needNaps: false,
  });
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false);

  const handleSleepCheckbox = (key: keyof typeof sleepAnswers) => {
    setSleepAnswers(prev => ({ ...prev, [key]: !prev[key] }));
    setAssessmentSubmitted(false);
  };

  // Sleep scoring: Target is "Yes" (true) for first 4, "No" (false) for last 3
  const calculateSleepScore = () => {
    let score = 0;
    if (sleepAnswers.consistentTime) score++;
    if (!sleepAnswers.troubleFalling) score++;
    if (sleepAnswers.sleep7Hours) score++;
    if (sleepAnswers.wakeRested) score++;
    if (!sleepAnswers.drinkAlcohol) score++;
    if (!sleepAnswers.eatNearBedtime) score++;
    if (!sleepAnswers.needNaps) score++;
    return score;
  };

  // --- Breath Hold Timer State ---
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [savedTime, setSavedTime] = useState<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTimer = () => {
    if (timerRunning) {
      // Stop timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setTimerRunning(false);
      setSavedTime(timeElapsed);
    } else {
      // Start timer
      setTimeElapsed(0);
      setTimerRunning(true);
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
  };

  const handleResetTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
    setTimeElapsed(0);
    setSavedTime(null);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // --- Coaching Simulator State ---
  const scenarios = [
    {
      id: 1,
      title: "The Obese Client and Cake",
      client: "Sarah, an obese client, confesses she eats a large slice of chocolate cake every single evening. She feels extremely guilty but cannot seem to stop.",
      question: "As a foundations-oriented, supportive coach, how do you respond?",
      options: [
        {
          id: 'A',
          text: '"You must stop eating cake immediately if you want to achieve your fat loss goals. Self-discipline is key!"',
          feedback: "Incorrect. This strict guru approach causes clients to hide their behavior, build resentment, or drop coaching altogether.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: '"Let\'s compromise: Cake is delicious, and we both love it. Can we agree to keep it out of the house, and only eat it when you go out as a treat?"',
          feedback: "Correct! This represents the book's core philosophy of being client-centered, making change gentle, non-confrontational, and manageable.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: '"No worries, just do 30 extra minutes of intense cardio tomorrow to burn off the cake calories!"',
          feedback: "Incorrect. This teaches an unhealthy 'punishment-compensation' relationship with food and exercise, leading to high injury and burnout.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 2,
      title: "Selecting the Best Cue",
      client: "You are coaching James on his Squat Descent. James tends to overthink his joints, often losing his spine stack because he's focusing on his hips.",
      question: "Which coaching cue will produce the fastest skill acquisition and highest movement quality?",
      options: [
        {
          id: 'A',
          text: '"Sit your hips back and down while keeping your anterior core actively braced."',
          feedback: "Incorrect. This is an INTERNAL cue focusing on body parts. Research shows internal cues slow down motor learning.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: '"Imagine you are lowering yourself into a well on the ground that is positioned directly between your feet."',
          feedback: "Correct! This is a highly effective EXTERNAL cue. It guides the body's natural coordinates without clogging James' mind with joint angles.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: '"Consciously activate your glutes and push your quadriceps hard on the descent."',
          feedback: "Incorrect. Again, this is highly internal and forces James to focus on muscular contractions, rather than natural spatial coordination.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 3,
      title: "Group Training Setup",
      client: "You are designing a workout for a group of 15 corporate employees of widely different fitness levels. Some have high-level fitness, some are completely sedentary.",
      question: "What is your primary exercise selection parameter?",
      options: [
        {
          id: 'A',
          text: "Select Weighted Back Squats and Weighted Chin-ups for maximum strength development, giving lighter weights to beginners.",
          feedback: "Incorrect. Weighted squats require highly precise bracing instruction. A group environment cannot support individual safety on these complex lifts.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Opt for horizontal Bodyweight Rows (TRX/Australian) and Bodyweight Lunges, utilizing reps-for-time (e.g. 45 seconds).",
          feedback: "Correct! Vertical scaling is instant, upright lunges protect the lower back, and timing removes the counting barrier, letting everyone self-scale safely.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Assign the fittest people as leaders and have everyone perform high-intensity explosive plyometrics.",
          feedback: "Incorrect. High-intensity plyometrics carry high injury risks for sedentary populations, failing the rule of 'do no harm'.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 4,
      title: "The Rounded Back on Deadlift",
      client: "Marcus is deadlifting and his lower back visibly rounds every rep. He insists it 'feels fine' and wants to keep adding weight.",
      question: "What is the foundations-correct response?",
      options: [
        {
          id: 'A',
          text: "Let him continue since he says it feels fine — pain is the only real indicator of a problem.",
          feedback: "Incorrect. A rounded spine under load is a mechanical fault regardless of momentary comfort — injury risk compounds silently before pain ever shows up.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Reduce the weight and rebuild the pull from a position where he can maintain his stack, re-teaching the hinge from the top down.",
          feedback: "Correct! Stacking always takes priority over load. Drop the weight until the position holds, then progress load back up.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Have him wear a heavy lifting belt immediately so the extra support lets him keep the weight on the bar.",
          feedback: "Incorrect. A belt supports an already-strong brace — it doesn't fix a technical fault, and reaching for one this early masks the real problem.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 5,
      title: "Client Chasing Soreness",
      client: "Priya tells you she doesn't feel like the workout 'worked' unless she's sore for two days afterward, and keeps asking for harder sessions to guarantee it.",
      question: "How do you coach her out of this belief?",
      options: [
        {
          id: 'A',
          text: "Agree, and increase intensity every session until she reports soreness — give the client what she's asking for.",
          feedback: "Incorrect. Chasing soreness on purpose accelerates burnout and injury risk without any guarantee of better results.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Explain that soreness (DOMS) is not a reliable indicator of workout quality, and redirect her attention to progressive overload — the weight, reps, and technique trending upward over time.",
          feedback: "Correct! Soreness is a poor proxy for effectiveness. Chasing progressive overload, not soreness, is what actually drives results.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Tell her soreness is dangerous and she should stop training as hard as possible.",
          feedback: "Incorrect. This overcorrects — moderate soreness isn't dangerous, it's simply not a useful target. The goal is to change what she's optimizing for.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 6,
      title: "The Sleep-Deprived Executive",
      client: "David is a CEO client who arrives for his session after two hours of sleep and back-to-back red-eye flights, but insists on his usual max-effort session.",
      question: "What's the right call?",
      options: [
        {
          id: 'A',
          text: "Run the planned max-effort session anyway — he's paying for results and asked for it.",
          feedback: "Incorrect. More life stress means less potential recovery, which means a less intense session is required, not more — his nervous system cannot support today's planned load.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Cancel the session entirely and reschedule for another day.",
          feedback: "Incorrect. A full cancellation isn't necessary — a scaled-down session still has value and keeps the coaching relationship consistent.",
          isCorrect: false,
        },
        {
          id: 'C',
          text: "Read the client and swap today's plan for lighter, technique-focused work or restorative movement instead.",
          feedback: "Correct! Recovery capacity — not the training calendar — dictates today's intensity. Adjusting the plan around the person in front of you is the job.",
          isCorrect: true,
        }
      ]
    },
    {
      id: 7,
      title: "The Vegetarian Protein Question",
      client: "Anjali is vegetarian and asks how she's supposed to hit her protein targets without eating meat, fish, or eggs.",
      question: "What's the most accurate, useful answer?",
      options: [
        {
          id: 'A',
          text: '"You genuinely can\'t hit adequate protein on a vegetarian diet — you\'ll need to start eating meat."',
          feedback: "Incorrect. This is inaccurate and dismissive. Plenty of vegetarian sources exist, and supplementation closes any remaining gap.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: '"Combine dairy, legumes, and a quality protein powder to reach 1.5–2× bodyweight (kg) in grams daily — protein powder is especially valuable for vegetarians who struggle to hit the target through whole food alone."',
          feedback: "Correct! This gives her a concrete target and a realistic, evidence-based path to it — exactly the situational use case where supplementation earns its place.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: '"Don\'t worry about protein specifically, just eat intuitively and it will sort itself out."',
          feedback: "Incorrect. This is vague and unhelpful — a specific numeric target (1.5–2x bodyweight in kg) is far more actionable for a client who's asking a specific question.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 8,
      title: "The Belt Before the Brace",
      client: "Tom just bought an expensive lifting belt after watching online videos and wants to wear it for every set from day one, including warm-ups.",
      question: "How do you handle this?",
      options: [
        {
          id: 'A',
          text: "Let him wear it for everything — more support can never hurt.",
          feedback: "Incorrect. Worn this way, the belt becomes a crutch that masks a weak brace rather than a tool supporting an already-strong one.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Teach and confirm his own bracing skill first, reserving the belt for genuinely heavy working sets once the loads justify it.",
          feedback: "Correct! Belt use should follow a reliable brace and genuinely heavy loads — not replace the skill entirely from day one.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Tell him belts are always bad and should never be used.",
          feedback: "Incorrect. There's nothing wrong with a belt at the right time — for advanced lifters moving genuinely heavy loads, it's a reasonable tool.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 9,
      title: "Youth Client, Heavy Ambitions",
      client: "A 14-year-old client's parent wants him following the same heavy barbell programme as the adults in the gym, citing his enthusiasm.",
      question: "What's the appropriate programming decision?",
      options: [
        {
          id: 'A',
          text: "Follow the adult programme exactly — enthusiasm and consent from the parent are enough.",
          feedback: "Incorrect. Clients under 16 should not lift loads below 6RM since their bones are still growing — this is a hard developmental constraint, not a preference.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Refuse to train him at all until he turns 16.",
          feedback: "Incorrect. Training youth is fine and valuable — it just needs to respect load limits appropriate to his growth stage, not be refused outright.",
          isCorrect: false,
        },
        {
          id: 'C',
          text: "Keep him above 6 reps per set on all loaded work, prioritising skill development over heavy loading.",
          feedback: "Correct! This respects the safe rep range for a growing skeleton while still building real strength and movement competency.",
          isCorrect: true,
        }
      ]
    },
    {
      id: 10,
      title: "Menstrual Cycle and Training Intensity",
      client: "Elena mentions she's on day two of her period and feels noticeably weaker and less motivated than usual, but her programme calls for a heavy squat day.",
      question: "How do you respond as her coach?",
      options: [
        {
          id: 'A',
          text: "Push through the planned heavy session regardless — the programme doesn't change for how someone feels that day.",
          feedback: "Incorrect. Training principles apply equally to both sexes, but individual daily readiness always matters — ignoring how she feels here isn't good coaching.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Ask how she feels and whether she wants to train hard today, and adapt the session's load or volume accordingly.",
          feedback: "Correct! Women react differently across the menstrual cycle and require an individualised, conversation-first approach rather than a rigid script.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Tell her to skip training entirely for the week.",
          feedback: "Incorrect. A full skip isn't necessary — adapting the session's intensity is usually enough, and staying consistent (even lightly) has its own value.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 11,
      title: "The Client Who Won't Track Anything",
      client: "Ben has been 'eating pretty healthy' for six months with no progress on his fat-loss goal, but refuses to track his food, saying it's 'too much effort.'",
      question: "What's the highest-leverage suggestion?",
      options: [
        {
          id: 'A',
          text: "Insist he track every gram of food indefinitely, or you won't continue coaching him.",
          feedback: "Incorrect. Presented as an ultimatum, this will likely end the relationship rather than change behavior.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Suggest tracking meals for just 7 days to establish his actual maintenance calories and reveal exactly what 'pretty healthy' has really been giving him.",
          feedback: "Correct! A short, bounded tracking period is far more achievable than 'forever,' and gives both of you the real numbers needed to actually adjust course.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Drop the goal of fat loss since he's not willing to track.",
          feedback: "Incorrect. Abandoning the goal skips a much simpler intermediate step — a short trial period of tracking — that could resolve the whole issue.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 12,
      title: "Shoulder Instability, No Pain Yet",
      client: "A client mentions his shoulder 'clicks' and feels unstable reaching overhead to a high shelf at home, but reports zero pain during any of his normal training.",
      question: "What's the correct proactive move?",
      options: [
        {
          id: 'A',
          text: "Do nothing until it actually hurts during a session — no pain means no problem yet.",
          feedback: "Incorrect. Waiting for pain ignores a clear early warning sign that could be addressed cheaply now versus expensively later.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Immediately stop all overhead pressing work in his programme as a precaution.",
          feedback: "Incorrect. Removing overhead work entirely does nothing to build the resilience actually needed there — it just avoids the range instead of strengthening it.",
          isCorrect: false,
        },
        {
          id: 'C',
          text: "Add light, controlled prehab work with full range of motion in that overhead position several times a week, before it's ever asked to handle a heavy load.",
          feedback: "Correct! This is textbook prehabilitation — strengthening a joint proactively before instability becomes a real injury.",
          isCorrect: true,
        }
      ]
    },
    {
      id: 13,
      title: "The All-or-Nothing Evening",
      client: "It's evening. Your client had a brutal day at work and is deciding between attending their full planned session or skipping entirely to go home and eat comfort food.",
      question: "As their coach, what's the best option to offer?",
      options: [
        {
          id: 'A',
          text: "Insist they stick to the full planned session exactly as written — no exceptions.",
          feedback: "Incorrect. This treats a stressful day as irrelevant and risks the client choosing 'skip entirely' as the only alternative.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Tell them it's fine to skip — rest is always the right call after a hard day.",
          feedback: "Incorrect. This defaults to the suboptimal choice without exploring a better middle path.",
          isCorrect: false,
        },
        {
          id: 'C',
          text: "Offer a third option — a shorter, gentler session focused on breathwork and light movement instead of the full plan.",
          feedback: "Correct! Presenting a middle option converts an all-or-nothing decision into one the client can actually say yes to, rather than forcing optimal vs. suboptimal.",
          isCorrect: true,
        }
      ]
    },
    {
      id: 14,
      title: "The Late-Paying, Disrespectful Client",
      client: "A client has been consistently paying late, showing up 20 minutes into every session, and speaking dismissively to you in front of other gym members.",
      question: "What does the book's coaching-philosophy guidance say to do?",
      options: [
        {
          id: 'A',
          text: "Say nothing and hope the behavior improves on its own over time.",
          feedback: "Incorrect. Professional boundaries need to be addressed directly — ignoring the pattern usually just entrenches it.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Address it directly with a curious, non-accusatory conversation, and if behavior doesn't change after one or two conversations, release the client.",
          feedback: "Correct! This is the book's exact guidance — you are paid in money AND respect, and a direct, calm conversation (with a clear line if it doesn't change) protects that relationship.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Match their energy and become dismissive back to establish who's in charge.",
          feedback: "Incorrect. The book explicitly warns against a coach ever becoming disrespectful in return — professionalism has to run both directions.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 15,
      title: "The Client Who Hates Leg Day",
      client: "A client loves chest exercises but visibly dreads and drags through every leg day, threatening to quit if 'leg day' doesn't stop.",
      question: "What's the best way to keep them engaged and consistent?",
      options: [
        {
          id: 'A',
          text: "Tell them legs are non-negotiable and they simply need to push through the dislike.",
          feedback: "Incorrect. This ignores the actual coaching principle — making fitness something a client enjoys is usually more valuable than rigid programming purity.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Drop lower body training from their programme entirely to keep them happy.",
          feedback: "Incorrect. Removing an entire body part isn't necessary — the goal is to find versions of it the client doesn't hate, not eliminate it.",
          isCorrect: false,
        },
        {
          id: 'C',
          text: "Ask what leg exercises they might actually enjoy (bodyweight work, cycling, etc.), reduce load/volume early in the relationship, and celebrate performance milestones over appearance-based ones.",
          feedback: "Correct! Meeting the client where they are, rather than demanding what they 'should' do, is what keeps general population clients engaged long-term.",
          isCorrect: true,
        }
      ]
    },
    {
      id: 16,
      title: "The RICE Reflex",
      client: "A client tweaks their lower back and immediately asks for ice, rest, and to cancel all training for two weeks, based on old RICE-protocol advice.",
      question: "What does the book recommend instead?",
      options: [
        {
          id: 'A',
          text: "Agree with RICE fully — ice and total rest for two weeks is the safest option.",
          feedback: "Incorrect. RICE is better than nothing but has real limitations — ice impedes blood flow and pure rest doesn't rebuild resilience.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Apply the MEAT protocol — Movement and Exercise within a pain-free range, plus Analgesia and Treatment as needed, restoring function actively rather than passively waiting it out.",
          feedback: "Correct! MEAT actively restores tissue resilience instead of simply letting an injury settle through passivity.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Tell them to ignore the injury completely and train at full intensity as normal.",
          feedback: "Incorrect. This overcorrects in the other direction — MEAT still starts conservatively, within ranges that don't provoke symptoms.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 17,
      title: "Choosing the Warm-Up",
      client: "A new coach on your team is designing an elaborate 20-minute warm-up routine with a dozen different drills for a client about to squat 70kg for the first time today.",
      question: "What's the simplest, most effective warm-up advice to give them?",
      options: [
        {
          id: 'A',
          text: "The elaborate routine is good practice — more drills always means a safer warm-up.",
          feedback: "Incorrect. For most people the best warm-up is simply the exercise itself at a lower weight — an elaborate routine adds complexity without adding much value here.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Skip warming up altogether to save session time.",
          feedback: "Incorrect. Some warm-up is still needed, especially for heavier work — the fix is to simplify it, not eliminate it.",
          isCorrect: false,
        },
        {
          id: 'C',
          text: "Simplify to progressively heavier ramp-up sets of the squat itself — e.g. 40kg, then 50kg, then 60kg before the 70kg working set.",
          feedback: "Correct! For most clients, the exercise itself at a lighter load is the most effective and time-efficient warm-up available.",
          isCorrect: true,
        }
      ]
    },
    {
      id: 18,
      title: "Nasal vs. Mouth Breathing Under Fatigue",
      client: "During a hard interval sprint, your client starts gasping through their mouth and asks if that's 'wrong' since you've taught nasal breathing.",
      question: "What's the accurate answer?",
      options: [
        {
          id: 'A',
          text: '"Yes, that\'s wrong — you must breathe through your nose at all times, no exceptions."',
          feedback: "Incorrect. This is too rigid — during genuine high-intensity efforts, pure nasal breathing often isn't realistic or necessary.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: '"Nasal breathing is the preferred default, but during high intensity, a fair compromise is inhaling through the nose and exhaling through the mouth."',
          feedback: "Correct! This is exactly the book's guidance — nasal breathing is the default, with a practical compromise during genuinely hard efforts.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: '"It doesn\'t matter at all — breathing pattern has no effect on performance."',
          feedback: "Incorrect. Breathing pattern meaningfully affects oxygen efficiency and nervous system state — it's not irrelevant, just adaptable under intensity.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 19,
      title: "One Love, Two Clients",
      client: "You're comparing two clients: one wants to become a competitive athlete and questions why another client (an artist prioritizing late-night studio sessions) isn't training as strictly as they are.",
      question: "How do you explain the difference using the book's 1-2-3-4 framework?",
      options: [
        {
          id: 'A',
          text: "Tell the artist client they need to adopt the athlete's exact same discipline or they aren't serious about health.",
          feedback: "Incorrect. This ignores that 'optimal choices' are defined relative to each person's own life aim, not a universal standard.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Explain that each person's 'one love' — their core life purpose — determines what their optimal choices actually are, so two very different lifestyles can both be right for the people living them.",
          feedback: "Correct! Knowing your one love makes clear what to say yes and no to — and that answer is legitimately different for different people and goals.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Say the framework doesn't apply to non-athletes, so the comparison is meaningless.",
          feedback: "Incorrect. The framework applies to everyone — it's precisely what explains why two very different approaches can both be correct.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 20,
      title: "Free Weights, Machines, or Cables?",
      client: "A newer trainer on your team insists free weights are always superior and refuses to program any machine or cable work for their clients.",
      question: "What's the accurate perspective to share with them?",
      options: [
        {
          id: 'A',
          text: "Agree completely — free weights should replace all machine and cable work in every programme.",
          feedback: "Incorrect. This ignores real, situational advantages of machines (training to failure safely) and cables (precise angles) that free weights don't offer.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Explain that free weights, machines, and cables are simply different tools with different properties — most well-rounded programmes use all three depending on the goal and client capacity.",
          feedback: "Correct! None of the three is inherently superior — the right tool depends on the specific goal, whether that's full-body stabilisation, safe failure training, or precise angle control.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "Say only machines should be used since they're the safest option for every client.",
          feedback: "Incorrect. This overcorrects in the opposite direction and ignores the real stabiliser-training benefits free weights provide.",
          isCorrect: false,
        }
      ]
    },
    {
      id: 21,
      title: "Group Class Exercise Selection",
      client: "You're planning exercise selection for a 20-person bootcamp-style class with mixed experience levels and a tight 45-minute window.",
      question: "Which exercise-selection approach best fits the group-training context?",
      options: [
        {
          id: 'A',
          text: "Weighted back squats for everyone, with fixed rep targets like '3 sets of 10' regardless of experience.",
          feedback: "Incorrect. Weighted squats without individual bracing instruction carry significant injury risk in general population groups, and fixed rep targets don't scale to mixed ability levels.",
          isCorrect: false,
        },
        {
          id: 'B',
          text: "Lunges over weighted squats, Australian pull-ups over chin-ups (easily height-adjustable), and reps-for-time instead of fixed counts.",
          feedback: "Correct! These choices scale safely and instantly across a mixed-ability group without the coach needing to individually spot every rep.",
          isCorrect: true,
        },
        {
          id: 'C',
          text: "The most advanced Olympic lifting variations, since it keeps the class exciting and challenging.",
          feedback: "Incorrect. Complex technical lifts require close individual coaching that simply isn't available in a 20-person class — safety and quality both suffer.",
          isCorrect: false,
        }
      ]
    }
  ];

  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [simCompleted, setSimCompleted] = useState<boolean>(false);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextScenario = () => {
    const currentScenario = scenarios[currentScenarioIdx];
    const chosen = currentScenario.options.find(o => o.id === selectedOption);
    if (chosen?.isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentScenarioIdx + 1 < scenarios.length) {
      setCurrentScenarioIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setSimCompleted(true);
    }
  };

  const handleRestartSim = () => {
    setCurrentScenarioIdx(0);
    setSelectedOption(null);
    setScore(0);
    setSimCompleted(false);
  };

  return (
    <div className="bg-white rounded-sm border border-[#E5E1DA] shadow-xs overflow-hidden">
      {/* Sub-tab Header */}
      <div className="flex flex-wrap border-b border-[#E5E1DA] bg-[#F2EFE9]">
        <button
          onClick={() => setActiveSubTab('test')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeSubTab === 'test'
              ? 'border-[#4A5D4E] text-[#4A5D4E] bg-white font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-[#4A5D4E]" />
          Full Knowledge Test
        </button>
        <button
          onClick={() => setActiveSubTab('exercises')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeSubTab === 'exercises'
              ? 'border-[#4A5D4E] text-[#4A5D4E] bg-white font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Dumbbell className="w-4 h-4 text-[#4A5D4E]" />
          Exercise Worksheets
        </button>
        <button
          onClick={() => setActiveSubTab('water')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeSubTab === 'water'
              ? 'border-[#4A5D4E] text-[#4A5D4E] bg-white font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Droplets className="w-4 h-4 text-[#4A5D4E]" />
          Hydration Calculator
        </button>
        <button
          onClick={() => setActiveSubTab('sleep')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeSubTab === 'sleep'
              ? 'border-[#4A5D4E] text-[#4A5D4E] bg-white font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Moon className="w-4 h-4 text-[#4A5D4E]" />
          Sleep Quality Assessor
        </button>
        <button
          onClick={() => setActiveSubTab('breath')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeSubTab === 'breath'
              ? 'border-[#4A5D4E] text-[#4A5D4E] bg-white font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Timer className="w-4 h-4 text-[#4A5D4E]" />
          Breath Hold Test Timer
        </button>
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeSubTab === 'simulator'
              ? 'border-[#4A5D4E] text-[#4A5D4E] bg-white font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Award className="w-4 h-4 text-[#4A5D4E]" />
          Coaching Simulator
        </button>
      </div>

      <div className="p-6 md:p-8 bg-[#F9F8F6]">
        {/* --- FULL KNOWLEDGE TEST TAB --- */}
        {activeSubTab === 'test' && <KnowledgeTest />}

        {/* --- EXERCISES TAB --- */}
        {activeSubTab === 'exercises' && (
          <div className="space-y-6">
            {/* Introduction header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-4 border-b border-[#E5E1DA]">
              <div className="space-y-1">
                <h3 className="text-xl font-serif italic text-[#1A1A1A] tracking-tight">Interactive Exercise Browser</h3>
                <p className="text-xs text-[#5C5C5C] leading-relaxed max-w-xl">
                  Select any drill from the foundations curriculum to study mechanical cues, focus on the external cue, and log your live coaching or practice set.
                </p>
              </div>
              {/* Practice summary stats */}
              <div className="flex items-center gap-4 bg-[#F2EFE9] border border-[#E5E1DA] px-4 py-2.5 rounded-sm shrink-0">
                <div className="text-center border-r border-[#E5E1DA] pr-4">
                  <span className="block text-[10px] font-bold text-[#8C8578] uppercase tracking-wider font-mono">Practiced</span>
                  <span className="text-lg font-serif italic text-[#4A5D4E] font-bold">
                    {Object.keys(exerciseLogs).filter(id => (exerciseLogs[id] || []).length > 0).length} / {allExercises.length}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-[#8C8578] uppercase tracking-wider font-mono">Total Sets</span>
                  <span className="text-lg font-serif italic text-[#4A5D4E] font-bold">
                    {(Object.values(exerciseLogs) as ExerciseLog[][]).reduce((acc, logs) => acc + logs.length, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Tabbed Filter */}
            <div className="flex flex-wrap border border-[#E5E1DA] bg-[#F2EFE9] p-1 rounded-sm gap-1 w-full md:w-fit">
              {(['Push', 'Pull', 'Lower Body', 'Core & Isolation'] as const).map(cat => {
                const isActive = selectedCategoryTab === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategoryTab(cat);
                      const filtered = getExercisesForCategoryTab(cat);
                      if (filtered.length > 0) {
                        setSelectedExerciseId(filtered[0].id);
                      }
                    }}
                    className={`flex-1 md:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-stone-950 border border-[#E5E1DA] shadow-xs'
                        : 'text-stone-600 hover:text-[#4A5D4E] hover:bg-[#EAE6DF]'
                    }`}
                  >
                    {cat === 'Push' && 'Push ↗'}
                    {cat === 'Pull' && 'Pull ↙'}
                    {cat === 'Lower Body' && 'Lower Body 🦶'}
                    {cat === 'Core & Isolation' && 'Core & Iso 🎯'}
                  </button>
                );
              })}
            </div>

            {/* Exercise Selector & Worksheet Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Exercise List */}
              <div className="lg:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {getExercisesForCategoryTab(selectedCategoryTab).map(ex => {
                  const isSelected = selectedExerciseId === ex.id;
                  const logs = exerciseLogs[ex.id] || [];
                  const practiced = logs.length > 0;
                  return (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExerciseId(ex.id)}
                      className={`w-full text-left p-3 border rounded-sm transition-all flex justify-between items-center ${
                        isSelected
                          ? 'bg-white border-[#4A5D4E] ring-1 ring-[#4A5D4E]'
                          : 'bg-white border-[#E5E1DA] hover:border-[#8C8578] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-stone-900 text-xs tracking-tight">{ex.name}</h4>
                        <p className="text-[10px] text-[#5C5C5C] line-clamp-1">{ex.description}</p>
                      </div>
                      {practiced && (
                        <span className="ml-2 flex items-center gap-1 text-[9px] font-mono font-bold bg-[#4A5D4E]/10 text-[#4A5D4E] px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-[#4A5D4E]/20">
                          <Check className="w-2.5 h-2.5" />
                          {logs.length} set{logs.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Side: Worksheet & Logger */}
              <div className="lg:col-span-8">
                {activeExercise ? (
                  <div className="bg-white border border-[#E5E1DA] rounded-sm p-6 space-y-6">
                    {/* Exercise Metadata */}
                    <div className="space-y-2 border-b border-[#E5E1DA] pb-4">
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <h3 className="text-xl font-serif italic text-[#1A1A1A] font-bold">{activeExercise.name}</h3>
                        <span className="px-2 py-0.5 bg-[#4A5D4E]/10 text-[#4A5D4E] text-[10px] font-bold uppercase tracking-wider font-mono border border-[#4A5D4E]/20 rounded-sm">
                          {activeExercise.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C5C5C] italic leading-relaxed">{activeExercise.description}</p>
                    </div>

                    {/* Mechanical Cues & External Cues */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#F2EFE9]/50 border border-[#E5E1DA] rounded-sm p-4 space-y-2">
                        <h4 className="text-[10px] font-bold text-[#8C8578] uppercase tracking-widest font-mono flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#4A5D4E]" />
                          Mechanical Cues
                        </h4>
                        <ul className="list-decimal pl-4 space-y-1 text-xs text-[#2C2C2C]">
                          {activeExercise.cues.map((cue, idx) => (
                            <li key={idx} className="leading-normal">{cue}</li>
                          ))}
                        </ul>
                      </div>

                      {activeExercise.externalCue && (
                        <div className="bg-[#4A5D4E]/5 border border-[#4A5D4E]/20 rounded-sm p-4 flex flex-col justify-between">
                          <div>
                            <h4 className="text-[10px] font-bold text-[#4A5D4E] uppercase tracking-widest font-mono flex items-center gap-1 mb-2">
                              <Sparkles className="w-3.5 h-3.5 text-[#4A5D4E] animate-pulse" />
                              Essential External Cue
                            </h4>
                            <p className="text-sm font-serif italic text-stone-900 leading-relaxed font-bold">
                              "{activeExercise.externalCue}"
                            </p>
                          </div>
                          <p className="text-[10px] text-[#5C5C5C] mt-4 leading-normal">
                            *Coaching note: Research shows external focus speeds up motor learning and increases movement quality by taking focus away from body parts.*
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Interactive Worksheet Practice Logger */}
                    <div className="border-t border-[#E5E1DA] pt-6 space-y-4">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest font-mono">
                        ✍ Practice Log Worksheet
                      </h4>

                      <div className="space-y-4 bg-[#F9F8F6] p-4 border border-[#E5E1DA] rounded-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Weight Input */}
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8578] mb-1">
                              Working Load (kg):
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="0"
                                max="300"
                                value={practiceWeight}
                                onChange={(e) => setPracticeWeight(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-[#E5E1DA] p-2 text-xs rounded-sm focus:outline-none focus:border-[#4A5D4E]"
                              />
                              <button
                                type="button"
                                onClick={() => setPracticeWeight(p => Math.max(0, p - 5))}
                                className="px-2 py-1 bg-white border border-[#E5E1DA] hover:bg-stone-100 text-xs font-bold rounded-sm shrink-0"
                              >
                                -5
                              </button>
                              <button
                                type="button"
                                onClick={() => setPracticeWeight(p => p + 5)}
                                className="px-2 py-1 bg-white border border-[#E5E1DA] hover:bg-stone-100 text-xs font-bold rounded-sm shrink-0"
                              >
                                +5
                              </button>
                            </div>
                          </div>

                          {/* Reps Input */}
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8578] mb-1">
                              Reps Performed:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={practiceReps}
                                onChange={(e) => setPracticeReps(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full bg-white border border-[#E5E1DA] p-2 text-xs rounded-sm focus:outline-none focus:border-[#4A5D4E]"
                              />
                              <button
                                type="button"
                                onClick={() => setPracticeReps(r => Math.max(1, r - 1))}
                                className="px-2.5 py-1 bg-white border border-[#E5E1DA] hover:bg-stone-100 text-xs font-bold rounded-sm shrink-0"
                              >
                                -1
                              </button>
                              <button
                                type="button"
                                onClick={() => setPracticeReps(r => r + 1)}
                                className="px-2.5 py-1 bg-white border border-[#E5E1DA] hover:bg-stone-100 text-xs font-bold rounded-sm shrink-0"
                              >
                                +1
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* External Cue Focus Rating */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8578] mb-1.5">
                            External Cue Focus Quality (Coordination Fluidity):
                          </label>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((num) => {
                              const isActive = num <= practiceRating;
                              return (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setPracticeRating(num)}
                                  className="p-1 focus:outline-none transition-transform active:scale-95"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      isActive ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                            <span className="text-[10px] font-semibold text-[#5C5C5C] ml-2 self-center font-mono">
                              {practiceRating === 1 && "Weak / Joint focus"}
                              {practiceRating === 2 && "Some mechanical stiffness"}
                              {practiceRating === 3 && "Average control"}
                              {practiceRating === 4 && "Strong external focus"}
                              {practiceRating === 5 && "Flawless spatial fluidity"}
                            </span>
                          </div>
                        </div>

                        {/* Posture & Bracing checkboxes */}
                        <div className="space-y-2 pt-1 border-t border-[#E5E1DA]/60">
                          <label className="flex items-start gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={practiceStack}
                              onChange={(e) => setPracticeStack(e.target.checked)}
                              className="mt-1 accent-[#4A5D4E] rounded-sm w-3.5 h-3.5"
                            />
                            <span className="text-xs text-[#2C2C2C]">
                              <strong>Spinal Stack Check:</strong> I maintained solid vertical stack without chin flare or excessive anterior tilt.
                            </span>
                          </label>
                          <label className="flex items-start gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={practiceBrace}
                              onChange={(e) => setPracticeBrace(e.target.checked)}
                              className="mt-1 accent-[#4A5D4E] rounded-sm w-3.5 h-3.5"
                            />
                            <span className="text-xs text-[#2C2C2C]">
                              <strong>Abdominal Brace Check:</strong> Core was actively braced prior to movement descent/ascent.
                            </span>
                          </label>
                        </div>

                        {/* Notes Area */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8578] mb-1">
                            Practice Notes / Client Response Reminders:
                          </label>
                          <textarea
                            rows={2}
                            value={practiceNotes}
                            onChange={(e) => setPracticeNotes(e.target.value)}
                            placeholder="e.g. Concentrated on pushing the floor away, hip tracking felt perfectly vertical and smooth."
                            className="w-full bg-white border border-[#E5E1DA] p-2 text-xs rounded-sm focus:outline-none focus:border-[#4A5D4E] placeholder-stone-400"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={() => handleLogExercise(activeExercise.id)}
                          className="w-full py-2.5 bg-[#4A5D4E] hover:bg-[#3A4A3E] text-white font-bold uppercase tracking-widest text-[10px] rounded-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Save Practice Log to Worksheet
                        </button>
                      </div>
                    </div>

                    {/* Log History */}
                    <div className="space-y-3 pt-4 border-t border-[#E5E1DA]">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest font-mono flex items-center gap-1">
                        <History className="w-4 h-4 text-[#4A5D4E]" />
                        Exercise Practice Log History
                      </h4>

                      {(exerciseLogs[activeExercise.id] || []).length === 0 ? (
                        <p className="text-xs text-[#8C8578] italic bg-[#F2EFE9]/40 p-4 border border-dashed border-[#E5E1DA] rounded-sm text-center">
                          No practice sets recorded yet for this drill. Fill out the form above to log your first set.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[250px] overflow-y-auto">
                          {(exerciseLogs[activeExercise.id] || []).map((log) => (
                            <div key={log.id} className="p-3 bg-white border border-[#E5E1DA] rounded-sm flex justify-between items-start gap-4 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-stone-900">{log.reps} Reps @ {log.weight} kg</span>
                                  <span className="text-[10px] text-[#8C8578] font-mono">{log.date}</span>
                                </div>
                                <div className="flex gap-1.5 items-center">
                                  <span className="text-[10px] text-[#8C8578] uppercase font-mono">Focus Rating:</span>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star key={s} className={`w-3 h-3 ${s <= log.focusRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold uppercase tracking-wider mt-1">
                                  <span className={`px-1.5 py-0.5 rounded-sm border ${log.stackMaintained ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    Stack: {log.stackMaintained ? "✓" : "✗"}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded-sm border ${log.braceInitiated ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    Brace: {log.braceInitiated ? "✓" : "✗"}
                                  </span>
                                </div>
                                {log.notes && (
                                  <p className="text-[#5C5C5C] text-[11px] italic bg-[#F9F8F6] p-2 border border-[#E5E1DA] rounded-sm mt-1 max-w-xl">
                                    "{log.notes}"
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteLog(activeExercise.id, log.id)}
                                className="p-1.5 text-stone-400 hover:text-red-700 transition-colors focus:outline-none hover:bg-red-50 rounded-sm"
                                title="Delete set"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-[#E5E1DA] rounded-sm p-8 text-center text-[#8C8578] italic">
                    Select an exercise from the list to view mechanical cues, external cues, and log your live practice set.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- WATER TAB --- */}
        {activeSubTab === 'water' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Form Controls */}
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <h3 className="text-xl font-serif italic text-[#1A1A1A] tracking-tight mb-2">Hydration Engine</h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Calculate your exact daily water intake needs as per Chapter 6 formula:
                    <code className="block mt-2 px-2.5 py-1.5 bg-[#F2EFE9] border border-[#E5E1DA] rounded-sm text-xs text-stone-800 font-mono">
                      Water (L) = (0.033 × Weight kg) + (Exercise hrs × 0.7) + (Sun hrs × 0.7)
                    </code>
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Weight Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8578] mb-1">
                      Body Weight: {weight} kg
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={weight}
                      onChange={e => setWeight(Number(e.target.value))}
                      className="w-full accent-[#4A5D4E] cursor-pointer"
                    />
                  </div>

                  {/* Exercise Hours Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8578] mb-1">
                      Exercise Duration today: {exerciseHours} hour{exerciseHours !== 1 && 's'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.5"
                      value={exerciseHours}
                      onChange={e => setExerciseHours(Number(e.target.value))}
                      className="w-full accent-[#4A5D4E] cursor-pointer"
                    />
                  </div>

                  {/* Sun Exposure Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8578] mb-1">
                      Direct Sun Exposure: {sunHours} hour{sunHours !== 1 && 's'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.5"
                      value={sunHours}
                      onChange={e => setSunHours(Number(e.target.value))}
                      className="w-full accent-[#4A5D4E] cursor-pointer"
                    />
                  </div>

                  {/* Mineral Salt Toggle */}
                  <label className="flex items-start gap-3 cursor-pointer select-none mt-2">
                    <input
                      type="checkbox"
                      checked={useSalt}
                      onChange={e => setUseSalt(e.target.checked)}
                      className="mt-1 accent-[#4A5D4E] rounded-sm"
                    />
                    <div className="text-sm">
                      <span className="font-bold text-stone-900 block">Include Mineral Salt Absorption</span>
                      <span className="text-xs text-[#5C5C5C]">Adds a pinch of high-quality mineral salt to support cellular absorption (strongly recommended).</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dynamic Readout */}
              <div className="w-full md:w-1/2 bg-[#F2EFE9] border border-[#E5E1DA] rounded-sm p-6 flex flex-col justify-between self-stretch">
                <div>
                  <h4 className="text-xs font-bold text-[#4A5D4E] uppercase tracking-wider mb-4">Recommended Hydration</h4>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-serif italic text-[#4A5D4E] tracking-tight">{totalWater.toFixed(2)}</span>
                    <span className="text-xl font-bold text-[#8C8578] uppercase font-serif italic">Litres</span>
                  </div>
                  <p className="text-xs text-[#5C5C5C]">Calculated specifically for your current physiological variables.</p>
                </div>

                <div className="mt-8 space-y-4 border-t border-[#E5E1DA] pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#2C2C2C]">
                      <span className="font-bold block text-stone-900">Cellular Osmolarity</span>
                      Base rate requires <strong>{baseWater.toFixed(2)}L</strong> just for static physiological homeostasis.
                    </div>
                  </div>

                  {exerciseHours > 0 && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#2C2C2C]">
                        <span className="font-bold block text-stone-900">Sweat Rate Compensation</span>
                        Exercise adds an extra <strong>{exerciseWater.toFixed(1)}L</strong> of demand to maintain stroke volume.
                      </div>
                    </div>
                  )}

                  {sunHours > 0 && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#2C2C2C]">
                        <span className="font-bold block text-stone-900">Radiant Heat Recovery</span>
                        Sun exposure increases active vapor loss, requiring an additional <strong>{sunWater.toFixed(2)}L</strong>.
                      </div>
                    </div>
                  )}

                  {useSalt && (
                    <div className="flex items-start gap-3 bg-white rounded-sm p-3 border border-[#E5E1DA]">
                      <ShieldAlert className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#2C2C2C]">
                        <span className="font-bold block text-[#4A5D4E]">Cellular Hydration Rule</span>
                        Add <strong>{saltPinch} pinches</strong> of pink Himalayan or sea salt (approx. 1 pinch per litre) to prevent hyponatremia and ensure rapid absorption.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SLEEP TAB --- */}
        {activeSubTab === 'sleep' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-serif italic text-[#1A1A1A] tracking-tight mb-2">Sleep Quality Assessment</h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Sleep is the primary lever of <strong>Dr. Quiet</strong>, facilitating systemic recovery and tissue remodeling. Answer these baseline questions to evaluate your current sleep hygiene.
              </p>
            </div>

            <div className="space-y-3 bg-[#F2EFE9] p-6 rounded-sm border border-[#E5E1DA]">
              {/* Question 1 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.consistentTime}
                  onChange={() => handleSleepCheckbox('consistentTime')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you maintain a consistent sleep and wake time daily?</span>
                  <span className="text-xs text-[#8C8578]">Target: Yes. Trains the circadian rhythm and cortisol curve.</span>
                </div>
              </label>

              {/* Question 2 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.troubleFalling}
                  onChange={() => handleSleepCheckbox('troubleFalling')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you typically have trouble falling asleep (taking &gt;20 mins)?</span>
                  <span className="text-xs text-[#8C8578]">Target: No. Indicates an overactive sympathetic nervous system.</span>
                </div>
              </label>

              {/* Question 3 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.sleep7Hours}
                  onChange={() => handleSleepCheckbox('sleep7Hours')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you regularly get at least 7 hours of sleep per night?</span>
                  <span className="text-xs text-[#8C8578]">Target: Yes. Required for complete muscle protein synthesis and neural restoration.</span>
                </div>
              </label>

              {/* Question 4 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.wakeRested}
                  onChange={() => handleSleepCheckbox('wakeRested')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you wake up feeling completely rested and energised without alarms?</span>
                  <span className="text-xs text-[#8C8578]">Target: Yes. Indicates deep slow-wave sleep and REM cycles are complete.</span>
                </div>
              </label>

              {/* Question 5 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.drinkAlcohol}
                  onChange={() => handleSleepCheckbox('drinkAlcohol')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you regularly consume alcohol before going to bed?</span>
                  <span className="text-xs text-[#8C8578]">Target: No. Alcohol blocks REM sleep and raises sleeping heart rate.</span>
                </div>
              </label>

              {/* Question 6 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.eatNearBedtime}
                  onChange={() => handleSleepCheckbox('eatNearBedtime')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you regularly eat large meals within 2 hours of bedtime?</span>
                  <span className="text-xs text-[#8C8578]">Target: No. Late digestion keeps core temperature high and ruins sleep efficiency.</span>
                </div>
              </label>

              {/* Question 7 */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-sm border border-[#E5E1DA] hover:border-[#4A5D4E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sleepAnswers.needNaps}
                  onChange={() => handleSleepCheckbox('needNaps')}
                  className="mt-1 accent-[#4A5D4E] rounded-sm"
                />
                <div className="text-sm">
                  <span className="font-bold text-stone-900 block">Do you need regular daytime naps to catch up on sleep?</span>
                  <span className="text-xs text-[#8C8578]">Target: No. Indicates a substantial chronic sleep debt.</span>
                </div>
              </label>
            </div>

            <button
              onClick={() => setAssessmentSubmitted(true)}
              className="w-full py-3 bg-[#4A5D4E] text-white font-bold uppercase tracking-wider rounded-sm hover:bg-[#3A4A3E] transition-colors shadow-xs"
            >
              Analyze Sleep Quality
            </button>

            {assessmentSubmitted && (
              <div className="p-6 bg-[#F2EFE9] border border-[#E5E1DA] rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-3">
                  <span className="font-serif italic font-bold text-stone-900">Circadian Alignment Score:</span>
                  <span className="px-3 py-1 bg-[#4A5D4E]/15 text-[#4A5D4E] text-xs font-bold border border-[#4A5D4E]/25 rounded-sm">
                    {calculateSleepScore()} / 7 Points
                  </span>
                </div>

                <div className="text-sm leading-relaxed text-[#2C2C2C] space-y-2">
                  {calculateSleepScore() === 7 ? (
                    <p className="text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Perfect Circadian Health! Your Dr. Quiet profile is exceptionally strong.
                    </p>
                  ) : calculateSleepScore() >= 5 ? (
                    <p className="text-amber-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#4A5D4E]" /> Good Sleep Hygiene. Minor tweaks will further supercharge your active recovery.
                    </p>
                  ) : (
                    <p className="text-red-800 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" /> Circadian Disruption Detected. Focus on consistency before introducing more Yang training.
                    </p>
                  )}

                  <h5 className="font-bold text-stone-900 pt-2 font-serif italic">Tailored Recommendations:</h5>
                  <ul className="list-none space-y-2 text-xs text-[#5C5C5C]">
                    {!sleepAnswers.consistentTime && <li className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>Set a strict wake-up alarm even on weekends to lock in your melatonin rhythm.</span></li>}
                    {sleepAnswers.troubleFalling && <li className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>Limit blue light (screens) and complete all workouts 3 hours prior to sleep to lower your pulse.</span></li>}
                    {!sleepAnswers.sleep7Hours && <li className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>Gradually pull your bedtime back by 15 minutes each week until you consistently average 7.5 hours.</span></li>}
                    {sleepAnswers.drinkAlcohol && <li className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>Move any alcoholic beverages to lunchtime or at least 4 hours before sleeping so the liver cleanses prior to sleep.</span></li>}
                    {sleepAnswers.eatNearBedtime && <li className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>Establish a hard "no-eating" window starting 3 hours before you sleep to allow deep thermal drop.</span></li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- BREATH TAB --- */}
        {activeSubTab === 'breath' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-serif italic text-[#1A1A1A] tracking-tight mb-2">Breath Hold CO₂ Tolerance Test</h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Measuring how long a person can hold their breath after a normal, effortless exhale evaluates <strong>respiratory mechanics</strong> and nervous system state. <strong>Target: &ge;30 seconds.</strong>
              </p>
            </div>

            <div className="bg-[#F2EFE9] border border-[#E5E1DA] rounded-sm p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-40 h-40 rounded-full border-4 border-[#E5E1DA] bg-white flex items-center justify-center relative shadow-xs">
                <span className={`absolute inset-2 rounded-full border-2 border-dashed border-[#4A5D4E]/30 ${timerRunning ? 'animate-spin' : ''}`}></span>
                <span className="text-4xl font-mono text-[#1A1A1A] select-none">
                  {timeElapsed}s
                </span>
              </div>

              {/* Instructions */}
              <div className="max-w-md text-xs text-[#5C5C5C] bg-white p-4 rounded-sm border border-[#E5E1DA] text-left">
                <h4 className="font-bold text-stone-900 mb-1 font-serif italic">Execution Protocol:</h4>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Take a normal, calm breath in through your nose.</li>
                  <li>Perform a natural, unforced exhale, then pinch your nostrils closed.</li>
                  <li>Click <strong>Start Test</strong> with empty lungs and hold still.</li>
                  <li>Stop the timer the exact moment you feel the first involuntary contraction or urge to breathe.</li>
                </ol>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <button
                  onClick={handleStartTimer}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-xs transition-colors shadow-xs ${
                    timerRunning
                      ? 'bg-red-700 hover:bg-red-800 text-white'
                      : 'bg-[#4A5D4E] hover:bg-[#3A4A3E] text-white'
                  }`}
                >
                  {timerRunning ? (
                    <>
                      <Square className="w-4 h-4 fill-white" />
                      Inhale / Stop Test
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      Start Hold
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-stone-100 border border-[#E5E1DA] text-stone-800 rounded-sm font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {savedTime !== null && (
              <div className="p-6 bg-[#F2EFE9] border border-[#E5E1DA] rounded-sm">
                <h4 className="font-bold text-stone-900 mb-2 font-serif italic">Test Score Diagnostic:</h4>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-serif italic text-[#4A5D4E]">{savedTime}s</span>
                  <div className="text-sm">
                    {savedTime >= 30 ? (
                      <span className="text-emerald-800 font-bold block">Target Achieved (&gt;=30s)</span>
                    ) : (
                      <span className="text-amber-900 font-bold block">Underdeveloped CO₂ Tolerance (&lt;30s)</span>
                    )}
                    <p className="text-xs text-[#5C5C5C]">
                      {savedTime >= 30
                        ? "Excellent. Your blood chemistry maintains healthy carbon dioxide resilience, indicating stable parasympathetic state."
                        : "Indicates over-breathing, elevated baseline stress, or mouth breathing posture. Work on Nasal Breathing exclusively."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-white border border-[#E5E1DA] p-4 rounded-sm text-xs text-[#5C5C5C]">
                  <span className="font-bold text-[#4A5D4E] block mb-1">How to Improve:</span>
                  Incorporate <strong>Box Breathing</strong> (4s inhale, 4s hold, 4s exhale, 4s hold) for 5 minutes daily before sleep to expand CO₂ threshold and calm your nervous system.
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- SIMULATOR TAB --- */}
        {activeSubTab === 'simulator' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {!simCompleted ? (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-center border-b border-[#E5E1DA] pb-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#4A5D4E]">
                    Scenario {scenarios[currentScenarioIdx].id} of {scenarios.length}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white border border-[#E5E1DA] text-stone-700 rounded-sm">
                    Score: {score}
                  </span>
                </div>

                {/* Question Info */}
                <div className="space-y-3">
                  <h4 className="text-lg font-serif italic text-[#1A1A1A] tracking-tight">
                    {scenarios[currentScenarioIdx].title}
                  </h4>
                  <div className="bg-[#F2EFE9] border border-[#E5E1DA] p-4 rounded-sm text-xs leading-relaxed text-stone-800">
                    <strong className="text-stone-900 font-serif italic">Client Description:</strong> {scenarios[currentScenarioIdx].client}
                  </div>
                  <p className="text-sm font-semibold text-stone-900">
                    {scenarios[currentScenarioIdx].question}
                  </p>
                </div>

                {/* Multiple choice */}
                <div className="space-y-2">
                  {scenarios[currentScenarioIdx].options.map(option => {
                    const isSelected = selectedOption === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full p-4 rounded-sm border text-left transition-all text-xs flex items-start gap-3 ${
                          isSelected
                            ? 'border-[#4A5D4E] bg-white text-stone-950 ring-1 ring-[#4A5D4E]'
                            : 'border-[#E5E1DA] bg-white hover:border-[#8C8578] hover:bg-[#F2EFE9] text-stone-800'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 border ${
                          isSelected ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white' : 'bg-[#F2EFE9] border-[#E5E1DA] text-stone-600'
                        }`}>
                          {option.id}
                        </span>
                        <span>{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <button
                    disabled={!selectedOption}
                    onClick={handleNextScenario}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A5D4E] hover:bg-[#3A4A3E] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors"
                  >
                    Next Scenario
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-[#F2EFE9] border border-[#E5E1DA] rounded-full flex items-center justify-center mx-auto text-[#4A5D4E]">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic text-stone-950">Simulator Complete!</h3>
                  <p className="text-sm text-[#5C5C5C]">
                    You scored <strong className="text-[#4A5D4E]">{score} out of {scenarios.length}</strong> correct on your foundations coaching choices.
                  </p>
                </div>

                <div className="max-w-md mx-auto text-xs text-[#5C5C5C] space-y-3 bg-white p-6 rounded-sm border border-[#E5E1DA] text-left">
                  <span className="font-bold text-stone-800 block text-sm font-serif italic">Key Coaching Takeaways:</span>
                  <p className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>**Autonomy & Expectations**: Let clients feel empowered rather than commanded.</span></p>
                  <p className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>**The External Cue Superiority**: Always anchor client focus on moving the environment, not locking up joints.</span></p>
                  <p className="flex gap-2"><span className="text-[#4A5D4E] font-bold">•</span><span>**Safety in Groups**: Choose exercises that adapt instantly, avoiding high-skill spinal loads for crowded populations.</span></p>
                </div>

                <button
                  onClick={handleRestartSim}
                  className="px-6 py-2.5 border border-[#E5E1DA] hover:bg-[#F2EFE9] text-stone-800 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  Retry Simulator
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
