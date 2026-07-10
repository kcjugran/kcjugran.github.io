export interface ContentBlock {
  type: 'paragraph' | 'list' | 'figure' | 'video-only';
  text?: string;
  label?: string;
  items?: string[];
  src?: string;
  caption?: string;
  small?: boolean;
  // A plain figure is a photo shown for its own sake (e.g. the author portrait) — no
  // study-resource button and no auto-matched video.
  plain?: boolean;
}

export interface ChapterSection {
  title: string;
  headingLevel: 'h2' | 'h3';
  content: ContentBlock[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  sections: ChapterSection[];
}

export const chapters: Chapter[] = [
  {
    id: 'front-matter',
    number: '0',
    title: 'Personal Training Foundations',
    subtitle: 'A Practical Manual for Coaches, Trainers & Fitness Enthusiasts',
    summary: 'An introduction to practical coaching philosophy, stripping away unnecessary complexity to focus on fundamentals that deliver real-world results.',
    sections: [
      {
        title: 'ABOUT THE AUTHOR',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/kc-jugran.png', caption: 'KC Jugran', plain: true, small: true },
          { type: 'paragraph', text: 'KC Jugran is a CHEK Holistic Lifestyle Coach and the founder of Living Foundations, a health and performance coaching practice. With years of hands-on experience training clients across diverse backgrounds — from first-time gym-goers to competitive athletes — KC has developed a coaching philosophy that strips away unnecessary complexity and focuses on the practical fundamentals that produce real-world results.' },
          { type: 'paragraph', text: 'This book distils that philosophy into a structured, accessible format designed to be used alongside any formal certification programme or as a standalone practical coaching reference.' },
          { type: 'paragraph', text: 'Many new coaches leave a certification course able to recite the phases of the gait cycle but unable to get a nervous first-time client through their first session with confidence. This book exists to close that specific gap — **the space between knowing a fact and being able to use it in a room with a real person in front of you.**' },
        ],
      },
      {
        title: 'TABLE OF CONTENTS',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'FRONT MATTER — Preface and Frequently Asked Questions' },
          { type: 'paragraph', text: 'CHAPTER 1 — Stacking and Bracing' },
          { type: 'paragraph', text: 'CHAPTER 2 — Learning the Squat' },
          { type: 'paragraph', text: 'CHAPTER 3 — Learning the Hinge' },
          { type: 'paragraph', text: 'CHAPTER 4 — Breathing Mechanics for Lifting' },
          { type: 'paragraph', text: 'CHAPTER 5 — Exercise Technique Library' },
          { type: 'paragraph', text: 'CHAPTER 6 — Isolation Exercises' },
          { type: 'paragraph', text: 'CHAPTER 7 — Diet and Nutrition' },
          { type: 'paragraph', text: 'CHAPTER 8 — Programme Design' },
          { type: 'paragraph', text: 'CHAPTER 9 — Cardio and Conditioning' },
          { type: 'paragraph', text: 'CHAPTER 10 — The 1-2-3-4 Framework for Holistic Health' },
          { type: 'paragraph', text: 'CHAPTER 11 — Breathwork and Recovery' },
          { type: 'paragraph', text: 'CHAPTER 12 — Working with Injuries — The MEAT Protocol' },
          { type: 'paragraph', text: 'CHAPTER 13 — Client Management and Coaching Philosophy' },
          { type: 'paragraph', text: 'CHAPTER 14 — Group vs. Individual Training' },
          { type: 'paragraph', text: 'APPENDIX — Health Assessments and Recommended Resources' },
        ],
      },
      {
        title: 'PREFACE',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'A book can only teach a coach so much. What follows is deliberately short on theory and long on the specific words, positions, and drills that turn a concept you understand into a skill your client can feel in their own body.' },
        ],
      },
      {
        title: 'How to Use This Book',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Welcome to Personal Training Foundations — a practical coaching manual built on one core belief: that practical knowledge, applied with consistency and genuine care for the client, is more powerful than any sophisticated theory left unused on a bookshelf.' },
          { type: 'paragraph', text: 'This book was written for coaches who want fast, applicable answers — people who need to understand what to do and how to do it, without wading through pages of biochemistry before they can help their first client squat correctly. Every concept here is grounded in sound exercise science and has been tested in real-world coaching environments.' },
          { type: 'paragraph', text: 'You may read this book cover to cover, or use it as a reference, jumping to the chapter most relevant to your current coaching challenge. *Bolded text throughout marks the core principle of a section — the part worth remembering even if you skim the rest.*' },
        ],
      },
      {
        title: 'INTRODUCTIONS',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Hello man/woman of dedication and faith — welcome to Personal Training 101. The objective of this course, as you\'ve already guessed, is to make personal training as simple and effective as possible, while covering everything a coach needs to know in practice.' },
          { type: 'paragraph', text: 'A job of a coach is to support the person who hired you, and it is often quite demanding. To achieve this, we will be covering all the basics of what a coach needs to know:' },
          { type: 'list', items: ['What exercises to give', 'How to coach said exercises', 'How the muscles and bones work together during exercises', 'How to handle clients effectively', 'How to support their diet and lifestyle goals', 'How to help and support their goals even during stressful times'] },
          { type: 'paragraph', text: 'To achieve these objectives as quickly as possible, this course will use almost entirely practical methods. This course is unique as it can be studied concurrently with any other certification course and will make the theoretical knowledge of those courses immediately applicable.' },
          { type: 'paragraph', text: 'While an in-depth theoretical study is certainly valuable, oftentimes we learn more and remember more when we can "get our hands dirty" — dealing with the practical aspects of what we want to learn (like knowing what foods to actually eat for protein and lifting weights with good form — "the real goods", so to speak).' },
          { type: 'paragraph', text: 'So to avoid the problem of knowing theory without application, this course will go into the practical aspects of coaching first. Further study on any topic can be pursued by anyone interested, but until he or she learns what is taught here, further study may be premature.' },
          { type: 'paragraph', text: 'Also, it might be wise to approach this with a "clean slate" mindset. Introspection and questioning are always encouraged, but reserve them until after you have fully understood what is being taught.' },
          { type: 'paragraph', text: 'Consider two coaches. The first has three certifications, can explain the biomechanics of every major lift, and still watches a client round their back on a deadlift without knowing what cue to give in the moment. The second has one certification, but has drilled the stacking and bracing progression in this book with fifty clients and can fix that same rounded back in fifteen seconds with a single sentence. **This book is written to produce the second coach.**' },
        ],
      },
      {
        title: 'FAQ',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'The questions below come from real coaches who have gone through this material — answer them honestly with yourself before you start working with clients.' },
        ],
      },
      {
        title: 'Who is it for?',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['Trainers/coaches new in the field who want quick and effective methods of getting results for clients without having to go through much complicated theory.', 'Personal trainers or group trainers training regular people who are having a hard time applying what they know in real-world practical scenarios.', 'Coaches who have a firm grasp of the theory but still struggle with practical application.', 'Exercise enthusiasts who want to understand and design practical exercise programmes for themselves.'] },
        ],
      },
      {
        title: 'Who is it NOT for?',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['People who want a certificate or continuing education credits — this is purely for knowledge.', 'Coaches training high-level athletes — this course focuses on "practical" much more than periodisation or advanced programming.', 'People who are severely injured or sick.', 'People without curiosity and a solid work ethic.'] },
        ],
      },
      {
        title: 'Do I need any prior experience before beginning this?',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'No. This course is specially designed to be understandable to the complete layperson, using mostly layman\'s language. The intention is to teach the practical realities of coaching as quickly and efficiently as possible.' },
        ],
      },
      {
        title: 'Do I need to forget what I already know?',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Ideally, approach this with an open mind — a "clean slate." Introspection and questioning are encouraged, but reserve them until after you understand what is being taught. Doing so will help new ideas take root more readily.' },
          { type: 'paragraph', text: 'Some things to keep in mind:' },
          { type: 'list', items: ['There are no certifications currently associated with this course. It is purely for knowledge and practical application.', 'Ask as many questions as you can — but not to the detriment of the class. Unless it is something that directly blocks your understanding, ask at the end of the session.'] },
          { type: 'figure', src: '/assets/images/v1/img002.jpeg', caption: 'Correct neutral spine (left) vs. rounded back — not in a good neutral position (right)' },
        ],
      },
    ],
  },
  {
    id: 'stacking-bracing',
    number: '1',
    title: 'Stacking and Bracing',
    subtitle: 'The Foundation of Safe Loading',
    summary: 'Learn how to establish joint alignment and intra-abdominal pressure to protect the spine and maximize force transfer.',
    sections: [
      {
        title: 'What is Stacking?',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**Stacking refers to placing the body in a position where the ribs are parallel to the pelvis** — commonly known as a "neutral spine." This is the position that allows us to lift the heaviest weight with the least chance of injury.' },
          { type: 'paragraph', text: 'Picture a stack of wooden blocks. Stacked directly on top of one another, the tower can support a heavy weight pressed straight down on it. Tilt the blocks even slightly out of alignment and the same weight causes the tower to buckle at the weakest joint. Your spine works the same way — when the ribcage sits directly over the pelvis, load travels straight down through the vertebrae. When the ribs flare up and forward, or the pelvis tucks under, that same load creates a shearing force at whichever segment is least aligned.' },
          { type: 'paragraph', text: 'A common example: a client picks up a laundry basket by bending forward with a rounded back and straight legs. The basket weighs almost nothing, yet an awkward twist afterward causes a back spasm. *It was never the weight of the basket* — it was the unstacked spine trying to resist a shearing force it was never positioned to handle.' },
          { type: 'figure', src: '/assets/images/v1/img003.png', caption: 'The neutral spine — three reference points for the stick test', small: true },
        ],
      },
      {
        title: 'What is Bracing?',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**Bracing refers to filling the central core muscles with air and contracting them to produce a stable, pressurised cylinder of support around the spine**, using the Valsalva Manoeuvre: rather than simply inhaling and holding, the athlete forcefully expires against a closed glottis — the space between the vocal folds — creating high intra-abdominal pressure.' },
          { type: 'paragraph', text: 'An easy way to picture this: an empty soda can crushes under a small amount of hand pressure, but a sealed, pressurised can supports a surprising amount of weight without deforming. Bracing turns the torso from the empty can into the pressurised one — the trunk muscles work together to build pressure inside the abdominal cavity, and that pressure becomes a rigid support structure around the spine before any weight is even lifted.' },
          { type: 'paragraph', text: 'Clients already know how to do this — everyone braces reflexively the moment before a hard sneeze, a heavy cough, or bracing for impact in a fall. The goal in coaching is simply to make that unconscious reflex something the client can trigger on command, every single rep, before the bar ever leaves the floor.' },
          { type: 'figure', src: '/assets/images/v1/img004.jpeg', caption: 'Bracing — creating intra-abdominal pressure for spinal stability' },
        ],
      },
      {
        title: 'Teaching Stacking: The Cable Zercher Squat',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Cable Zercher Squat — to teach the stack:' },
          { type: 'figure', src: '/assets/images/v1/img005.jpeg', caption: 'Bracing while squatting — the Zercher position elicits an automatic brace' },
          { type: 'list', items: ['Using a strap or handle attached to a low cable, hold the weight in the Zercher position (forearms parallel, elbows bent at 90°, weight in the crooks of the arms).', 'Fight the pull of the cable and remain upright, letting the knees come as far forward as needed.', 'A heel plate assists those with limited ankle mobility.'] },
        ],
      },
      {
        title: 'Barbell Zercher Squat — to teach the brace',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Learning the Squat' },
        ],
      },
      {
        title: 'Cable Zercher Squat',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img006.jpeg', caption: 'Cable Zercher squat — teaches the client to maintain their stack' },
          { type: 'list', items: ['Keeping feet around shoulder-width apart, squat down and up slowly, trying your best to maintain posture.', 'Fight the pull of the cable, being upright and letting the knees come as far forward as they need to.'] },
        ],
      },
      {
        title: 'Barbell Zercher Squat',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img007.jpeg', caption: 'Barbell Zercher squat — the compressive force automatically elicits a brace' },
          { type: 'list', items: ['Go up and down slowly, trying your best to maintain the posture practised with the cable.', 'Over time you will automatically start bracing the abs hard as you try and stand up at the top of each rep. Closing the mouth and applying the Valsalva Manoeuvre is strongly encouraged.'] },
          { type: 'paragraph', text: 'If a client still cannot feel the brace after several sets, try this troubleshooting cue: have them place two fingers just below their belly button and cough once, hard. Ask them to describe what tightened under their fingers — *that sensation, held rather than released, is the brace you are teaching.* Most clients need this one physical reference point before verbal cues like "brace" or "tighten your core" mean anything concrete to them.' },
          { type: 'figure', src: '/assets/images/v1/img008.jpeg', caption: 'Correct posture in the Zercher position' },
        ],
      },
    ],
  },
  {
    id: 'learning-squat',
    number: '2',
    title: 'Learning the Squat',
    subtitle: 'Front Squat, Back Squat & Coaching Cues',
    summary: 'Master the squat pattern from goblet to barbell, including butt wink management and mobility progressions.',
    sections: [
      {
        title: 'Goblet Squat',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-goblet-squat.jpeg', caption: 'Instructions remain the same, except the weight (dumbbell or kettlebell) is held between the hands like you are holding a large cup.' },
          { type: 'paragraph', text: 'The goblet squat is usually the very first loaded squat variation given to a brand-new client, and for good reason. Holding the weight at chest height acts as a counterbalance that naturally pulls the torso into a more upright, stacked position — the same automatic-brace effect discussed with the Zercher position in Chapter 1. It also gives the coach a single, highly visible checkpoint: *if the elbows stay inside the knees at the bottom of the squat, the client is almost always in a safe range of motion.*' },
        ],
      },
      {
        title: 'A Small Tip on Posture — Managing Butt Wink',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img009.png', caption: 'The "butt wink" — excessive posterior pelvic tilt at the bottom of the squat' },
          { type: 'figure', src: '/assets/images/v1/img010.jpeg', caption: 'Correcting butt wink with a box at the right height' },
          { type: 'list', items: ['To prevent significant butt wink, adding a box at the height where it begins to happen is a good short-term solution.', 'Place small plates or a wedge under the heels to allow a more upright torso, reducing the demand on ankle and hip mobility.', 'Address ankle and hip mobility progressively in warm-ups over time.'] },
          { type: 'paragraph', text: 'The squat is one of the most fundamental and transferable movement patterns in human physiology. When taught well, it builds strength throughout the entire lower kinetic chain and carries over to virtually every sport and daily activity.' },
          { type: 'paragraph', text: 'A quick way to assess a client\'s butt wink live in a session: crouch to the side of them at eye level with their hips and watch the low back during only the bottom third of the squat. If the pelvis stays still and then suddenly rotates backward in the last few inches of the descent, ==that rotation point is the client\'s current depth limit== — squatting past it under load is where injury risk rises sharply. Rather than forcing more depth, set a box or a pad at that height and build strength and mobility there first.' },
        ],
      },
    ],
  },
  {
    id: 'learning-hinge',
    number: '3',
    title: 'Learning the Hinge',
    subtitle: 'The Most Powerful Movement Pattern',
    summary: 'The hip hinge loads the largest muscles in the body. Learn the progression from cable to barbell deadlifts.',
    sections: [
      {
        title: 'The Hinge',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img011.jpeg', caption: 'Hip hinge — pushing the hips back loads the largest muscles in the body' },
          { type: 'paragraph', text: 'The easiest way to explain the difference between a squat and a hinge to a brand-new client is with two everyday actions they already know. **Sitting down into a chair is a squat** — the knees travel forward and the torso stays relatively upright. **Picking up a heavy suitcase off the floor is a hinge** — the knees barely bend, the hips travel backward, and the torso leans forward like a see-saw pivoting at the hip joint. Almost every client has done both movements thousands of times without thinking about them; coaching the hinge is largely a matter of pointing out which everyday motion they are already doing correctly, and asking them to load it.' },
        ],
      },
      {
        title: 'Front Squat',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img022.jpeg', caption: 'Front squat — elbows high, weight on front deltoids' },
          { type: 'list', items: ['Keep the barbell on the meat of the front shoulder muscles (anterior deltoids), while keeping the elbows as high as possible.', 'Take a deep inhale and sit down "between your legs" — imagining a well on the ground between your feet.', 'Go only as low as you can without significant butt wink.', 'Come up using pursed-lips breathing as practised before.', 'You may use a heel plate to help clients who struggle with ankle mobility.'] },
        ],
      },
      {
        title: 'Back Squat',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Technique remains the same, except the bar is placed on the meat of the upper back.' },
          { type: 'figure', src: '/assets/images/v1/img023.jpeg', caption: 'Back squat — bar on the upper back, drive through the upper back on ascent' },
          { type: 'list', items: ['Note the tendency to want to lean forward more. To counter this, actively push through the upper back on the ascent.'] },
          { type: 'paragraph', text: 'What is the use of plates below the toes/heels?' },
          { type: 'paragraph', text: 'Plates beneath the toes encourage a hip hinge; plates beneath the heels encourage a more upright squat. Neither is better or worse — they are simply different tools for different clients and different goals.' },
        ],
      },
      {
        title: 'External vs. Internal Coaching Cues',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'When teaching exercises, it is always more effective to give external points of focus rather than internal ones. **Research consistently demonstrates that external cues produce faster skill acquisition and superior movement quality.**' },
          { type: 'paragraph', text: 'Compare these two cues for the exact same Romanian deadlift: "squeeze your glutes and pull your shoulder blades back" (internal — directs attention at specific muscles and joints) versus "push the wall behind you away with your hips" (external — directs attention at an outcome in the environment). Both describe the same physical event, but the external version tends to produce smoother, more automatic movement, because *it lets the nervous system organise the many small muscle actions itself* rather than asking the conscious mind to micromanage each one individually — a mental bottleneck that consistently slows down skill learning.' },
          { type: 'paragraph', text: 'The hip hinge is one of the most powerful movements available to a strength coach. **Pushing the hips back loads the largest muscles in the body** — the hamstrings, glutes, and erectors — and creates the position to express enormous levels of strength.' },
        ],
      },
      {
        title: 'How to Brace While Hinging',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img013.jpeg', caption: 'Stick test during a hinge — the stick should stay in contact with the back of the head, upper back, and sacrum throughout' },
          { type: 'paragraph', text: 'The same bracing skill from Chapter 1 has to be re-taught in the hinge, because the torso is now angled forward rather than vertical — *many clients who brace well in a squat lose the brace completely the moment they tip forward at the hips.* The three progressions below rebuild it from the easiest to the most demanding.' },
          { type: 'figure', src: '/assets/images/v1/img014.jpeg', caption: 'A loaded hip hinge — weight hanging from the hands as the hips drive back' },
        ],
      },
      {
        title: 'Reverse Cable Deadlift',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['While facing opposite to the machine, hold onto a cable bar set at a high position.', 'Hinge while maintaining a stack. After a few reps you will find the need to automatically brace.'] },
          { type: 'video-only', text: 'reverse cable deadlift' },
        ],
      },
      {
        title: 'Zercher Deadlift',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Everything is the same except the weight is in the crook of your elbows. Use the same technique as the reverse cable deadlift.' },
        ],
      },
      {
        title: 'Romanian Deadlift (RDL)',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img015.jpeg', caption: 'Romanian Deadlift — weight hanging from hands, pure hip hinge pattern' },
          { type: 'paragraph', text: 'Everything is the same except the weight is hanging from your hands. Use the same technique and maintain the stack throughout.' },
        ],
      },
    ],
  },
  {
    id: 'breathing-lifting',
    number: '4',
    title: 'Breathing Mechanics for Lifting',
    subtitle: 'Creating the Core Shield',
    summary: 'How to breathe during lifts — heavy bracing vs. breathing behind the shield for endurance work.',
    sections: [
      {
        title: 'Where Do We Breathe During Lifting?',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img016.jpeg', caption: 'Breathing into the lower ribs — the correct pattern for lifting' },
          { type: 'paragraph', text: '**For lifting, we breathe into the lower ribs.** This causes the ribcage to expand in all directions — anterior, posterior, and lateral — creating the greatest possible spinal support.' },
          { type: 'paragraph', text: 'The easiest way to learn this is to tie a band or belt to the lower ribcage somewhere and breathe into it, trying to expand it in all directions.' },
          { type: 'paragraph', text: 'Most untrained people breathe by lifting the chest and shoulders — a shallow pattern that does very little to support the spine. A small number expand only the belly forward, which helps somewhat but leaves the sides and back of the ribcage slack. *Neither pattern creates the full 360-degree pressure needed to stabilise the trunk under heavy load*, which is why the band drill is worth spending real time on before ever adding weight to a lift.' },
          { type: 'paragraph', text: 'When lifting, we need to ask: how do we breathe? There are 2 primary methods:' },
          { type: 'figure', src: '/assets/images/v1/img017.jpeg', caption: 'Bracing and breathing strategy — heavy vs. high rep' },
          { type: 'paragraph', text: 'For heavy weights — take a big inhale, hold air as you descend, exhale a little with pursed lips as you come up. Repeat. This is ideal for heavier weights as **the more pressure maintained, the safer the spine.**' },
        ],
      },
      {
        title: 'Farmer Carries — teaching breathing behind the "shield"',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img018.jpeg', caption: 'Farmer carries — learning to breathe while maintaining a brace' },
        ],
      },
      {
        title: 'Should I Use a Weightlifting Belt?',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'There is nothing wrong with using a belt, but it is not something you need to worry about until you are lifting moderately heavy loads. If you do not wear a belt in real life, why practise lifting weights you cannot lift without one? The only benefit is lifting more weight than your core can naturally support — which is only relevant for competitive powerlifters and advanced trainees.' },
          { type: 'paragraph', text: 'A common mistake: a client buys an expensive lifting belt after watching online videos, then relies on it to create the pressure their own core should be generating. Worn this way, *the belt becomes a crutch that masks a weak brace rather than a tool that supports an already-strong one.* **The correct order is always the same — teach the brace first, add the belt only once the brace is reliable and the loads have become genuinely heavy.**' },
        ],
      },
      {
        title: 'What about lifting straps?',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img019.jpeg', caption: 'Lifting straps — useful for grip-limited pulling work' },
          { type: 'paragraph', text: 'Lifting straps compensate for grip limitations in heavy pulling movements. As clients grow stronger, grip becomes the first limiter in heavy deadlifts and rows. Straps are a reasonable tool for experienced trainees on their heaviest working sets, but should not replace dedicated grip strength development.' },
          { type: 'paragraph', text: 'Here we will go over many of the most popular and effective exercises. A few things to keep in mind before we begin:' },
          { type: 'list', items: ['Function of Tendons: strong tissue that attaches muscles to bones.', 'Function of Ligaments: strong fibrous tissue that attaches bone to bone.', '==Tendons and ligaments adapt significantly more slowly than muscles.== Progress loads conservatively to protect these structures.'] },
          { type: 'paragraph', text: 'Techniques are the same as we practised previously, so instructions will be focused on the key cues. Research has consistently shown that **External Cues have ALWAYS performed better than internal ones.**' },
          { type: 'figure', src: '/assets/images/v1/img020.jpeg', caption: 'External vs. internal cues — always prefer external focus' },
        ],
      },
    ],
  },
  {
    id: 'technique-library',
    number: '5',
    title: 'Exercise Technique Library',
    subtitle: 'Push, Pull & Lower Body Essentials',
    summary: 'A comprehensive library of key exercises with coaching cues, external focus points, and technique breakdowns.',
    sections: [
      {
        title: 'Hinge Exercises',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'The exercises below all load the same hip-hinge pattern introduced in Chapter 3, but each one changes where the resistance sits — on the back, the front, or hanging from the hands — which shifts the balance demand and the muscles worked.' },
        ],
      },
      {
        title: 'Good Morning',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img021.jpeg', caption: 'Good Morning — a hinge that develops the entire posterior chain' },
          { type: 'list', items: ['Place the barbell at the "meat" of the upper back, just below the neck.', 'Brace and hinge as practised, though be more mindful of technique as the weight is heavier.', 'Look down or slightly ahead while performing.'] },
        ],
      },
      {
        title: 'Front Squat',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img022.jpeg', caption: 'Front squat — elbows high, weight on front deltoids' },
          { type: 'list', items: ['Keep the barbell on the meat of the front shoulder muscles (deltoids), while keeping the elbows as high as possible.', 'Take a deep inhale and sit down "between your legs", imagining a well on the ground between your feet.', 'Go only as low as you can without significant butt wink.', 'Come up using pursed-lips breathing as practised.'] },
        ],
      },
      {
        title: 'Back Squat',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img023.jpeg', caption: 'Back squat — bar on the upper back, drive through the upper back on ascent' },
          { type: 'list', items: ['Technique remains the same, except the bar is placed on the meat of the upper back.', 'Note the tendency to lean forward more. To counter this, actively push through the upper back on the ascent.'] },
          { type: 'paragraph', text: 'What is the use of plates below the toes/heels?' },
        ],
      },
      {
        title: 'PUSH EXERCISES',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-push-exercises.jpeg', caption: 'Exercises that usually target the chest, triceps, and shoulders.' },
        ],
      },
      {
        title: 'Push-Up',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img024.jpeg', caption: 'Push-up — body in full stack, lower chest toward the thumbs' },
          { type: 'list', items: ['Come into the push-up position with the body in stack — hands slightly wider than chest-width.', 'Bend the elbows, letting the chest come down while aiming the lower part of the chest toward an imaginary line drawn between the thumbs.', 'Gently touch the ground with the chest — ensuring nothing else contacts the floor.', 'Push back up maintaining your stack.', 'Elevate the hands to make easier, or elevate the legs to make tougher.'] },
        ],
      },
      {
        title: 'Bench Press',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img025.jpeg', caption: 'Bench press — forearms perpendicular to the floor determines grip width' },
          { type: 'list', items: ['Bring your arms down by your side until your forearms are perpendicular to the ground — this is your grip width.', 'Also notice how low you can go before you feel a "lock" in the joints. This is your maximum safe range — do not force beyond it.', 'Grab the bar with the width found appropriate and slowly start lowering it toward the chest.', 'Push the bar up to complete a rep.'] },
          { type: 'paragraph', text: 'Closer than shoulder-width starts to affect the triceps a little more, and wider grips target the chest more. However, *excessively wide grips can place excessive strain on the anterior deltoid over time.*' },
          { type: 'paragraph', text: 'A simple rule of thumb for new coaches: if a client cannot explain why they chose a particular grip width, default them to the "forearms perpendicular" measurement above rather than whatever width looks strongest on social media. It is a safe, joint-friendly starting point that can be adjusted later once the client has enough experience to feel the difference themselves.' },
        ],
      },
      {
        title: 'Poliquin Press',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-poliquin-press-v2.jpeg', caption: 'Poliquin press — neutral-grip dumbbell pressing variation' },
          { type: 'list', items: ['Placing the dumbbells on your thighs, start to lie on the bench with your shoulders gently squeezed together.', 'Keep the palms facing each other as you press the weight up overhead, ensuring a gentle shoulder blade squeeze throughout.', 'Start bringing the weight down until the dumbbells gently touch the top of the armpits — then press back up.'] },
          { type: 'paragraph', text: 'The neutral (palms-facing) grip keeps the shoulder in a more naturally stable rotational position than a standard barbell press, which is why this variation is a common substitute for clients who report shoulder pinching or impingement symptoms on flat or overhead barbell pressing.' },
        ],
      },
      {
        title: 'High-Incline Overhead Press',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-overhead-press-v2.jpeg', caption: 'High-incline overhead press — incline angle depends on shoulder flexibility' },
          { type: 'list', items: ['Set up a bench to around 60–90° of incline.', 'Kick up the dumbbells one by one to your shoulder like you are holding a bazooka.', 'Lift the dumbbells overhead, aiming your hands to go slightly backwards — most people tend to press too far forward, which reduces deltoid engagement.', 'Note: the amount of incline is determined by the flexibility of the person\'s shoulder joint. If they overarch the lower back to press overhead, reduce the incline.'] },
          { type: 'paragraph', text: 'The steeper the bench angle, the more directly the resistance loads the front and middle deltoid rather than the upper chest, making this a useful bridge between a flat bench press and a strict standing overhead press.' },
        ],
      },
      {
        title: 'Pike Push-Ups',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-pike-pushup.jpeg', caption: 'Pike position — hips high, body forming an inverted V' },
          { type: 'list', items: ['Place your hands on a step or bench, wide enough so that your elbows can come down and your collarbone touches the surface.', 'Without bending the knees too much, walk your legs forward until you reach the appropriate position — body forming a pyramid shape.', 'From here, start to bring the upper body down in a diagonal line — "like going underneath a low fence" — until the collarbone touches the step.', 'Push back up reversing the same diagonal path.', 'Elevate the step to make the exercise easier, or elevate the legs to make it harder.'] },
          { type: 'paragraph', text: 'By tilting the torso closer to vertical, this bodyweight variation shifts load away from the chest and onto the shoulders far more than a standard push-up, making it a natural stepping stone toward a handstand push-up for clients with no overhead pressing equipment.' },
        ],
      },
      {
        title: 'PULL EXERCISES',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-pull-exercises-v2.jpeg', caption: 'Exercises that usually target the back, biceps, and rear shoulders.' },
        ],
      },
      {
        title: 'Australian Pull-Ups (Inverted Row)',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-pullups-v2.jpeg', caption: '' },
          { type: 'list', items: ['Grab onto a bar, rings, or TRX at roughly navel height and lean back until the arms are straight.', 'Ensuring your body is straight and stacked, pull until your thumbs touch the inside of the armpits. Squeeze the shoulder blades strongly.', 'Slowly go back down as you straighten the arms.', 'This exercise has many variables — grips, knee bend, height of the implement — all of which change the difficulty and muscles involved.'] },
          { type: 'paragraph', text: 'This is one of the most useful exercises in a coach\'s toolkit precisely because of its scalability. A deconditioned client can perform it standing almost upright, with feet close to the anchor point, making the exercise closer to bodyweight-assisted. A stronger client can lower the body angle until it is nearly parallel to the floor, dramatically increasing the load. **This means a single piece of equipment can serve an entire group class of mixed abilities**, which is discussed further in Chapter 14.' },
        ],
      },
      {
        title: 'Dumbbell Rows',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-dumbbell-row-v2.jpeg', caption: 'Here we will cover 3 highly effective row variations.' },
          { type: 'paragraph', text: 'All three variations below share the same underlying principle — the torso is braced against a stable surface (a bench, an incline pad, or the coach\'s own leg) so the client can pull with the back muscles alone, without needing to stabilise against momentum. The difference between them is simply the angle of the pulling arm relative to the torso, which is what shifts emphasis between the lats and the upper back.' },
        ],
      },
      {
        title: 'Shallow Lat Rows',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['Holding a dumbbell in hand, place your forearm on an object at hip height or higher.', 'Assume a staggered stance with the left leg forward and right backwards. Place your forehead on your left forearm for support, letting the right arm hang.', 'From here pull the dumbbell towards the hips, trying your best not to rotate your torso. Hold for a second or two and then slowly bring down.', 'The height of the object can be adjusted according to comfort and desire — higher objects target the upper trapezius, while lower objects target the lats more.'] },
          { type: 'video-only', text: 'shallow lat row' },
        ],
      },
      {
        title: 'One-Arm Dumbbell Row',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-one-arm-row-v2.jpeg', caption: 'One-arm dumbbell row — bench-supported for stability' },
          { type: 'list', items: ['Holding the dumbbell, place your left knee and left palm on the bench for support.', 'Pull the dumbbell up until your thumb touches the inner part of the armpit, ensuring the chest faces downward.', 'Also push hard with the supporting hand so that your body remains rigid.', 'Lower down slowly and repeat.'] },
        ],
      },
      {
        title: 'Supported Two-Arm Row',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['Set up a bench to an incline of your choice. Lie prone on it, with your knees on the seat pad and your head at the top.', 'Make sure the arms can hang fully after each rep without touching the ground.', 'Pull the weights the same way, ensuring a second or two of pause at the top.', 'Like shallow rows, higher angles are more upper back and traps, while lower angles are more lat.'] },
          { type: 'video-only', text: 'supported two-arm row' },
        ],
      },
      {
        title: 'Lat-Focused Pulldown',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-lat-pulldown-v2.jpeg', caption: 'Lat-focused pulldown — underhand grip, elbows driven toward the hips' },
          { type: 'list', items: ['Making sure the pads are securely fitted on your thigh, hold the bar about shoulder-width, using an underhand grip.', 'Letting the arms gently stretch upwards, pull the elbows down, aiming towards the hips. There should be a stack of the spine.', 'Slowly let the weight pull the arms up. Repeat.'] },
          { type: 'paragraph', text: 'An overhand grip works on the forearms and back more, while an underhand grip allows fuller range and easier technique to teach.' },
        ],
      },
      {
        title: 'Upper-Back Focused Pulldown',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-upper-back-pulldown.jpeg', caption: 'Wide overhand grip, pulled toward the chest — upper-back and mid-trap focus' },
          { type: 'list', items: ['Making sure the pads are securely fitted, hold the bar slightly wider than shoulder-width, using an overhand grip.', 'Pull the bar until it touches your lower chest, actively arching the back and squeezing the shoulder blades together.', 'This should activate the mid and upper back very strongly.'] },
          { type: 'paragraph', text: 'Many clients who complain of rounded, hunched shoulders from long hours at a desk respond very well to this variation, since the strong scapular squeeze directly opposes the posture they hold all day. Two or three sets of this movement at the end of a session is a simple, low-risk way to address postural complaints without a dedicated corrective-exercise routine.' },
        ],
      },
      {
        title: 'Pull-Ups',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-pullups-standard.jpeg', caption: 'Standard pull-up — chin rising above a fixed high bar' },
          { type: 'paragraph', text: 'Technique remains identical to a lat pulldown. A great idea is to reach a lat pulldown load exceeding your bodyweight before attempting full pull-ups.' },
          { type: 'list', items: ['For lat focus, keep your legs straight and slightly in front of you to keep the core engaged. Pull until the collarbone touches the bar.', 'For upper and mid-back focus, bend your knees behind you and pull with a big thoracic arch until the lower chest touches the bar.'] },
        ],
      },
      {
        title: 'Assisted Pull-Ups',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'One of the best ways to learn pull-ups (besides using a machine) is to have a training partner assist by holding the hips or ankles, decreasing the assistance progressively as strength improves.' },
        ],
      },
      {
        title: 'LOWER BODY EXERCISES',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-lower-body-v2.jpeg', caption: '' },
        ],
      },
      {
        title: 'Split Squats',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-split-squat-start.jpeg', caption: 'Split squat — starting in half-kneeling position' },
          { type: 'list', items: ['Starting in a crawling position, put one foot forward until both knees make a 90° angle. Then stand your upper body up.', 'Putting hands on your hips, stand straight up, ensuring the heel of the back foot is raised.', 'Go straight down slowly until the back knee gently touches the ground — imagine the back knee is like a feather landing.', 'Keep weight relatively equal on both legs.'] },
          { type: 'paragraph', text: '**Training one leg at a time exposes and corrects side-to-side strength imbalances that a two-legged squat can hide entirely** — a client can be noticeably weaker on one side and still squat a barbell evenly, since the stronger leg quietly compensates. Split squats also load the spine far less than a loaded bilateral squat for the same leg effort, making them a useful option for clients who need to train hard around a back complaint.' },
        ],
      },
      {
        title: 'Bulgarian Split Squat',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-bulgarian-squat-v2.jpeg', caption: '' },
          { type: 'list', items: ['Picking a bench slightly below knee height, come into crawling position facing away from it.', 'Hook one of your feet onto the bench and come up into tall kneeling. Stand straight up, feeling if further adjustments are required.', '"Sit down and back — imagine the back knee is a hammer trying to hit a nail just below the bench."'] },
          { type: 'paragraph', text: 'Elevating the rear foot increases the stretch demand on the rear leg\'s hip flexors and deepens the working leg\'s range of motion compared to a standard split squat, which is why it is usually introduced only once a client has mastered the flat-footed version and has adequate hip mobility to keep the front knee tracking safely.' },
        ],
      },
      {
        title: 'Leg Press',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: '==Knees are bent only to the point where the tailbone begins to rise off the seat== — this is your safe range. Foot placement also matters in what muscle groups are emphasised.' },
          { type: 'figure', src: '/assets/images/v1/stock-leg-press.jpeg', caption: 'Leg press — foot placement affects which muscles are emphasised' },
        ],
      },
      {
        title: 'Difference Between Free Weights, Machines and Cables',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Neither of these is better than the other. They are simply different tools with different properties and different uses. All three can produce excellent results and should be selected based on the client\'s goal and capacity.' },
          { type: 'paragraph', text: 'In practice, most well-rounded programmes use all three across a training week: free weights for the main compound lifts where full-body stabilisation is the goal, machines when a client needs to push a muscle group close to failure without a spotter, and cables for accessory and isolation work where the ability to angle the resistance precisely matters more than raw load.' },
          { type: 'list', items: ['Free weights require the body to stabilise load moving in any direction, training smaller stabiliser muscles. Generally less irritating to joints due to freedom of movement.', 'Machines provide a fixed movement path, allowing maximum effort without risk of weights falling. Excellent for training to failure safely.', 'Cables allow resistance to be redirected to virtually any angle needed. Very effective for targeting specific body parts and positions.'] },
        ],
      },
      {
        title: 'Deadlift (Conventional)',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-deadlift.jpeg', caption: 'A combination of a squat and a Romanian Deadlift — it begins like an RDL but the weight is lowered all the way to the floor and picked back up.' },
          { type: 'list', items: ['Stand behind the bar with feet slightly wider than hip-width, shoelace knot just below the bar.', 'Bend the knees until they touch the bar. At this point freeze the hip position.', 'Without moving the hips, grab the bar and put the spine in a stack.', '"Push the Earth away" as you stand up until the bar comes close to the knees, then extend the hips like an RDL to lock out.', 'Reverse the movement — push the hips back like an RDL until the bar reaches the knees, then squat the bar back down to the floor.'] },
        ],
      },
      {
        title: 'Nordic Curls',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'nordic curl' },
          { type: 'list', items: ['Stand on your knees with your heels/ankles supported by a sturdy object.', 'How far forward you try to reach with your head is completely dependent on your strength level.', 'Pull back up to the start, imagining you are trying to lift the foot support into the air with your feet.'] },
          { type: 'paragraph', text: '==This is a demanding hamstring exercise and should be introduced with a very small range of motion== — sometimes only a few centimetres forward — before gradually increasing the range over weeks. It builds the hamstrings\' ability to control the knee while lengthened, which is directly protective against the kind of hamstring strains common in sprinting and change-of-direction sports.' },
        ],
      },
      {
        title: 'Hip Thrust',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-hip-thrust.jpeg', caption: '' },
          { type: 'list', items: ['Lie on a bench around knee-high with the bottom of your shoulder blades touching the bench.', 'Bend your knees until your feet can comfortably be placed on the ground. This is the start position.', 'From here push your hips up until your body is parallel to the ground. "Tucking the tailbone at the top fires the glutes even more strongly."'] },
          { type: 'paragraph', text: '**"Isolation" refers to exercises that target a single muscle group.** While compound movements form the foundation of any programme, isolation exercises address weak links, add targeted volume, and personalise programmes to individual client goals.' },
        ],
      },
    ],
  },
  {
    id: 'isolation-exercises',
    number: '6',
    title: 'Isolation Exercises',
    subtitle: 'Core, Shoulders, Chest, Arms & Calves',
    summary: 'Targeted single-joint movements to bring up weak links, protect joints, and address custom user goals.',
    sections: [
      {
        title: 'CORE',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-core-exercise.jpeg', caption: '' },
        ],
      },
      {
        title: 'Plank',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-ab-exercise.jpeg', caption: 'Plank — three points of contact confirm a neutral spine', small: true },
          { type: 'list', items: ['Elbows below shoulders, nose below the thumbs.', 'Keep spine stacked, ensuring three points of contact: back of head, mid-back, tailbone.', 'Knees can be straight, bent, or on the ground to adjust difficulty. The stack must be maintained regardless.'] },
          { type: 'paragraph', text: '*The plank is less about how long a client can hold the position and more about how well they hold their stack while doing it.* A client who shakes and sags after ten seconds but keeps a perfect stack is doing better work than one who grinds out two minutes with a sagging lower back — **always coach for quality of position first, and let duration follow naturally as that quality improves.**' },
        ],
      },
      {
        title: 'Reverse Crunches',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-reverse-crunch-v2.jpeg', caption: 'Reverse crunch — knees pulled toward the chest, hips curling off the floor' },
          { type: 'list', items: ['Lying on the back, hold a sturdy object behind you.', 'Bend your knees and pull them towards (but slightly over) your head. This is the start position.', 'Slowly start bringing the hips down, letting the spine come down one vertebra at a time until the tailbone touches, then immediately drive the knees back up.'] },
          { type: 'paragraph', text: 'Most standard crunches only flex the upper spine, leaving the lower abdominal region — the part clients most often ask about — comparatively undertrained. **Working the movement bottom-up, one vertebra at a time, is what specifically targets that lower segment.**' },
        ],
      },
      {
        title: 'Side Raises (Machine, Standing)',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img032.jpeg', caption: 'Side raise machine — lateral core and hip emphasis' },
          { type: 'list', items: ['Place yourself sideways on an extension machine, with the top leg below the front pad, bottom leg at the back.', 'Keeping the knees straight, start bending downwards in your sideways orientation as far as possible. Hold here for a second or two.', 'Hands kept closer to the hips to make easier; extended overhead makes harder.'] },
          { type: 'paragraph', text: 'This is one of the few common exercises that directly trains the obliques and the muscles that stabilise the ribcage against side-bending — an area most standard ab routines (crunches, planks) barely touch. Clients who play racket sports or golf, where rotational and lateral core strength matters directly to performance, benefit disproportionately from including this movement.' },
        ],
      },
      {
        title: 'Hyperextension',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-hyperextension.jpeg', caption: 'Hyperextension — hips supported, torso lifting to a straight line' },
          { type: 'list', items: ['Lie face-down on the extension machine, ensuring the hip pad is below the iliac crest to allow full range.', 'Securing the legs on the foot pad, let yourself lower down to maximum depth. Feel a relaxing stretch.', '"Pushing your butt aggressively into the pad," lift your upper body as a single unit until the body is perfectly straight. Do not hyperextend beyond this.'] },
          { type: 'paragraph', text: '**Cueing the glutes to fire first, rather than yanking the movement from the lower back, is what keeps this exercise a spinal-erector and glute builder rather than a lower-back strain risk.**' },
        ],
      },
      {
        title: 'SHOULDERS',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-shoulder-exercise-v2.jpeg', caption: 'The shoulder is a complex joint that moves many ways. Hence a number of exercises are required to train it adequately.' },
          { type: 'paragraph', text: '**Unlike the hip or knee, the shoulder is built for mobility rather than stability**, which means it relies almost entirely on surrounding muscles — not bone shape — to stay safely in its socket. This is why shoulder programming tends to need more exercise variety than most other body parts: a single pressing movement simply cannot train the many directions the shoulder blade and joint need to move and stabilise in daily life and sport.' },
        ],
      },
      {
        title: 'Compound Side Raise Triset',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-side-raise-v2.jpeg', caption: 'Single-arm lateral raise — the base movement of the compound triset' },
          { type: 'list', items: ['With a light dumbbell (2.5–5kg for most people), start by laying sideways on a bench set to 45–60°.', 'From here lift the dumbbell in an arching motion, from the front of the body to behind it, maintaining tension throughout.', 'After fatigue sets in, continue by bending, rotating, and placing the elbow on the hip at the back of each rep. This reduces difficulty, allowing more reps.', 'After fatigue sets in again, start to overhead press the weight to further extend the set.', 'These exercises can be combined or done on separate days, but work very well together.'] },
          { type: 'paragraph', text: 'Each of the three phases shortens the effective lever arm as the previous one fatigues, allowing the set to keep producing meaningful fatigue in the side delt well past the point a single strict lateral raise would have to stop.' },
        ],
      },
      {
        title: 'Prone Y-Raise on Bench',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'prone y-raise' },
          { type: 'list', items: ['Setting a bench at 60° approximately, lie on your stomach with your knees on the seat pad.', 'Holding dumbbells, lift them upwards and outwards around 50–60° to shoulder level — forming a Y shape.', 'Hold for 1–3 seconds at the top. Lower, but not all the way, before repeating.'] },
          { type: 'paragraph', text: 'The Y-shaped path recruits the lower trapezius specifically, a muscle that most standard rowing or shrugging movements barely touch but which is heavily implicated in stable, pain-free overhead shoulder movement.' },
        ],
      },
      {
        title: 'Seated Rear Delt Half-Raises',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'seated rear delt' },
          { type: 'list', items: ['Sitting on a bench, hinge your upper body down to 45° or lower. Rotate your hands so the thumbs and index fingers face downward.', 'Lifting the dumbbells outwards and upwards towards the height of your ears, but only to the halfway point.', 'Concentrate on this lower range without letting the dumbbells reach too high.'] },
          { type: 'paragraph', text: 'The rear deltoid is chronically under-trained compared to the front and side of the shoulder, largely because it cannot be seen in a mirror. Left unaddressed over years of pressing-dominant training, this imbalance contributes to the rounded-shoulder posture discussed elsewhere in this chapter. **A useful rule: for every heavy pressing exercise in a programme, include at least one rear-delt-focused pulling exercise like this one.**' },
        ],
      },
      {
        title: 'Cable Lateral Raise',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-cable-lateral-raise.jpeg', caption: 'Cable lateral raise — 60° angle suits shoulder joint mechanics' },
          { type: 'list', items: ['Standing next to a cable handle set at a height lower than the hips, hold onto something sturdy with the free hand.', 'With the working hand, pull the cable upwards and outwards, making sure the cable comes from roughly a 60° angle rather than straight to the side.'] },
          { type: 'paragraph', text: 'Because a cable keeps constant tension throughout the entire range — unlike a dumbbell, which goes slack near the bottom — this variation loads the side delt hardest exactly where a free-weight lateral raise loads it least.' },
        ],
      },
      {
        title: 'CHEST',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-chest-exercise.jpeg', caption: '' },
        ],
      },
      {
        title: 'Dumbbell Flyes',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'dumbbell flyes' },
          { type: 'list', items: ['Lying on the back, grab dumbbells and push them straight overhead.', 'Now slowly bring them out to the side until you feel a nice stretch in the shoulder and chest area. Hold for 1–3 seconds.', 'Bring dumbbells back up overhead to the starting position.'] },
          { type: 'paragraph', text: 'Because the arms move through a wide arc with the elbows only slightly bent, this exercise places considerable stretch load on the shoulder joint. ==Start with genuinely light dumbbells — far lighter than a client\'s pressing weight== — and only lower to a depth that feels like a comfortable stretch, never one that feels like the joint is being forced.' },
        ],
      },
      {
        title: 'Cable Chest Press',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'cable chest press' },
          { type: 'paragraph', text: 'Form is identical to a standard dumbbell chest press, except the cables must come from behind rather than from the sides — which would create a fly pattern rather than a pressing movement.' },
        ],
      },
      {
        title: 'BICEPS',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-bicep-curl.jpeg', caption: 'These exercises target the biceps from different angles and should all feature in your programming — either in a single session or distributed across workouts or training phases.' },
          { type: 'paragraph', text: 'The biceps cross both the elbow and shoulder joints, meaning the angle of the upper arm relative to the torso changes which portion of the muscle is emphasised. Spider curls (arm hanging in front of the body) bias the shortened range near full contraction, standing curls train through the middle range most people associate with "a curl," and preacher curls emphasise the lengthened, stretched position at the bottom of the movement. **A well-rounded arm programme rotates through more than one of these across a training block.**' },
        ],
      },
      {
        title: 'Spider Curl',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'spider curl' },
          { type: 'paragraph', text: '*Lying face-down removes the ability to swing the body or use momentum from the hips*, which is why this variation is often the most humbling for clients who think they know their curl weight from standing versions — expect to use noticeably lighter dumbbells here than in a standing curl.' },
          { type: 'list', items: ['Curl the dumbbell while lying stomach-down on a 45–60° incline bench.'] },
        ],
      },
      {
        title: 'Standing Curl',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img027.jpeg', caption: 'Curl variations — cable curl, standing dumbbell curl, and preacher curl machine' },
          { type: 'list', items: ['Curl the dumbbell while standing. The most fundamental bicep exercise.'] },
          { type: 'paragraph', text: '==Watch for two common faults here==: swinging the torso backward to help the weight up (which shifts load off the biceps and onto momentum), and letting the elbow drift forward away from the body as the weight rises. Keeping the elbow pinned gently at the side throughout the rep keeps the tension where it belongs.' },
        ],
      },
      {
        title: 'Preacher Curl',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-preacher-curl.jpeg', caption: 'Preacher curl — upper arm fixed against the angled pad' },
          { type: 'list', items: ['Curl the dumbbell while leaning on a preacher bench. Ensure the elbow angle does not cause discomfort.'] },
          { type: 'paragraph', text: 'The preacher bench fixes the upper arm in place, which removes any ability to cheat with body momentum and places significant stretch on the biceps tendon at the bottom of the rep. ==Because of this tendon stress, this is not usually the first curl variation to introduce to a brand-new client== — build a foundation with standing or spider curls first.' },
        ],
      },
      {
        title: 'BACK — One-Arm Cable Row Bench',
        headingLevel: 'h2',
        content: [
          { type: 'video-only', text: 'one-arm cable row bench' },
          { type: 'list', items: ['Setting a bench slightly less than 90°, place cable height in accordance with the body part being targeted.', 'Higher for lats, lower for mid/upper back.'] },
          { type: 'paragraph', text: 'Bracing the chest on the bench removes any ability to cheat the pull with body English, so constant cable tension and a fixed torso isolate the target back muscle far more strictly than a standing free-weight row would.' },
        ],
      },
      {
        title: 'TRICEPS',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-tricep-exercise-v2.jpeg', caption: '' },
        ],
      },
      {
        title: 'Pulley Pushdown',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-pulley-pushdown.jpeg', caption: 'Pulley pushdown — rope attachment, elbows fixed near the body' },
          { type: 'list', items: ['Put cable at the highest setting.', 'Use a rope attachment and pull downwards and outwards.', 'Bend over slightly to increase range of motion.', 'Keep the elbows near the body but no need to squeeze them in.'] },
          { type: 'paragraph', text: 'Splitting the rope apart at the bottom of the movement (rather than keeping the hands together) adds a small amount of extra triceps contraction at the point of full elbow extension, which many clients find helps them feel the target muscle more clearly.' },
        ],
      },
      {
        title: 'Overhead Triceps Extension',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'overhead triceps extension' },
          { type: 'list', items: ['Put cable at the lowest setting.', 'Face away from the machine and lean over while holding onto the ropes.', 'Push ropes upwards and outwards until arms are fully extended.', 'Bring ropes back down but only bend elbows to a comfortable point. This exercise is best done with well-warmed elbows.'] },
          { type: 'paragraph', text: 'This variation stretches the long head of the triceps — the only one of the three heads that crosses the shoulder joint — far more than pushdowns do, which is why it targets the size and shape of the back of the upper arm rather than just pressing strength.' },
        ],
      },
      {
        title: 'FOREARMS',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-forearm-exercise-v2.jpeg', caption: '' },
          { type: 'list', items: ['Rotations with dumbbells or plates', 'Pinch grip holds', 'Dead hangs — can be done in any hand orientation. Feet can touch the ground if full hanging is too challenging.'] },
          { type: 'paragraph', text: 'Forearm and grip training is frequently skipped entirely, yet it is one of the most transferable qualities a client can build — **every deadlift, row, farmer carry, and pull-up variation is ultimately limited by how long the hands can hold on.** Two or three short sets of dead hangs or pinch grip holds at the end of a session is a low-fatigue, high-return addition to almost any programme.' },
        ],
      },
      {
        title: 'CALVES',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'The calf is made up of two distinct muscles that respond differently to knee position — training both, in both a straight-leg and bent-knee position over time, produces more complete lower-leg development than either alone.' },
        ],
      },
      {
        title: 'Leaning Calf Raise',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-calf-raise.jpeg', caption: 'Leaning calf raise — bodyweight, full range of motion' },
          { type: 'list', items: ['With hands on a wall, walk feet backwards until you feel the heels are going to rise.', 'Keeping the body straight, lift the heels up and then down to the maximum stretch.'] },
        ],
      },
      {
        title: 'Tibialis Raise',
        headingLevel: 'h3',
        content: [
          { type: 'video-only', text: 'tibialis raise' },
          { type: 'list', items: ['Back to the wall, feet are walked forward away from it. Lift the toes up and down for repetitions.', 'The further the feet from the wall, the tougher the exercise.'] },
        ],
      },
    ],
  },
  {
    id: 'diet-nutrition',
    number: '7',
    title: 'Diet and Nutrition',
    subtitle: 'What to Eat, How Much, and Why It Matters',
    summary: 'A simple, practical guide to energy balance, hydration, macro-supplementation, and strengthening digestion.',
    sections: [
      {
        title: 'Macronutrients',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**Diet — what you eat and drink — is vital when it comes to health.** Our body is literally made from the food that enters it. Eating well means building a healthy body. A diet rich in all the vital nutrients ensures we stay healthy, disease-free, and maintain an appropriate body weight.' },
          { type: 'paragraph', text: 'In brief, food can be divided into 5 major nutrients — carbohydrates, protein, and fat (the three macronutrients), plus vitamins and minerals (the micronutrients).' },
          { type: 'figure', src: '/assets/images/v1/img033.png', caption: 'The five major nutrient groups — carbohydrates, protein, fat, dairy, and fruit/vegetables' },
          { type: 'paragraph', text: 'Macronutrients are the three categories of food that supply the body with usable energy and building material, each measured in grams and each serving a distinct role. Understanding what each one actually does for the body makes it far easier to explain to a client why a diet plan looks the way it does, rather than asking them to follow rules without reasons.' },
        ],
      },
      {
        title: 'Protein — Recovery and Rebuilding of Tissues',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Proteins are digested into amino acids. Twenty amino acids have important functions in the body; nine must come from food (essential amino acids). A protein-rich, varied diet ensures all amino acids are present. ==Note: protein is not an efficient energy source.==' },
          { type: 'paragraph', text: 'A simple way to explain this to a client: **think of protein as the bricks used to repair and build the body\'s tissues** — muscle, skin, hair, hormones, and immune cells are all built from amino acids. Fat and carbohydrate, by contrast, are the fuel that powers the work of laying those bricks. A diet can be extremely high in calories yet still leave a client under-recovered and losing muscle if protein intake is too low, because there simply are not enough bricks to rebuild what training breaks down.' },
        ],
      },
      {
        title: 'Fats — Transport, Structure, and Emergency Fuel',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-healthy-fats.jpeg', caption: 'Healthy fat sources — essential for hormone production, cell structure, and sustained energy' },
          { type: 'list', items: ['Unsaturated Fats — found mostly in plants (though some types also found in animals).', 'Saturated Fats — found mostly in animals (but sometimes also found in plants).', 'Trans Fats — should be avoided mostly as these are harmful to health.'] },
          { type: 'paragraph', text: 'All fats (besides artificial trans fats) are healthy if taken in moderation and as part of a balanced diet. ==Fat provides twice the energy of carbohydrates or protein per gram==, but is slower to utilise as fuel.' },
        ],
      },
      {
        title: 'Carbohydrates — Primary Energy Source',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'The easiest form of energy for the body. They are of two types:' },
          { type: 'list', items: ['Simple carbs — things like refined sugar, refined bread, soda, fruit juice, and fruits. These give quick energy but are also associated with more cravings.', 'Complex carbs — things like peas, beans, whole grains, and vegetables. These take longer to digest and keep you full for longer.'] },
          { type: 'paragraph', text: 'A client who eats a bowl of sugary cereal for breakfast and feels hungry again within the hour is experiencing simple carbohydrates working exactly as expected — a fast rise and equally fast fall in blood sugar. Swapping that same breakfast for oats with fruit and a source of protein slows digestion considerably and keeps hunger away for hours longer, even at a similar calorie count. **This single swap is often the highest-leverage change a coach can suggest for a client struggling with mid-morning cravings.**' },
        ],
      },
      {
        title: 'Micronutrients',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Nutrients required in very small quantities but essential for proper function. Subdivided into:' },
        ],
      },
      {
        title: 'Vitamins',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Obtained from animals and plants. There are 13 known vitamins, some water-soluble and others fat-soluble. Each one plays a distinct role in the body:' },
          { type: 'list', items: [
            '👁️ Vitamin A (Retinol) — vision, immune function, reproduction and growth.',
            '☀️ Vitamin D (Cholecalciferol) — bone growth, calcium absorption, and immune regulation.',
            '🛡️ Vitamin E (Tocopherol) — antioxidant that protects cell membranes from damage.',
            '🩸 Vitamin K (Phylloquinone) — blood clotting and bone health.',
            '⚡ Vitamin B1 (Thiamin) — converting food into usable energy.',
            '⚡ Vitamin B2 (Riboflavin) — energy metabolism and healthy skin.',
            '⚡ Vitamin B3 (Niacin) — energy metabolism and nervous system function.',
            '🔄 Vitamin B5 (Pantothenic Acid) — metabolising fats and carbohydrates.',
            '🧠 Vitamin B6 (Pyridoxine) — protein metabolism and brain development.',
            '💇 Vitamin B7 (Biotin) — healthy hair, skin, and nails; supports metabolism.',
            '🧬 Vitamin B9 (Folate) — DNA synthesis and cell division; critical during pregnancy.',
            '🩸 Vitamin B12 (Cobalamin) — nerve function and red blood cell formation.',
            '🍊 Vitamin C (Ascorbic Acid) — immune support, collagen synthesis, and antioxidant protection.',
          ] },
        ],
      },
      {
        title: 'Minerals',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Minerals originate in the earth and are obtained through food and water. Some are needed in larger amounts, while others — called trace minerals — are needed in only tiny quantities but are no less essential:' },
          { type: 'list', items: [
            '🦴 Calcium — bone and teeth strength, muscle contraction, nerve signalling.',
            '🩸 Iron — oxygen transport in red blood cells and energy production.',
            '💪 Magnesium — muscle and nerve function, energy production, bone health.',
            '🛡️ Zinc — immune function, wound healing, and protein synthesis.',
            '🔋 Potassium — fluid balance, muscle contraction, and blood pressure regulation.',
            '🧂 Sodium — fluid balance, nerve transmission, and muscle function.',
            '⚡ Phosphorus — bone and teeth structure, energy storage.',
            '🦋 Iodine — thyroid hormone production and metabolism regulation.',
            '🛡️ Selenium — antioxidant defence and thyroid hormone metabolism.',
            '🔗 Copper — iron metabolism, connective tissue, and nervous system health.',
            '⚙️ Manganese — bone formation, metabolism, and antioxidant enzyme function.',
            '🍬 Chromium — insulin function and blood sugar regulation.',
            '🦷 Fluoride — dental health and bone strength.',
          ] },
        ],
      },
      {
        title: 'Water — The Life-Giving Liquid',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-water-health.jpeg', caption: 'It is a literal fact to say that most of the human body is water. **Dehydration at any level causes significant problems.** Benefits of adequate hydration include:' },
          { type: 'list', items: ['Helps form saliva and mucus — keeps our mouth, nose, and eyes moist and prevents damage.', 'Delivers oxygen throughout the body — blood is more than 90% water.', 'Lubricates joints — cartilage is about 80% water.', 'Boosts productivity — even mild dehydration can cause sluggishness.', 'Flushes out waste through sweating and urination.', 'Regulates body temperature through sweat evaporation.', 'Helps the digestive system function properly.', 'Cushions the brain, spinal cord, and other sensitive tissues.', 'Maintains blood pressure — lack of water makes blood thicker.'] },
        ],
      },
      {
        title: 'Fibre',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-fibre-vegetables.jpeg', caption: 'Fibre-rich vegetables — support digestion, blood sugar control, and lasting fullness' },
          { type: 'list', items: ['Soluble fibre — dissolves to form a gel that improves digestion, reduces blood cholesterol, and helps manage blood sugar.', 'Insoluble fibre — attracts water into the stool, making it softer and easier to pass. Promotes bowel health and regularity.'] },
          { type: 'paragraph', text: 'Most clients under-eat fibre without realising it, since a diet built mainly around meat, refined grains, and dairy naturally contains very little. ==A practical target for most adults is 25–35 grams daily== — easily reached with a few servings each of vegetables, whole fruit, legumes, and whole grains spread across the day, rather than one large salad eaten once and forgotten.' },
        ],
      },
      {
        title: 'Energy Balance — Calories In vs. Calories Out',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img035.png', caption: 'Energy balance — the fundamental driver of body weight change' },
          { type: 'paragraph', text: 'In a nutshell, the body is a system that is either building something or breaking something down. When we consume more food (more calories) than we expend, the body stores the excess — usually as body fat. Many factors contribute to how much we eat and how much energy we burn.' },
          { type: 'paragraph', text: 'How many calories do YOU need? **If you are not at a body weight you are happy with but are not gaining or losing either, then your current calorie intake is your maintenance.** Track meals for 7 days using apps like MyFitnessPal or HealthifyMe to find out.' },
        ],
      },
      {
        title: 'Do you have to track calories?',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img036.png', caption: 'Calorie tracking — a temporary investment for lifelong nutritional understanding' },
          { type: 'paragraph', text: 'If you want consistent and long-term results, then yes — at least for a period. Tracking your meals tells you exactly what you are eating and gives you the numbers you need to make adjustments. *A month or two of tracking teaches clients more about their diet than years of guesswork.*' },
        ],
      },
      {
        title: 'How to Create the Perfect Diet for Just About Anyone',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Rather than handing every client a rigid meal plan, the three principles below work as a simple, repeatable framework that scales to almost any goal, food preference, or cultural diet — apply them in order and the rest of the details tend to sort themselves out.' },
        ],
      },
      {
        title: '1. Anchor the Plate with Protein',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img037.jpeg', caption: 'Protein-first approach — the most effective anchor for any meal plan' },
          { type: 'paragraph', text: 'Understanding the concept of "calories in calories out" (CICO) is the foundation of any diet. ==The average exercising person needs 1.5–2× their bodyweight (kg) in grams of protein per day.== A 70kg person therefore needs 105–140g of protein daily.' },
        ],
      },
      {
        title: '2. Eat Vegetables at Every Meal',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img038.jpeg', caption: 'Vegetables at every meal — nature\'s multivitamins' },
          { type: 'paragraph', text: 'Vegetables are nature\'s multivitamins, help reduce total calorie intake, and improve digestion. Aim for 1–3 cups per meal.' },
        ],
      },
      {
        title: '3. Choose Carbohydrates Wisely',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img039.jpeg', caption: 'Carbohydrate quality matters — prioritise complex sources' },
          { type: 'paragraph', text: 'Because modern people move considerably less than their ancestors, the need for carbohydrate energy is lower than many assume. For vegetarians, it is not feasible to reduce carbs too much — but they can focus on mixed carbohydrate-protein sources such as lentils and legumes. The best time to eat a carbohydrate-rich meal is post-exercise, when the body most needs rapid energy replenishment.' },
        ],
      },
      {
        title: 'Smart Supplementation',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**Despite the wide mountains of claims companies make, most supplements are at best untested and at worst harmful.** The most evidence-supported ones are listed below — each is named clearly so you know exactly which product the notes refer to.' },
          { type: 'figure', src: '/assets/images/v1/img040.jpeg', caption: 'Multivitamin', small: true },
          { type: 'paragraph', label: 'Multivitamin', text: 'Assuming it is a high-quality brand, a multivitamin acts as a great nutritional insurance policy. Takes care of gaps in the diet, particularly given modern soil depletion.' },
          { type: 'figure', src: '/assets/images/v1/img041.png', caption: 'Creatine Monohydrate', small: true },
          { type: 'paragraph', label: 'Creatine Monohydrate', text: 'One of the most studied supplements in the industry. Benefits extend beyond gym performance to include improved brain function and blood sugar regulation. Safe for virtually everyone. Inexpensive and effective.' },
          { type: 'figure', src: '/assets/images/v1/img042.jpeg', caption: 'Whey Protein Powder', small: true },
          { type: 'paragraph', label: 'Protein Powder', text: 'Valuable for those who cannot realistically reach their daily protein intake through whole food alone — particularly vegetarians and vegans. Choose quality brands.' },
          { type: 'figure', src: '/assets/images/v1/img043.jpeg', caption: 'Probiotics', small: true },
          { type: 'paragraph', label: 'Probiotics', text: 'Beneficial bacteria strains that support gut health. Quality and strain matters significantly.' },
          { type: 'figure', src: '/assets/images/v1/img044.jpeg', caption: 'Calcium with Vitamins D & K2', small: true },
          { type: 'paragraph', label: 'Vitamin D, K2 & Calcium', text: 'These work synergistically. Low Vitamin D is widespread in modern populations. Supplement only after a blood test confirms deficiency.' },
          { type: 'figure', src: '/assets/images/v1/img045.jpeg', caption: 'Glutamine', small: true },
          { type: 'paragraph', label: 'Glutamine', text: 'Good to improve immunity, may reduce food cravings, and benefit digestive health.' },
          { type: 'figure', src: '/assets/images/v1/img046.jpeg', caption: 'Fish Oil (Omega-3)', small: true },
          { type: 'paragraph', label: 'Fish Oil (Omega-3)', text: 'If you can find a good brand with fresh oil, then maybe — but for most people in India, fresh fish twice a week is far more effective than a capsule.' },
          { type: 'figure', src: '/assets/images/v1/img047.jpeg', caption: 'Digestive Enzymes', small: true },
          { type: 'paragraph', label: 'Digestive Enzymes', text: 'Our stomach produces various acids and substances to digest food. Supplemental digestive enzymes can support this process when production is impaired.' },
          { type: 'figure', src: '/assets/images/v1/img048.jpeg', caption: 'BCAAs', small: true },
          { type: 'paragraph', label: 'BCAAs', text: 'Amino acids said to give energy during workouts. Generally not necessary for those with adequate protein intake.' },
          { type: 'paragraph', label: 'Melatonin', text: 'Produced by the brain at night to induce sleep. Can be supplemented in small doses (0.5–1mg) when sleep is disrupted. Not recommended for long-term daily use.' },
          { type: 'paragraph', text: '**If a client can only afford one or two supplements from this entire list, a quality multivitamin and creatine monohydrate offer by far the best evidence-to-cost ratio.** Everything else on this list should be considered situational — useful for specific gaps (a vegan needing protein powder, someone with confirmed low Vitamin D) rather than default additions for every client regardless of their diet.' },
        ],
      },
      {
        title: 'A word on Tea, Coffee, Pre-Workouts and other Stimulants',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img049.jpeg', caption: 'Stimulants — understand the mechanism and manage accordingly' },
          { type: 'paragraph', text: 'In brief, most of these things work because of one single thing — caffeine. This is a natural stimulant that increases alertness and temporarily improves performance. ==The downside is that it significantly disrupts sleep quality when consumed too close to bedtime.==' },
        ],
      },
      {
        title: 'Prepare, Don\'t React',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img050.jpeg', caption: 'Meal preparation — the single most important dietary habit' },
          { type: 'list', items: ['Plan your weekly diet on an off day and buy everything you can beforehand.', 'Put reminders in your calendar to buy all the things you need regularly.', 'Know what meals you are going to have beforehand — don\'t randomly decide in the moment.', 'Prepare proteins ahead of time as they take the longest to cook.', 'Have substitution "go-to" meals ready in case you cannot prepare your intended meal.'] },
        ],
      },
      {
        title: 'Managing Cravings',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-healthy-snacks.jpeg', caption: 'Cravings cause people to eat things they should not, leading to unwanted weight gain. **Rather than relying on willpower alone, reduce the trigger itself** by avoiding high-sugar processed foods that spark further cravings. Better alternatives: popcorn, roasted nuts and chickpeas, salads, and occasional fruit.' },
        ],
      },
      {
        title: 'Mini-Questionnaire to Ask Clients',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'After understanding the above information, the simplest way to assess a client\'s diet is with these questions:' },
          { type: 'list', items: ['Pre-planned meals 90% of the time — Yes/No', '3 meals plus one snack daily 90% of the time — Yes/No', 'Protein in every meal — Yes/No', 'Vegetables in every meal — Yes/No', 'Regular eating time 90% of the time — Yes/No', 'Use of fast/pre-packaged food less than 10% of the time — Yes/No', 'Caffeine intake 1–2 cups or less per day — Yes/No', 'Other drinks: water, green tea, occasional diet soda — Yes/No'] },
          { type: 'paragraph', text: 'Our objective is to slowly move the client toward getting a "yes" on all of these. If their diet is sorted, that is half the battle won.' },
        ],
      },
      {
        title: 'Some Tips to Strengthen Digestion',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img051.jpeg', caption: 'Digestive health — the foundation that affects every other aspect of wellbeing', small: true },
          { type: 'figure', src: '/assets/images/v1/stock-digestion-tips.jpeg', caption: 'Digestive health — the foundation that affects every other aspect of wellbeing' },
          { type: 'paragraph', text: '**Digestion is the single most important thing you can fix.** There is no other aspect of health that has such a profound cascading effect on everything else.' },
          { type: 'list', items: ['Drink 700–1000ml water on waking. Add lime for added benefit.', 'Apple cider vinegar: 1 tsp mixed with half a cup of water, 15 minutes before meals.', 'Drink ginger-pepper tea throughout the day to stimulate digestion.', 'Chew on a clove or ½ tsp fresh fennel after meals.', 'Eat slowly — around 32 chews per mouthful, or take 30 minutes per meal.', 'Go for a walk after meals.', 'Relax while you eat. No news, no reading technical content.', 'Eat only when genuinely hungry.', 'Add high-quality probiotics: empty stomach in the morning and before sleeping.', 'Drink warm (not cold) water whenever possible. Cold water disrupts digestive secretions.', 'Play relaxing music while eating.', 'Drink 500ml of warm water 20 minutes before eating.', 'Whenever possible, start your meal with raw foods.'] },
        ],
      },
    ],
  },
  {
    id: 'programme-design',
    number: '8',
    title: 'Programme Design',
    subtitle: 'Building Effective, Sustainable Training Plans',
    summary: 'The science of exercise order, weekly splits, sets/reps selection, and the golden principle of progressive overload.',
    sections: [
      {
        title: 'What is Flexibility and Mobility?',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Programme design is the art and science of creating exercise programmes for people based on their needs, goals, and limitations — equipment, injuries, learning ability, and prior experience.' },
          { type: 'figure', src: '/assets/images/v1/img052.png', caption: 'Programme design — creating the right stimulus for the right person' },
          { type: 'paragraph', text: 'There are three major qualities we work on when giving people exercise programmes:' },
          { type: 'list', items: ['Flexibility/Mobility — the ability to move the joints through greater range without injury.', 'Strength — the ability to lift heavier and heavier things.', 'Endurance/Cardio — the ability to do work for longer.'] },
          { type: 'paragraph', text: 'Over time, training should make people able to handle heavier, more stressful physical activities for longer — while possessing a body flexible enough to move in any required direction without injury. *Like a spider\'s web: strong and supple.*' },
          { type: 'figure', src: '/assets/images/v1/img053.jpeg', caption: 'Flexibility and mobility — two related but distinct qualities' },
          { type: 'paragraph', text: 'Range of motion is a lengthy study in itself. For simplicity:' },
          { type: 'figure', src: '/assets/images/v1/img054.jpeg', caption: 'Active vs. passive range of motion' },
          { type: 'list', items: ['Flexibility — the ability to put your body into a certain position using gravity or implements (passive).', 'Mobility — the ability to put your joints into certain positions using only muscular force (active).'] },
          { type: 'figure', src: '/assets/images/v1/img055.jpeg', caption: 'Full range of motion training — building strength through the complete range' },
          { type: 'paragraph', text: 'For normal healthy life, all of the body\'s joints need to be able to move within a comfortable range. **Rather than dedicated stretching sessions, the more effective approach is to train with full range of motion in your exercises.**' },
          { type: 'figure', src: '/assets/images/v1/img056.png', caption: 'Examples of full range of motion in compound movements' },
          { type: 'paragraph', text: 'Examples:' },
          { type: 'list', items: ['Doing push-ups on handles to stretch out the shoulders.', 'Slowly working up to full range squats to open up the knees and ankles.'] },
          { type: 'figure', src: '/assets/images/v1/img057.jpeg', caption: 'Mobility drill — building active range through movement' },
          { type: 'list', items: ['Doing side raises to make the side muscles and ribs more flexible.', 'Jefferson curls for keeping the back loose and strong through its full range.'] },
        ],
      },
      {
        title: 'Post-Workout Stretches',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img058.jpeg', caption: 'Post-workout stretching — target what each client feels most' },
          { type: 'paragraph', text: 'Stretching does improve flexibility when done consistently. Hold each stretch for 1–5 minutes. *Focus on what each individual client feels most — not a generic sequence.*' },
          { type: 'list', items: ['Bretzel', 'Supine hook-lying ankle holds (move head)', 'Supine legs-to-wall stretch', 'Figure-4 stretch', 'Weighted T-spine rotation (Cavaliere)', 'Chest wall stretch', 'Incline calf stretch', 'Seiza (seated on heels)'] },
        ],
      },
      {
        title: 'What is the Best Way to Warm Up?',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'One thing must be made very clear — **the best warm-up is simply the exercise itself, done at a lower weight.** If you are going to squat 70kg today, warm up with 40kg, then 50kg, then 60kg before the working set. For most people, this is all that is needed.' },
          { type: 'paragraph', text: 'That said, a thorough warm-up has many other conditions to it — particularly for athletic work, people with injuries, or those who arrive fatigued. Here are some suggested drills:' },
          { type: 'figure', src: '/assets/images/v1/img059.jpeg', caption: 'Downdog to lunge rotations — probably the most effective single warm-up drill' },
          { type: 'list', items: ['Downdog to Lunge Rotations — probably the most effective warm-up drill. This exercise stretches almost all major muscles, increases body temperature rapidly, and can make the body feel open in under 5 minutes.'] },
          { type: 'figure', src: '/assets/images/v1/img060.jpeg', caption: 'Lunge snatch — loaded chest and shoulder opener for tight thoracic regions' },
          { type: 'list', items: ['Lunge Snatch — similar to the previous exercise but loaded. Excellent chest and shoulder opener, especially for clients with tight thoracic regions. Start very light (even 2.5kg).', 'Poliquin to Hamstring Stretch — thoroughly warms and stretches the legs.', 'Modified Suryanamaskar — taken from yoga, this 7-step flow warms the body from head to toe. Modified to prevent lower back overuse.', 'Active Hang — 3–5 sets of hanging before upper body work activates the shoulder musculature and reduces joint clicking.', 'Bodyline Drills — Plank → Side Plank → Reverse Plank in succession, 1–2 minutes each, 2–3 rounds. A thorough core warm-up.'] },
        ],
      },
      {
        title: 'Exercise Selection',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img061.png', caption: 'Exercise selection categories — ensure all major areas are covered each week' },
          { type: 'paragraph', text: 'One of the simplest methods for selecting exercises is to divide them into categories:' },
          { type: 'list', items: ['Push (anterior — chest, shoulders, triceps)', 'Pull (posterior — back, rear delts, biceps)', 'Front legs (anterior — quads, hip flexors)', 'Back legs (posterior — hamstrings, glutes)', 'Core', 'Cardio'] },
          { type: 'paragraph', text: '**Making sure to use a combination of exercises from all these categories ensures all major muscle groups are stimulated each week.**' },
        ],
      },
      {
        title: 'Exercise Order',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img062.jpeg', caption: 'Exercise order — heavier, faster work first; lighter, higher-rep work after' },
          { type: 'paragraph', text: '**Perform heavier, faster, lower-rep activities first, followed by lighter, slower, higher-rep work.** Ask yourself: "If you had to play a 45-minute basketball match and run a 2-hour jog, which would you do first?" The basketball — because fatigue from the jog would impair explosive performance far more than the reverse.' },
        ],
      },
      {
        title: 'Sets, Repetitions and Rest',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img063.jpeg', caption: 'Rest periods — heavier loads need more recovery between sets' },
          { type: 'paragraph', text: 'Lower reps (heavier weights) require more sets and longer rest. Higher reps require fewer sets and less rest. However, advanced trainees pushing close to failure on high-rep sets may still need 3–4 minutes rest regardless of load.' },
          { type: 'paragraph', text: 'As a rough starting framework for a general population client: 1–5 reps calls for ==3–5 minutes of rest== since the nervous system needs time to recover between near-maximal efforts; 6–12 reps (the most common range for general fitness and muscle gain) works well with ==60–120 seconds==; and 15+ rep sets aimed at muscular endurance can often be followed with as little as 30–60 seconds. These are starting points to adjust based on how quickly an individual client actually recovers, not fixed rules.' },
        ],
      },
      {
        title: 'Lifting Tempo',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img064.jpeg', caption: 'Lifting tempo — controlled descent, powerful ascent' },
          { type: 'paragraph', text: 'Generally speaking, as long as you don\'t yank weights up and down and control the movement, the tempo is fine for most purposes. Slower speeds may be used with elderly clients or during rehabilitation. Isometric exercises (holding positions) are also excellent for both of these populations.' },
        ],
      },
      {
        title: 'A Word on the Nervous System',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img065.jpeg', caption: 'The nervous system — the command centre that drives all muscular output' },
          { type: 'paragraph', text: 'Whenever we work hard, push ourselves to the limits, or work for a very long time, the nervous system fatigues alongside the muscles. This is why rest periods must be respected — **your muscles and cardiovascular system may recover faster than your nervous system.**' },
        ],
      },
      {
        title: 'A Word on Muscle Soreness',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img066.jpeg', caption: 'DOMS — delayed onset muscle soreness is not a reliable indicator of workout quality', small: true },
          { type: 'paragraph', text: 'Many people experience pain in the muscles they\'ve worked 24–48 hours after training — called Delayed Onset Muscle Soreness (DOMS). Most consider soreness to be a sign of a "good workout." **This is a fallacy.**' },
          { type: 'paragraph', text: 'Soreness most commonly occurs from:' },
          { type: 'list', items: ['Doing something very different — a new exercise variation.', 'Doing much more of something than you are used to.', 'Having a very poor diet before exercising hard — the body doesn\'t have the nutrients needed to recover.'] },
          { type: 'paragraph', text: '**Soreness by itself does NOT indicate anything about the effectiveness of a workout.** Don\'t chase soreness — chase progressive overload.' },
        ],
      },
      {
        title: 'Cardio',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Your lungs and heart are muscles. Like all other muscles, they require progressive overload to get stronger. Cardio can be divided into two types:' },
          { type: 'list', items: ['Long Cardio (like jogging, gentle swimming) — cardio you can do for long durations at a gentle pace. Produces a great cardiovascular adaptation over time.', 'Interval Cardio (like interval sprints, tabata circuits, or HIIT) — short bursts of high intensity alternated with rest. More demanding, requiring more recovery.'] },
          { type: 'paragraph', text: 'Some form of long cardio should be done daily or whenever possible. ==Ideally at least 3 hours of long cardio per week.==' },
        ],
      },
    ],
  },
  {
    id: 'cardio-conditioning',
    number: '9',
    title: 'Cardio and Conditioning',
    subtitle: 'Building Endurance and Work Capacity',
    summary: 'Understand aerobic vs. anaerobic training, HIIT protocols, and how to programme conditioning alongside strength work.',
    sections: [
      {
        title: 'Is Walking Also Long Cardio?',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img067.jpeg', caption: 'Walking — the most underrated and universally accessible form of exercise', small: true },
          { type: 'paragraph', text: 'Walking does not qualify as Zone 2 cardio for most people, but shares many of its long-term health benefits. Its accessibility, near-zero recovery cost, and complete lack of skill requirement make it **the single most powerful lifestyle recommendation a coach can make.** Encourage every client to walk at least one hour daily.' },
          { type: 'paragraph', text: 'What can an ideal training day look like?' },
          { type: 'list', items: ['Warm-up — activities to prepare for the session. Corrective exercises and mobility work.', 'Light Speed — training ladder, short sprints, bodyweight drills.', 'Heavy Speed — weighted explosive activities such as Olympic lifts or strongman events.', 'Primary Lifts — heavy lifts (usually using both arms/legs).', 'Secondary Lifts — accessory movements, such as unilateral exercises.', 'Isolation Work — extra work for smaller body parts like calves, biceps, triceps.', 'Cardio/Conditioning — higher duration, higher rep work to train work capacity and fat loss.'] },
        ],
      },
      {
        title: 'How to Put Exercises in a Week — Training Splits',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-gym-training.jpeg', caption: 'Training splits — the right structure depends on how many days a client can realistically commit' },
          { type: 'paragraph', text: 'A "split" is simply the pattern used to divide muscle groups or movement types across the days of a training week. **None of the splits below is inherently superior** — the right choice depends entirely on how many days a client can realistically train, and how quickly each of those days needs to feel manageable to sustain over months, not weeks.' },
        ],
      },
      {
        title: 'Bro Split (Body Part)',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'A popular way of training from older bodybuilding methods, allowing a lot of work for each individual body part.' },
          { type: 'list', items: ['Monday — Chest', 'Tuesday — Back', 'Wednesday — Shoulders and Traps', 'Thursday — Legs and Abs', 'Friday — Biceps, Triceps, and Forearms', 'Saturday and Sunday — Rest'] },
          { type: 'paragraph', text: 'Because each muscle group is trained only once a week, sessions can pile on volume without leaving anything sore for the next day\'s target — but a missed session means an entire body part waits a full week to be trained again, which is why this split suits clients who train reliably 5 days a week and struggles for anyone with an unpredictable schedule.' },
        ],
      },
      {
        title: 'Upper Lower',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['Monday — Upper', 'Tuesday — Lower', 'Wednesday — Rest', 'Thursday — Upper', 'Friday — Lower', 'Saturday and Sunday — Rest'] },
          { type: 'paragraph', text: 'Splitting the body into just two halves means each muscle group gets trained twice a week instead of once, which research consistently favours for muscle growth over a bro split at the same weekly volume — and a single missed session only costs a client one upper or one lower day, not an entire muscle group\'s week.' },
        ],
      },
      {
        title: 'Push-Pull-Legs',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['Monday — Push (Chest, Shoulders, Triceps)', 'Tuesday — Pull (Back, Rear Shoulders, Biceps)', 'Wednesday — Legs (Quads, Hamstrings, Glutes)', 'Thursday — Push', 'Friday — Pull', 'Saturday — Legs', 'Sunday — Rest'] },
          { type: 'paragraph', text: 'Grouping by movement pattern rather than body part keeps sessions balanced — every push day trains chest, shoulders, and triceps together since they all work in the same pressing direction — and the 6-day repeating cycle gives each muscle group two full training days per week, similar to upper/lower but with more exercises per body part per session.' },
        ],
      },
      {
        title: 'Example of an Exercise Session with Each Method',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img068.jpeg', caption: 'Sample exercise session structure for each training split' },
        ],
      },
      {
        title: 'Full Body Workouts (FBW) — Recommended Default',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'A staple way of training in older times. These workouts train all major muscle groups in each session, 2–3 times per week.' },
          { type: 'list', items: ['Monday — Full Body', 'Tuesday — Rest or Cardio', 'Wednesday — Full Body', 'Thursday — Rest or Cardio', 'Friday — Full Body', 'Saturday and Sunday — Rest'] },
        ],
      },
      {
        title: 'Sample 3-Day Full Body Programme',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'A concrete example makes this easier to apply than the split names alone. Below is a genuine 3-day full body week suitable for a general population client with roughly 45–60 minutes per session, built using the exercise order and category principles from this chapter.' },
          { type: 'list', items: ['Day A — Goblet Squat 3x8, Bench Press 3x8, One-Arm Dumbbell Row 3x10 (each side), Plank 3x30s hold', 'Day B — Romanian Deadlift 3x8, Push-Up 3x10, Lat Pulldown 3x10, Reverse Crunch 3x12', 'Day C — Front Squat 3x6, Overhead Press 3x8, Inverted Row 3x10, Side Raise (core) 3x10 each side'] },
          { type: 'paragraph', text: '**Notice the pattern: every session includes a squat-or-hinge movement, a push, and a pull**, in that heavier-to-lighter order discussed under Exercise Order — never three isolation exercises in a row with no compound lift to anchor the session.' },
        ],
      },
      {
        title: 'Designing for Different Goals',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img069.jpeg', caption: 'Goal-specific adjustments — the broad strokes for most clients' },
          { type: 'list', items: ['For Strength — more rest time, heavier weights, lower reps.', 'For Fat Loss — shorter rest times, lighter weights and more reps, switching between exercises.', 'For Muscle Gain — train to failure when possible; look for the burn; adequate nutrition and sleep are critical.'] },
          { type: 'figure', src: '/assets/images/v1/img070.jpeg', caption: 'Progressive overload — the most important principle for continued improvement' },
        ],
      },
      {
        title: 'Progressive Overload',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: '**This is the most important principle for long-term progress.** Each session must present a challenge that exceeds what the body has previously adapted to. This can be achieved by:' },
          { type: 'list', items: ['Increasing the weight lifted.', 'Increasing the reps done.', 'Improving technique — same load, better range and quality.', 'Decreasing rest time — same work in less time.'] },
          { type: 'figure', src: '/assets/images/v1/img071.jpeg', caption: 'Variety and progressive overload — keep the main lifts consistent, rotate accessories', small: true },
          { type: 'paragraph', text: 'Keep a small number of indicator lifts consistent over 2–3 weeks (bench press, squat, deadlift). Change accessory work every 2–3 weeks to maintain variety and engagement.' },
        ],
      },
      {
        title: 'Training Across Populations',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**The core principles in this book — stacking, bracing, external cues, progressive overload — apply to every client regardless of age, sex, or experience level.** What changes between populations is not the principle, but how much intensity, volume, and novelty a given client\'s body and life circumstances can currently absorb.' },
        ],
      },
      {
        title: 'Athletes vs. General Population',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img072.jpeg', caption: 'Athletes vs. general population — more stress means less potential recovery' },
          { type: 'paragraph', text: 'Would this same approach work for a housewife with a one-year-old child, or a busy CEO who shifted three meetings to make time for training? The answer is no. ==More stress = less potential recovery = less intense workout required.==' },
          { type: 'list', items: ['Recovery = Diet + Movement + Sleep + Relationships + Environment.', 'The last thing a sleep-deprived professional needs is a high-intensity session. *Many people want workouts to feel manageable some days — read the client, not just the programme.*'] },
        ],
      },
      {
        title: 'Males vs. Females',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img073.jpeg', caption: 'Male vs. female training differences — broadly similar, subtly different' },
          { type: 'paragraph', text: 'With a sound programme, training principles apply equally to both sexes. Two differences are commonly found:' },
          { type: 'list', items: ['Men tend to be able to increase weights quicker than women — women generally need more time at a given weight before advancing.', 'Regarding the menstrual cycle — ask how she feels, whether she wants to train hard, and adapt accordingly. Women react differently and require an individualised approach.'] },
        ],
      },
      {
        title: 'Children and Adolescents',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img074.jpeg', caption: 'Youth training — safety first, skill development over heavy loading' },
          { type: 'list', items: ['Kids below 8 are better off just left to play with guidance.', '==Kids below 16 should not lift loads below 6RM as their bones are still growing.==', 'Kids over 16 can do most of what adults can, though being cautious with very heavy loads.'] },
        ],
      },
      {
        title: 'Older Adults',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img075.jpeg', caption: 'Training older adults — same principles, reduced intensity and volume' },
          { type: 'paragraph', text: 'The training of adults and elderly is — contrary to popular belief — also essentially the same as for any other population. The adjustments are:' },
          { type: 'list', items: ['Reduce intensity (how heavy they lift).', 'Reduce volume (total reps done).', 'Reduce frequency (how many times per week they train hard).'] },
          { type: 'paragraph', text: 'Slow tempo training and isometrics are very useful here as they build strength with minimal injury risk.' },
          { type: 'figure', src: '/assets/images/v1/img076.jpeg', caption: 'Consistency over perfection — the most important long-term principle' },
          { type: 'paragraph', text: '**As long as a person trains hard, recovers well, and trains consistently, they will get results.** The principles in this book are like having a car — you could technically walk everywhere, but why would you when a vehicle makes the journey easier and faster?' },
          { type: 'paragraph', text: 'A simple but effective way of understanding health is to use Paul Chek\'s 1-2-3-4 system. It reminds coaches that bodies do not exist in a vacuum — they are embedded within a life, a purpose, and a set of daily choices that either build health or deplete it.' },
        ],
      },
    ],
  },
  {
    id: 'framework-1234',
    number: '10',
    title: 'The 1-2-3-4 Framework',
    subtitle: 'Paul Chek\'s Model for Holistic Health',
    summary: 'Understand the four core pillars of vitality: 1 Life Purpose, 2 Balancing Forces (Yin/Yang), 3 Choices, and 4 Internal Doctors.',
    sections: [
      {
        title: '1 — Love: Your Life Aim and Purpose',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img089.jpeg', caption: '1 — Love: knowing your purpose makes all health decisions clearer', small: true },
          { type: 'paragraph', text: 'For example, a man who wants to be an international-level basketball player needs to: practise many hours a day, work out intensely, spend money on a good coach and good food, sleep and wake on time, and cut out late nights and alcohol. These decisions become automatic when he is very clear on what he wants.' },
          { type: 'paragraph', text: 'Contrast this with a person who wants to be an international-level painter. He still needs to practise many hours a day. But does he need intense daily workouts? No. Can he go to parties? Sure. Does he need to sleep and wake on time? Ideally yes, but he can still succeed without this discipline.' },
          { type: 'paragraph', text: 'Both people are right. Both have different "optimal choices" based on their one love. **Knowing your one love makes it very clear what you should say yes and no to.**' },
        ],
      },
      {
        title: '2 — Forces: Yin and Yang Balance',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img090.jpeg', caption: '2 — Forces: yin and yang must be kept in balance', small: true },
          { type: 'paragraph', text: 'In life there are two types of things: things that give us energy and things that take energy away. Things that build us up and things that break us down. A yin to the yang.' },
          { type: 'figure', src: '/assets/images/v1/img091.png', caption: 'Examples of yin and yang activities in daily life' },
          { type: 'paragraph', text: 'Some examples of Yin activities: sleep, gentle movement, happy relationships, breathing exercises, good food.' },
          { type: 'paragraph', text: 'Some examples of Yang activities: vigorous exercise, high-stress work, toxic relationships, polluted environment, junk food.' },
          { type: 'paragraph', text: 'If we live a healthy life, these forces are kept in constant balance. Too much sleep (yin) means lethargy. Too much exercise (yang) means burnout and injury risk. **Neither is better — both must be balanced.**' },
        ],
      },
      {
        title: '3 — Choices',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img092.jpeg', caption: '3 — Choices: every decision falls into one of three categories' },
          { type: 'paragraph', text: 'A practical example: a client is deciding whether to come to their evening training session after a stressful day at work. The Optimal Choice might be attending and training as planned. The Suboptimal Choice might be skipping the session entirely to go straight home and eat comfort food. But there is often a third option a coach can offer that isn\'t purely "workout or nothing" — a shorter, gentler session focused on breathwork and light movement. **Presenting that middle option converts what felt like an all-or-nothing decision into one the client can actually say yes to.**' },
          { type: 'list', items: ['Optimal Choice — the best available decision for long-term wellbeing and goal achievement.', 'Suboptimal Choice — the most pleasurable short-term decision that may cause problems later.', 'No Choice — this means you are either sick (mentally or physically) or you genuinely don\'t know what the right choice is. This is where education from a coach is most valuable.'] },
        ],
      },
      {
        title: '4 — The Four Doctors',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img093.jpeg', caption: '4 — The Four Doctors: the pillars of sustainable health' },
          { type: 'list', items: ['Dr. Diet — what you consume physically (food and water) and mentally (media, information, and daily conversation).', 'Dr. Quiet — sleep, meditation, observation, contemplation, and restorative stillness.', 'Dr. Movement — structured exercise and overall daily activity levels.', 'Dr. Happiness — your dream, your "one love" — the purpose that makes all the other doctors worth attending to.'] },
        ],
      },
    ],
  },
  {
    id: 'breathwork-recovery',
    number: '11',
    title: 'Breathwork and Recovery',
    subtitle: 'Controlling Your Autonomic Nervous System',
    summary: 'Utilize breathing to shift from high stress (sympathetic) to deep recovery (parasympathetic). Master nasal breathing and Box Breathing.',
    sections: [
      {
        title: 'Nasal vs. Mouth Breathing',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'The concept of utilizing breath to produce changes in bodily and mental state is ancient and well-established in modern science. You can breathe for better focus, for losing focus, for more energy, to completely deplete it. Breathwork profoundly affects mental state, physical performance, and hormonal response.' },
          { type: 'paragraph', text: 'In breath there are 4 phases:' },
          { type: 'list', items: ['Inhale — exciting and activating the body. Heating. **Longer inhales increase arousal and alertness.**', 'Hold (full lungs) — stabilising. Used for bracing during heavy lifting.', 'Exhale — calming and relaxing the body. The fastest path to a calm state. **Longer exhales are the primary tool for reducing acute stress.**', 'Hold (empty lungs) — deepening the relaxation response.'] },
          { type: 'figure', src: '/assets/images/v1/img094.jpeg', caption: 'Nasal breathing — the preferred default for all activities where possible' },
          { type: 'paragraph', text: 'It is generally preferred to use nasal breathing exclusively as the nose:' },
          { type: 'list', items: ['Heats up cold air before it reaches the lungs.', 'Catches dirt and particles.', 'Helps the body absorb nitric oxide, which helps blood flow and relaxes the body.', 'Keeps oxygen levels stable and breathing rate regulated.'] },
          { type: 'paragraph', text: 'During times of great stress, mouth breathing often becomes the only option. ==A fair compromise during high intensity: inhale through the nose, exhale through the mouth.==' },
        ],
      },
      {
        title: 'A Word on Tongue Posture',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img095.jpeg', caption: 'Tongue posture — resting on the roof of the mouth improves airway dynamics' },
          { type: 'paragraph', text: 'To find the correct tongue position: swallow saliva and feel how the tongue goes and sticks to the top of the mouth. In this position, try humming the letter "N" without opening your mouth. **That is where your tongue should rest.** Maintaining this consistently improves breathing mechanics and stamina.' },
        ],
      },
      {
        title: 'Practical Breathwork Drills',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'The two drills below are the simplest, most repeatable way to give a client direct control over their own nervous system state — useful for pre-session anxiety, post-session recovery, or simply as a homework tool for stressful weeks.' },
        ],
      },
      {
        title: 'Box Breathing',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img096.jpeg', caption: 'Box breathing — a favourite of Navy SEALs and high-performance professionals' },
          { type: 'list', items: ['Box Breathing: a favourite of Navy SEALs. Divide breath into four equal phases: inhale, hold (full), exhale, hold (empty).', 'Start with 1-second intervals for 60 seconds. Add 1 second per phase every minute.', 'Continue for 5–10 minutes.'] },
        ],
      },
      {
        title: 'Ladder Breathing',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img097.jpeg', caption: 'Ladder breathing — simpler version with only inhale and exhale phases' },
          { type: 'list', items: ['Similar to box breathing but with only two phases — inhale and exhale. Start at 1 second each and increase by 1 second per minute for 5–10 minutes.'] },
          { type: 'paragraph', text: 'Once these drills are taught, a more subtle drill called Pleasure Breathing can be introduced. This is a more complex form involving diaphragmatic contraction — a great way to teach deeper breathing by getting the belly to move in and out with the breath.' },
        ],
      },
      {
        title: 'Using Ladder Breathing During Cardio',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'A very simple way to figure out how much and how fast each individual should breathe during cardio is to use footsteps as the metronome. Inhale for a set number of steps; exhale for the same count. Begin with a low count and increase as fitness improves.' },
        ],
      },
      {
        title: 'How to Recover Quickly Between Cardio Sets',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'When rest is given between rounds, it is very important to use proper recovery methods. Prioritise long, complete exhales to activate the parasympathetic nervous system and lower heart rate rapidly.' },
        ],
      },
      {
        title: 'Adding Visualisation to Supercharge Performance',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img098.jpeg', caption: 'Visualisation — mental rehearsal produces measurable improvements in physical performance' },
          { type: 'paragraph', text: 'Sports science has established that mental rehearsal — vividly imagining successful performance — produces measurable improvements in physical output, even without additional physical practice. Encourage clients to visualise a perfect set before executing it.' },
        ],
      },
      {
        title: 'Stack Breathing',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-stack-breathing.jpeg', caption: 'Stack breathing — maintaining neutral spine through controlled breathing patterns' },
          { type: 'paragraph', text: 'We have previously discussed and practised how to stack and brace for lifting. Stack breathing combines these elements — breathing in a way that actively maintains the neutral spine position and reinforces the bracing pattern during sustained efforts.' },
          { type: 'paragraph', text: 'Injuries are a part of life. Having clear strategies to work intelligently with pain and injury — and to prevent future injuries through smart programming — is one of the most valuable skills a coach can develop.' },
        ],
      },
    ],
  },
  {
    id: 'working-injuries',
    number: '12',
    title: 'Working with Injuries',
    subtitle: 'The MEAT Protocol and Joint Prehabilitation',
    summary: 'Why old RICE protocols fail. Implement the MEAT protocol (Movement, Exercise, Analgesia, Treatment) to actively restore tissue resilience.',
    sections: [
      {
        title: 'Why RICE is Often the Wrong Answer',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'RICE (Rest, Ice, Compression, and Elevation) refers to the process of letting an injury settle through passivity. While better than nothing, any person who has suffered from or worked with chronic injuries knows its limitations.' },
          { type: 'paragraph', text: 'Ice impedes proper blood flow and should not be used more than is required. **Pain does not always equal injury** — it is possible for someone to be in a lot of pain with very little tissue damage, and vice versa.' },
          { type: 'paragraph', text: '==Disc bulges are present in 19% of all people over 40 with NO symptoms at all.== This means the origin of pain in the body is not a simple thing to understand — our nervous system is a highly complex and sensitive system that has learned to associate certain movements with danger, even long after the tissue has healed.' },
        ],
      },
      {
        title: 'The MEAT Protocol',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'A more effective acronym for injury management is MEAT:' },
          { type: 'figure', src: '/assets/images/v1/img077.jpeg', caption: 'MEAT Protocol — Movement, Exercise, Analgesia, Treatment' },
          { type: 'list', items: ['Movement — In the initial stages of injury, choose ranges of motion and movements that do not provoke significant symptoms. Higher reps and holds are preferred over heavy loading.', 'Exercise — Once a certain level of pain has subsided and range has been gained, we can start to exercise more conventionally with progressively increasing loads.', 'Analgesia — Using various natural healing medicines is a great way to boost recovery. Essential oils, herbal remedies, and dietary anti-inflammatory strategies all have a role.', 'Treatment — Using manual therapies like acupressure, acupuncture, and myofascial release are great supporting tools. Physical modalities (laser, TENS, EMS) can also be effective.'] },
        ],
      },
      {
        title: 'Prehabilitation',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Prehab refers to strengthening joints and tissues to reduce the chance of accidental injury during training and daily life.' },
          { type: 'paragraph', text: 'A simple example: a client\'s shoulder occasionally clicks or feels unstable when reaching overhead to a high shelf, but shows no pain during normal training. **Rather than waiting for that instability to become a real injury**, a prehab approach adds light, controlled overhead work with full range of motion — such as the prone Y-raise from Chapter 5 — several times a week, well before the joint is ever asked to handle a heavy load in that position.' },
          { type: 'figure', src: '/assets/images/v1/img078.jpeg', caption: 'Why there is no single "correct" exercise form' },
          { type: 'paragraph', text: 'As mentioned before, a stacked spine is the position where the surrounding muscles produce the most force with the least injury risk. **But it is not the ONLY safe position.** Life will inevitably require movement in positions other than neutral — and being weaker in those positions increases injury risk.' },
          { type: 'paragraph', text: 'Training in unfamiliar ranges should be done slowly, with lighter weights, and without producing pain.' },
          { type: 'figure', src: '/assets/images/v1/img079.png', caption: 'Strength is range-specific — train all positions progressively' },
          { type: 'paragraph', text: 'The diagram above shows how training only the "neutral" range makes you strong only in that range. The goal is to develop strength and resilience across all ranges over time.' },
        ],
      },
      {
        title: 'Exercises for Lengthened Positions (require longer warm-up)',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**A muscle trained only in its shortened, contracted position (like the top of a bicep curl) stays comparatively weak and vulnerable at its lengthened, stretched position** — precisely the range in which most non-contact strains and pulls actually occur. The exercises below deliberately load muscles in that longer, more vulnerable range, but because the tissue is under more stretch, they demand a slower, more thorough warm-up than a typical compound lift.' },
        ],
      },
      {
        title: 'Poliquin Split Squat',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img080.jpeg', caption: 'Poliquin split squat — "knee moves forward and downward like an escalator"' },
          { type: 'list', items: ['"Knee moves forward and downward like an escalator."', '"Touch hamstring to calf at the bottom."'] },
          { type: 'paragraph', text: 'Letting the rear knee travel forward, rather than dropping it straight down, deepens the stretch on the hip flexor of the rear leg far more than a standard split squat — directly training strength in a lengthened hip position that most lower-body work never touches.' },
        ],
      },
      {
        title: 'Jefferson Curls',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img081.jpeg', caption: 'Jefferson curl — "roll one vertebra at a time, like a string of pearls"' },
          { type: 'list', items: ['"Roll one vertebra at a time — like a string of pearls."', '"Push your way downwards rather than falling down passively."'] },
          { type: 'paragraph', text: 'This is one of the only common exercises that deliberately flexes the spine under light load, rather than bracing it rigid — building resilience in spinal flexion (a position most strength training actively avoids) so that everyday bending and reaching no longer feel like an injury risk.' },
        ],
      },
      {
        title: 'Other Lengthened Position Exercises',
        headingLevel: 'h3',
        content: [
          { type: 'figure', src: '/assets/images/v1/img082.jpeg', caption: 'Side raise machine — full range develops lateral core strength and flexibility' },
          { type: 'figure', src: '/assets/images/v1/img083.jpeg', caption: 'Seated Good Morning — "pull belly button to the bench"' },
          { type: 'list', items: ['"Pull belly button to the bench."'] },
          { type: 'figure', src: '/assets/images/v1/img084.jpeg', caption: 'Dumbbell pullover — develops thoracic extension and lat flexibility' },
          { type: 'paragraph', text: 'All three exercises share the same purpose from earlier in this section — each one takes a muscle group (obliques, hamstrings/erectors, or lats) to a longer stretch than clients typically experience in daily life, and trains real strength there rather than just flexibility.' },
        ],
      },
      {
        title: 'Exercises for Shortened Positions',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img085.jpeg', caption: 'Knee extension machine — targets the quadriceps at their shortened position' },
          { type: 'figure', src: '/assets/images/v1/img086.jpeg', caption: 'Back extension — targets the erectors and glutes at their shortened position' },
          { type: 'figure', src: '/assets/images/v1/img087.jpeg', caption: 'Incline bench Y-raise — posterior deltoid in shortened position' },
          { type: 'figure', src: '/assets/images/v1/img088.jpeg', caption: 'Calf raise — gastrocnemius and soleus in shortened position' },
          { type: 'paragraph', text: '**You strengthen the positions you train**, and as we want to be strong everywhere we can be — within reason and progressively — these exercises serve an important role in a comprehensive programme.' },
          { type: 'paragraph', text: 'As coaches, we are responsible for the success of our clients\' goals. But for that, there are a few very important things to keep in mind:' },
        ],
      },
    ],
  },
  {
    id: 'client-management',
    number: '13',
    title: 'Client Management and Coaching',
    subtitle: 'Coaching Philosophy & Motor Learning',
    summary: 'The art of building professional boundaries, adapting to client psychological needs, and utilizing the Optimal Theory of Motor Learning.',
    sections: [
      {
        title: 'Adapt to the Client — Not the Other Way Around',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-personal-training.jpeg', caption: 'Most trainers and coaches have the notion of being a strict guru — someone who orders the client around and refuses to deviate from the plan. While there is certainly a time and place for firm boundaries and structure, this approach fails more often than it succeeds with general population clients.' },
          { type: 'paragraph', text: 'It is great in theory to tell an obese person to stop eating cake every day, but what good does that do if the person cannot stop? A much better approach would be something like:' },
          { type: 'paragraph', text: '"Hey, you told me you eat a lot of cake every evening. Now cake is tasty and I love it too — but I think we can both agree it\'s making our fat-loss goal more difficult. I was wondering if maybe we could start by not keeping it at home? If you eat it when you\'re out, that\'s fine."' },
          { type: 'paragraph', text: 'If you spoke kindly, the client at this point would probably agree and go somewhat along with the plan. This is perfectly normal and does not show laziness or weakness. From here, further small changes can be introduced gradually.' },
          { type: 'paragraph', text: 'In other words, **we are trying to make change as easy and non-confrontational as possible.** Sustainable transformation compounds from small, manageable steps.' },
        ],
      },
      {
        title: 'Never Forget the Basis of the Relationship',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Here is a very important but often neglected part of our field — keeping very strong professional boundaries. **You are paid in money and respect** for giving your client the path to good health. If any of these things is missing, there is something wrong.' },
          { type: 'list', items: ['If a client consistently pays late, fails to respect your time, or communicates disrespectfully — address it directly.', 'If behaviour does not change after one or two conversations, release the client.', 'The reverse is also true — never get verbally disrespectful with clients, never arrive late without prior notice.'] },
          { type: 'paragraph', text: 'A useful script for the first conversation: "I\'ve noticed [specific behaviour] has happened a few times now, and I want to flag it before it becomes a pattern between us. Is everything okay, and is there something I can do differently to help?" This opens with curiosity rather than accusation, gives the client a chance to explain a genuine circumstance, and still makes clear that the behaviour has been noticed and matters.' },
        ],
      },
      {
        title: 'Make Fitness Their Best Friend',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'We all know there are ways of exercising that are useful and effective, and there are ways that are less optimal but make people feel like exercising is the best part of their day. The second option is almost always preferable for general population clients.' },
          { type: 'paragraph', text: 'For example, a client loves chest exercises but dislikes leg exercises:' },
          { type: 'list', items: ['Ask the client if there are leg exercises they enjoy — maybe they prefer bodyweight work, or cycling, or some other form of lower body training.', 'Reduce volume and/or load so that the workout doesn\'t feel super hard on the legs. This is especially important early in the coaching relationship.', 'Celebrate performance milestones (personal bests, technique improvements) rather than appearance-based metrics, which change slowly.'] },
          { type: 'paragraph', text: '**Understanding where people are and giving them things they CAN do rather than demanding what they "should" do** — that is the job of a great coach.' },
        ],
      },
      {
        title: 'Resolve Issues Quickly',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'This comes as a rule you can generally apply in life: **the quicker you resolve a problem, the more trust you build.** A coach who resolves a client\'s problem rapidly — whether it is a stiff back, a persistent knee ache, or a training plateau — dramatically increases their perceived value.' },
          { type: 'paragraph', text: '*This does not mean every issue can be solved instantly — it means every issue should be acknowledged instantly.* A client mentioning knee discomfort deserves a same-session response ("let\'s modify today\'s squats and I\'ll look into this properly before our next session"), not silence followed by the exact same programme a week later as though nothing was said.' },
        ],
      },
      {
        title: 'The "Best" Method to Learn',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'Decades of research into this question have led to a model called the Optimal Theory of Learning. The three factors that most powerfully accelerate skill acquisition are:' },
          { type: 'list', items: ['**Autonomy** — freedom of choice. Rather than "do push-ups now," ask "ready for some push-ups?" and be genuinely willing to adapt. Research shows that perceived autonomy significantly increases both performance and long-term adherence.', '**Enhanced Expectations** — people perform better when told sincerely that they are capable. Positive expectation is not false praise; it is the evidence-based recognition that belief in a client\'s capacity tends to generate the very capacity it predicts.', '**External Focus** — directing attention toward an object or outcome in the environment produces faster, more automatic skill learning than focusing on a body part. This is why all exercise cues in this book are framed externally wherever possible.'] },
          { type: 'paragraph', text: 'Teaching exercises with an external cue focus has been shown to increase the speed of learning, quality of movement, and retention of skills. As an example: telling a person to jump and reach their fingers as high as possible produces a better jump than telling them to "extend your knees and hips powerfully."' },
          { type: 'figure', src: '/assets/images/v1/img102.png', caption: 'External focus research — consistently outperforms internal focus across all skills and populations' },
          { type: 'paragraph', text: 'Training an individual versus training a group should in theory be the same — human bodies don\'t change in groups. But why is this different in practice, and what changes need to be made?' },
        ],
      },
    ],
  },
  {
    id: 'group-training',
    number: '14',
    title: 'Group vs. Individual Training',
    subtitle: 'Adapting Your Approach to the Context',
    summary: 'The pros and cons of individual personal training versus large groups, and how to scale safety and exercise complexity.',
    sections: [
      {
        title: 'Personal Training',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img099.jpeg', caption: 'Personal training — maximum individualisation and the strongest client-coach bond' },
          { type: 'paragraph', text: 'Advantages:' },
          { type: 'list', items: ['Clients can be assessed individually; training can be fine-tuned to the individual.', 'Strong bonds are formed between the coach and the client.', 'Injury chances are lowest. Clients don\'t usually try to overdo their workout.'] },
          { type: 'paragraph', text: 'Disadvantages:' },
          { type: 'list', items: ['Training has to often be made more fun as it is essentially just one person working out.', 'Cannot compare with others to gauge if performance was good, bad, or mediocre.', 'Requires a coach with excellent communication and rapport-building skills.'] },
        ],
      },
      {
        title: 'Group Training',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/img100.jpeg', caption: 'Group training — elevated energy and natural accountability through competition' },
          { type: 'paragraph', text: 'Advantages:' },
          { type: 'list', items: ['People give their best and try to out-compete each other. The environment creates effort that is nearly impossible to replicate individually.', 'A group creates accountability — knowing your friends are waiting makes you more consistent.', 'The rate of referral can become very high as you handle more people simultaneously.'] },
          { type: 'paragraph', text: 'Disadvantages:' },
          { type: 'list', items: ['Clients cannot be assessed individually. This makes it very hard to give exercises and loads specific to each person.', 'Injury rates are much higher — people often push themselves beyond their current capacity.', 'Payment per client is quite limited unless you have multiple batches of large groups.'] },
        ],
      },
      {
        title: 'Which is Better? PT or Group Training?',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: '**The answer is: whatever works for YOU.** Many personal trainers and coaches train high-profile clients one-on-one. Others market online products, group subscriptions, or fitness events. Most coaches end up with a combination of two or more of these methods.' },
          { type: 'paragraph', text: 'A common and sustainable business model for many coaches is a hybrid: a small roster of one-on-one clients for steady, higher per-session income and deep individual relationships, combined with one or two group classes per week that build community, generate referrals, and let a coach train more people in the same block of time.' },
          { type: 'paragraph', text: 'Exercise selection tips for groups:' },
          { type: 'list', items: ['**Australian pull-ups over chin-ups** — you can adjust the height to suit any strength level. Chin-ups cannot be easily modified mid-class.', '**Lunges over weighted squats** — the upright torso position reduces low back and knee complaints. Weighted squats without proper bracing and stacking instruction carry significant injury risk in general population groups.', '**Reps for time over fixed rep targets** — "do push-ups for 45 seconds" removes counting complexity, scales naturally to individual capacity, and drives muscular endurance effectively.'] },
          { type: 'figure', src: '/assets/images/v1/img101.jpeg', caption: 'Group training exercise selection — simplicity and universal applicability are paramount' },
          { type: 'paragraph', text: 'Adding game elements at the end of sessions creates an effort level unique to group environments — even simple partner exercises and relay formats produce results that individual training cannot match.' },
        ],
      },
    ],
  },
  {
    id: 'appendix',
    number: 'A',
    title: 'Health Assessments and Resources',
    subtitle: 'Recommended Resources and Assessment Tools',
    summary: 'Health questionnaires, assessment protocols, and recommended reading for continued professional development.',
    sections: [
      {
        title: '3 Health Assessments to Improve Client Health',
        headingLevel: 'h2',
        content: [
          { type: 'figure', src: '/assets/images/v1/stock-health-assessment.jpeg', caption: '' },
        ],
      },
      {
        title: '1. Heart Rate Test (Target: ≤60 BPM)',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Note the client\'s resting heart rate by measuring the pulse at the wrist after 5+ minutes of quiet rest. ==A rate at or below 60 BPM reflects good cardiovascular conditioning.== Elevated resting heart rate is commonly associated with poor aerobic conditioning or inadequate diet. Retest every 4–6 weeks.' },
        ],
      },
      {
        title: '2. Sleep Quality Assessment',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'We have already stated the incredible value of sleep. Score each question Yes or No:' },
          { type: 'list', items: ['Consistent sleep and wake time — Yes/No', 'Trouble falling asleep typically — Yes/No', 'Sleep 7 hours/night — Yes/No', 'Do you wake up rested and energised — Yes/No', 'Drink alcohol before bed — Yes/No', 'Eat within 2 hours of bedtime — Yes/No', 'Do you need regular naps to catch up on sleep — Yes/No'] },
          { type: 'paragraph', text: '**The target is "Yes" for the first four and "No" for the last three.**' },
        ],
      },
      {
        title: '3. Breath Hold Test (Target: ≥30 Seconds)',
        headingLevel: 'h3',
        content: [
          { type: 'paragraph', text: 'Another important test — how long a person can hold their breath after a normal exhale. Instructions:' },
          { type: 'paragraph', text: '*A client scoring well below 30 seconds is not necessarily unfit in the conventional sense* — this test measures CO2 tolerance and nervous system calmness rather than cardiovascular fitness directly, and even strong athletes can score poorly here if they are chronically stressed or habitual mouth-breathers. Retesting this alongside the breathwork drills from Chapter 11 over several weeks is a simple way to show a client tangible proof that their nervous system is calming down.' },
          { type: 'list', items: ['Take a normal breath in through your nose and pinch your nostrils closed.', 'Exhale all the air from your lungs that you can.', 'Hold your breath with empty lungs and start the timer.', 'Continue until you feel the strong need to breathe in.', 'Stop the timer and record your breath hold time.'] },
          { type: 'paragraph', text: '==Anything above 30 seconds is acceptable.== Test every few weeks to see if there is improvement.' },
        ],
      },
      {
        title: 'Recommended Resources',
        headingLevel: 'h2',
        content: [
          { type: 'paragraph', text: 'The materials below go considerably deeper into the science underlying each topic in this manual — useful once a coach is comfortable with the practical skills and wants to understand the research behind them.' },
        ],
      },
      {
        title: 'Certifications',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['NASM Certified Personal Trainer (CPT)', 'NSCA Certified Strength and Conditioning Specialist (CSCS)', 'ACE Certified Personal Trainer', 'CHEK Holistic Lifestyle Coach (HLC)'] },
        ],
      },
      {
        title: 'Key Texts',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['Supertraining — Mel Siff & Yuri Verkhoshansky', 'Science and Practice of Strength Training — Vladimir Zatsiorsky', 'The Oxygen Advantage — Patrick McKeown (breathing)', 'Explain Pain — David Butler & Lorimer Moseley (pain science)', 'How to Eat, Move and Be Healthy — Paul Chek (holistic health)'] },
        ],
      },
      {
        title: 'Online Resources',
        headingLevel: 'h3',
        content: [
          { type: 'list', items: ['NSCA.com — research and professional development', 'PubMed.gov — peer-reviewed exercise science', 'GregNuckols.com — strength training research review', 'LivingFoundations.com — author\'s coaching practice'] },
          { type: 'paragraph', text: 'Thank you for investing your time in this resource. **The principles on these pages are only as valuable as the practice that follows.** Go coach. Make mistakes. Learn. Refine. Your clients\' results are the measure of everything.' },
          { type: 'paragraph', text: '— KC Jugran, Living Foundations' },
        ],
      },
    ],
  },
];

export interface Exercise {
  id: string;
  name: string;
  category: 'Push' | 'Pull' | 'Lower Body' | 'Core' | 'Isolation' | 'Holistic';
  description: string;
  cues: string[];
  externalCue?: string;
}

export const exercises: Exercise[] = [
  { id: 'cable-zercher-squat', name: 'Cable Zercher Squat', category: 'Lower Body', description: 'Teaches the stack using cable resistance in the Zercher position.', cues: ['Hold weight in Zercher position — forearms parallel, elbows bent at 90°.', 'Fight the pull of the cable and remain upright.', 'A heel plate assists those with limited ankle mobility.'], externalCue: 'Push the floor away from you.' },
  { id: 'barbell-zercher-squat', name: 'Barbell Zercher Squat', category: 'Lower Body', description: 'Teaches the brace — compressive force automatically elicits core activation.', cues: ['Go up and down slowly, maintaining posture from the cable version.', 'Over time you will automatically start bracing hard at the top of each rep.', 'Close the mouth and apply the Valsalva Manoeuvre.'], externalCue: 'Spread the floor apart with your feet.' },
  { id: 'goblet-squat', name: 'Goblet Squat', category: 'Lower Body', description: 'Hold a dumbbell or kettlebell like a large cup — same technique as Zercher squats.', cues: ['Hold the weight between the hands at chest height.', 'Sit down between your legs — imagine lowering into a well.', 'Keep elbows inside the knees at the bottom.'], externalCue: 'Lower yourself into a well between your feet.' },
  { id: 'front-squat', name: 'Front Squat', category: 'Lower Body', description: 'Barbell on front deltoids with elbows high — encourages upright torso.', cues: ['Keep barbell on the meat of the front shoulder muscles, elbows as high as possible.', 'Take a deep inhale and sit down between your legs.', 'Go only as low as you can without significant butt wink.', 'Come up using pursed-lips breathing.'], externalCue: 'Push the earth away from you.' },
  { id: 'back-squat', name: 'Back Squat', category: 'Lower Body', description: 'Bar on upper back — same technique, actively push through upper back on ascent.', cues: ['Bar placed on the meat of the upper back.', 'Note the tendency to lean forward — counter by pushing through the upper back.', 'Heel plate helps clients with limited ankle mobility.'], externalCue: 'Drive the bar into the ceiling.' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'Lower Body', description: 'Pure hip hinge — weight hanging from hands, no lower than mid-shin.', cues: ['Weight hangs from the hands, maintain the stack throughout.', 'Hinge at the hips, pushing them back like closing a car door.', 'Go no lower than mid-shin.'], externalCue: 'Push the wall behind you away with your hips.' },
  { id: 'push-up', name: 'Push-Up', category: 'Push', description: 'Full stack position — lower chest toward the thumbs.', cues: ['Come into push-up position with body in stack, hands slightly wider than chest.', 'Keep elbows at roughly 45° to the body.', 'Lower until chest nearly touches the ground.'], externalCue: 'Push the floor away from your chest.' },
  { id: 'bench-press', name: 'Bench Press', category: 'Push', description: 'Horizontal press — scapulae pinched, feet driving into the floor.', cues: ['Lie back with scapulae pinched together and driven into the bench.', 'Feet flat on the floor, creating a stable arch.', 'Lower the bar to mid-chest and press back up.'], externalCue: 'Push the bar through the ceiling.' },
  { id: 'inverted-row', name: 'Inverted Row', category: 'Pull', description: 'Horizontal pull from underneath a bar — adjustable difficulty via body angle.', cues: ['Grip the bar with hands slightly wider than shoulders.', 'Keep body in a straight line (stacked).', 'Pull chest to the bar, squeezing shoulder blades.'], externalCue: 'Pull the bar down to your chest.' },
  { id: 'one-arm-db-row', name: 'One-Arm Dumbbell Row', category: 'Pull', description: 'Unilateral pull — one hand and knee on bench for support.', cues: ['Place one hand and same-side knee on the bench.', 'Keep the back flat and hinge slightly at the hips.', 'Pull the dumbbell to the hip in a straight line.'], externalCue: 'Pull the weight toward your hip pocket.' },
  { id: 'plank', name: 'Plank', category: 'Core', description: 'Static core exercise demonstrating perfect stacked spinal control.', cues: ['Elbows directly below shoulders, nose below the thumbs.', 'Three points of contact: back of head, mid-back, and tailbone.', 'Adjust difficulty with knee position — stack must be maintained.'], externalCue: 'Hold your torso like a solid concrete beam.' },
  { id: 'reverse-crunch', name: 'Reverse Crunch', category: 'Core', description: 'Abdominal exercise prioritizing spinal flexion from the bottom-up.', cues: ['Lie on back, hold a sturdy object behind you.', 'Bend knees and pull them towards your head — this is the start.', 'Slowly unroll the spine down one vertebra at a time.'], externalCue: 'Unroll your spine onto the mat like a string of pearls.' },
  { id: 'spider-curl', name: 'Spider Curl', category: 'Isolation', description: 'Isolated bicep curl maximizing tension in the shortened range.', cues: ['Lie stomach-down on a 45–60° incline bench.', 'Arms hang straight down, curl dumbbells upward.', 'Keep upper arm vertical and locked in place.'], externalCue: 'Curl the weights toward your temples.' },
  { id: 'tibialis-raise', name: 'Tibialis Raise', category: 'Isolation', description: 'Develops the anterior lower leg to protect knee joints.', cues: ['Stand with back against a wall, heels walked forward.', 'Pull toes up toward shins as high as possible.', 'Lower slowly — the further the feet, the harder the exercise.'], externalCue: 'Pull your toes toward your knees.' },
  { id: 'farmer-carries', name: 'Farmer Carries', category: 'Holistic', description: 'Walking with heavy weights — teaches breathing behind the brace.', cues: ['Hold heavy weights at your sides, stand tall.', 'Walk with short, controlled steps maintaining a brace.', 'Breathe behind the shield — short, shallow breaths.'], externalCue: 'Walk like you own the gym.' },
];