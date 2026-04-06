import { useState, type ReactNode } from 'react'
import './Faq.css'
import { capture, captureException } from './posthog'

/** Decorative sunburst / barcode ring — fixed behind content */
function RadialBurst() {
  const cx = 260
  const cy = 260
  const n = 80
  const bars: ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    const angle = Math.PI * 0.12 + t * Math.PI * 1.38
    const r1 = 52
    const wave = Math.sin(i * 0.35) * 0.5 + 0.5
    const barLen = 22 + wave * 62 + (i % 5) * 3
    const r2 = r1 + barLen
    const x1 = cx + Math.cos(angle) * r1
    const y1 = cy + Math.sin(angle) * r1
    const x2 = cx + Math.cos(angle) * r2
    const y2 = cy + Math.sin(angle) * r2
    const accent = i >= 52 && i <= 61
    const palette = ['#ff6b9d', '#7bed9f', '#ffa502', '#5f7fff', '#ffd93d']
    const stroke = accent ? palette[i % palette.length] : 'rgba(255,255,255,0.42)'
    bars.push(
      <line
        key={`bar-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={accent ? 2.2 : 1.15}
        opacity={accent ? 0.9 : 0.32}
        className="radial-bar"
        style={{ animationDelay: `${i * 0.018}s` }}
      />,
    )
  }

  const chords: ReactNode[] = []
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2
    const hue = i % 12 < 4 ? 'rgba(95, 200, 200, 0.12)' : 'rgba(255, 90, 120, 0.08)'
    const x = cx + Math.cos(angle) * 48
    const y = cy + Math.sin(angle) * 48
    chords.push(
      <line
        key={`ch-${i}`}
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke={hue}
        strokeWidth={0.6}
        className="radial-chord"
      />,
    )
  }

  return (
    <svg
      className="radial-svg"
      viewBox="0 0 520 520"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="radial-fade" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
        </radialGradient>
      </defs>
      {chords}
      <circle
        cx={cx}
        cy={cy}
        r={46}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={118}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={1}
        strokeDasharray="3 6"
      />
      {bars}
      <circle cx={cx} cy={cy} r={200} fill="url(#radial-fade)" />
    </svg>
  )
}

function FaqItem({
  question,
  children,
}: {
  question: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  function handleToggle() {
    try {
      const next = !open
      setOpen(next)
      const questionText = typeof question === 'string' ? question : undefined
      capture(next ? 'faq_item_expanded' : 'faq_item_collapsed', {
        question: questionText,
      })
    } catch (err) {
      captureException(err)
    }
  }

  return (
    <div className={`fi${open ? ' fi-open' : ''}`}>
      <button type="button" className="fq" onClick={handleToggle} aria-expanded={open}>
        <span className="qt">{question}</span>
        <span className="fq-meter" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="fq-bar" />
          ))}
        </span>
        <span className="tgl" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      <div className="fa">
        <div className="fa-inner">
          <div className="fa-radial-mask">
            <div className="fa-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <div className="faq-page view-all">
      <div className="faq-radial-layer" aria-hidden>
        <RadialBurst />
      </div>
      <div className="page page-on-radial">
        <div className="page-ribbon">
          <div className="page-ribbon-spacer" />
          <div className="page-ribbon-mark">
            <span className="page-num">01</span>
            <span className="page-mark-label">Overview</span>
          </div>
        </div>

        <header id="overview" className="intro intro-split">
          <div className="intro-col-left">
            <p className="intro-kicker">Natnael & Yeabsra Ashebir</p>
          </div>
          <div className="intro-col-right">
            <h1 id="hero-title" className="hero-title">
              The twin FAQ
            </h1>
            <p className="intro-lead">What we know, what we&apos;re guessing.</p>
            <p className="sub">
              Everything you ever wanted to know about us. Answers below are
              mostly from Natnael&apos;s point of view unless noted.
            </p>
            <ul className="stats-plain">
              <li>
                Very likely identical (face, voice, build, interests line up;
                only a DNA test would say for sure)
              </li>
              <li>Natnael is 20 minutes older</li>
              <li>Yeabsra is 2 inches taller</li>
              <li>Yeabsra has 9k+ Telegram followers</li>
              <li>About 95% the same taste in everything</li>
            </ul>
          </div>
        </header>

        <main id="faq-main" className="main">
          <section
            id="sec-basics"
            className="section-block section-split"
            data-section="all"
          >
            <div className="section-col-left">
              <h2 className="section-label">The basics</h2>
            </div>
            <div className="section-col-right">
              <FaqItem
                question="Are you actually twins?"
              >
                <span className="pov-n-text">
                  Yeah, we are. And honestly I&apos;ve gotten so used to this
                  question it feels completely normal, like asking any sibling
                  how it feels to have brothers or sisters. It&apos;s different,
                  sure. People literally see us as the same person sometimes. But
                  also kind of special once you think about it.
                </span>
                <span className="pov-y-text">
                  Yeah, we are. Honestly I&apos;ve heard this question so many
                  times it just feels normal now. People see us as one unit,
                  same person, two copies. It&apos;s different from what most
                  people experience, but also something I&apos;m genuinely
                  grateful for. Kind of special when you think about it.
                </span>
              </FaqItem>

              <FaqItem
                question="Identical or fraternal?"
              >
                <span className="pov-n-text">
                  Based on what science can infer without a lab test, we&apos;re
                  very likely identical: same face, same voice, same general
                  build, and a ton of overlap in interests. None of that proves
                  it on paper. The only way to know for sure is a DNA test, and
                  we haven&apos;t done one. Keep reading for how to tell us apart
                  day to day.
                </span>
                <span className="pov-y-text">
                  Same story on my side. We look and sound the same, we&apos;re
                  built alike, and we care about a lot of the same things, so
                  odds are we&apos;re identical twins. You still can&apos;t claim
                  that for certain without a DNA test, which we haven&apos;t
                  taken. Keep reading.
                </span>
              </FaqItem>

              <FaqItem
                question={
                  <>
                    Who&apos;s older?{' '}
                    <span className="badge badge-n">Natnael</span>
                  </>
                }
              >
                <span className="pov-n-text">
                  That&apos;s me, I arrived first, 20 minutes before Yeabsra. Is
                  it a big deal? Technically no. Do I bring it up? Every single
                  time. I earned it.
                </span>
                <span className="pov-y-text">
                  Natnael. He was first by 20 minutes. He never lets me forget it.
                  Every. Single. Time.
                </span>
              </FaqItem>
            </div>
          </section>

          <section
            id="sec-apart"
            className="section-block section-split"
            data-section="all"
          >
            <div className="section-col-left">
              <h2 className="section-label">Tell you apart</h2>
            </div>
            <div className="section-col-right">
              <FaqItem
                question="Can your parents tell you apart?"
              >
                <span className="pov-n-text">
                  Easily. They&apos;ve lived with us our whole lives. They can
                  even tell us apart without seeing us, just by hearing us, by
                  how we move. Our parents always know which one is which.
                  Always.
                </span>
                <span className="pov-y-text">
                  Yes, easily. They&apos;ve been with us every day our whole
                  lives. They can tell us apart without even looking at us, by
                  voice, by how we walk. Parents just know.
                </span>
              </FaqItem>

              <FaqItem
                question="What's the physical difference between you?"
              >
                <span className="pov-n-text">
                  Three things that&apos;ll help you: I have a slimmer face and
                  Yeabsra&apos;s is wider. I have black dots, small marks around
                  my eyes and cheeks, he doesn&apos;t. And Yeabsra is 2
                  inches taller and 2 kg heavier. Once you know these,
                  you&apos;ll never mix us up again.
                </span>
                <span className="pov-y-text">
                  Three things: Natnael has a slimmer face, mine is wider. He has
                  small black dots around his eyes and cheeks, I don&apos;t.
                  And I&apos;m 2 inches taller and 2 kg heavier. Once you know
                  that, you&apos;ll never get us mixed up again.
                </span>
                <div className="face-row">
                  <div className="fcard">
                    <svg width="60" height="68" viewBox="0 0 60 68" fill="none">
                      <ellipse
                        cx="30"
                        cy="38"
                        rx="16"
                        ry="21"
                        fill="#1a1a1a"
                        stroke="#5a5a5a"
                        strokeWidth="1"
                      />
                      <circle
                        cx="22"
                        cy="31"
                        r="3.5"
                        fill="#262626"
                        stroke="#707070"
                        strokeWidth=".9"
                      />
                      <circle
                        cx="38"
                        cy="31"
                        r="3.5"
                        fill="#262626"
                        stroke="#707070"
                        strokeWidth=".9"
                      />
                      <circle cx="22.5" cy="31.5" r="1.5" fill="#c4c4c4" opacity=".65" />
                      <circle cx="38.5" cy="31.5" r="1.5" fill="#c4c4c4" opacity=".65" />
                      <path
                        d="M23 41 Q30 45 37 41"
                        stroke="#707070"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="19" cy="29" r="1.1" fill="#e8e8e8" opacity=".55" />
                      <circle cx="23" cy="27" r=".9" fill="#e8e8e8" opacity=".5" />
                      <circle cx="17.5" cy="32" r=".85" fill="#e8e8e8" opacity=".45" />
                      <circle cx="37" cy="29" r="1.1" fill="#e8e8e8" opacity=".55" />
                      <circle cx="41" cy="30.5" r=".85" fill="#e8e8e8" opacity=".45" />
                      <circle cx="22.5" cy="40" r=".9" fill="#e8e8e8" opacity=".4" />
                      <circle cx="37.5" cy="41" r=".8" fill="#e8e8e8" opacity=".35" />
                      <path
                        d="M20 24.5 Q22 22.5 25 23.5"
                        stroke="#707070"
                        strokeWidth=".9"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M35 24.5 Q38 22.5 40 23.5"
                        stroke="#707070"
                        strokeWidth=".9"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <div className="fname pov-n-text">Me (Natnael)</div>
                    <div className="fname pov-y-text">Natnael</div>
                    <div className="fdesc">
                      Slimmer face · black dots around eyes & cheeks · shorter
                    </div>
                  </div>
                  <div className="fcard">
                    <svg width="60" height="68" viewBox="0 0 60 68" fill="none">
                      <ellipse
                        cx="30"
                        cy="38"
                        rx="23"
                        ry="21"
                        fill="#1a1a1a"
                        stroke="#5a5a5a"
                        strokeWidth="1"
                      />
                      <circle
                        cx="22"
                        cy="31"
                        r="3.5"
                        fill="#262626"
                        stroke="#707070"
                        strokeWidth=".9"
                      />
                      <circle
                        cx="38"
                        cy="31"
                        r="3.5"
                        fill="#262626"
                        stroke="#707070"
                        strokeWidth=".9"
                      />
                      <circle cx="22.5" cy="31.5" r="1.5" fill="#c4c4c4" opacity=".65" />
                      <circle cx="38.5" cy="31.5" r="1.5" fill="#c4c4c4" opacity=".65" />
                      <path
                        d="M23 41 Q30 45 37 41"
                        stroke="#707070"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M20 24.5 Q22 22.5 25 23.5"
                        stroke="#707070"
                        strokeWidth=".9"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M35 24.5 Q38 22.5 40 23.5"
                        stroke="#707070"
                        strokeWidth=".9"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <div className="fname pov-n-text">Yeabsra</div>
                    <div className="fname pov-y-text">Me (Yeabsra)</div>
                    <div className="fdesc">
                      Wider face · no dots · 2 in taller · 2 kg heavier
                    </div>
                  </div>
                </div>
              </FaqItem>

              <FaqItem
                question="What's the personality difference?"
              >
                <span className="pov-n-text">
                  People say I&apos;m lighter and easier to approach at first
                  impression. Yeabsra looks more serious when you first meet him.
                  But once you know us? The real character difference shows up:
                  hard to explain but very easy to feel. We&apos;re about 95% the
                  same in taste and values. The 5% is where personality lives.
                </span>
                <span className="pov-y-text">
                  People say Natnael is lighter and easier to approach at first. I
                  come off more serious. But once people actually get to know us,
                  the difference is obvious, it&apos;s something you feel, not
                  explain. We&apos;re about 95% the same in everything. The 5%
                  is personality.
                </span>
                <div className="vs-row">
                  <div className="vsc">
                    <div className="vs-name vs-n pov-n-text">Me (Natnael)</div>
                    <div className="vs-name vs-n pov-y-text">Natnael</div>
                    <div className="vs-item pov-n-text">
                      Lighter, easier to approach first
                    </div>
                    <div className="vs-item pov-n-text">
                      Slightly funnier (I said it)
                    </div>
                    <div className="vs-item pov-n-text">
                      Slimmer face, got the dots
                    </div>
                    <div className="vs-item pov-n-text">
                      20 minutes older, earned it
                    </div>
                    <div className="vs-item pov-y-text">
                      Lighter, easier to approach first
                    </div>
                    <div className="vs-item pov-y-text">Claims to be funnier</div>
                    <div className="vs-item pov-y-text">
                      Slimmer face, has the dots
                    </div>
                    <div className="vs-item pov-y-text">
                      20 min older, won&apos;t stop mentioning it
                    </div>
                  </div>
                  <div className="vsc">
                    <div className="vs-name vs-y pov-n-text">Yeabsra</div>
                    <div className="vs-name vs-y pov-y-text">Me (Yeabsra)</div>
                    <div className="vs-item pov-n-text">
                      More serious first impression
                    </div>
                    <div className="vs-item pov-n-text">
                      Slightly smarter, honestly
                    </div>
                    <div className="vs-item pov-n-text">
                      Wider face, taller, 9k+ Telegram
                    </div>
                    <div className="vs-item pov-n-text">
                      The famous one apparently
                    </div>
                    <div className="vs-item pov-y-text">
                      More serious first impression
                    </div>
                    <div className="vs-item pov-y-text">
                      Slightly smarter, let&apos;s be real
                    </div>
                    <div className="vs-item pov-y-text">
                      Wider face, taller, 9k+ Telegram
                    </div>
                    <div className="vs-item pov-y-text">
                      More popular, data confirmed
                    </div>
                  </div>
                </div>
              </FaqItem>
            </div>
          </section>

          <section id="sec-grow" className="section-block section-split" data-section="grow">
            <div className="section-col-left">
              <h2 className="section-label">Growing up</h2>
            </div>
            <div className="section-col-right">
            <FaqItem
              question="Did you share a room growing up?"
            >
              <span className="pov-n-text">
                Yes, same room. And same class all the way through school until
                college, where we finally got separate classes. Honestly that was
                one of the best things that happened. Very advantageous. I&apos;ll
                just say that.
              </span>
              <span className="pov-y-text">
                Yes, same room growing up. Same class all through school too,
                right until college when we finally got separate ones. That
                separation was actually great. Very useful. I&apos;ll leave it
                there.
              </span>
            </FaqItem>

            <FaqItem
              question="Same friend group?"
            >
              <span className="pov-n-text">
                Same friend group for the most part, still now. Apart from dorm
                mates at college it&apos;s always been shared. It&apos;s easy:
                people who meet me tend to get along with Yeabsra easily too. We
                have the same vibe so it just works.
              </span>
              <span className="pov-y-text">
                Mostly yes, same group even now. Besides dorm friends at college,
                we&apos;ve always shared. When people meet one of us they
                usually click with the other too. Same energy makes it easy.
              </span>
            </FaqItem>

            <FaqItem
              question="Did your parents dress you the same?"
            >
              <span className="pov-n-text">
                Yes, as kids. We stopped in high school. Being the center of
                attention everywhere you go is uncomfortable. Matching outfits
                are cute at age 5. At 15 it&apos;s just a lot. We wanted to
                exist as individuals, not as &quot;the twins in matching
                clothes.&quot;
              </span>
              <span className="pov-y-text">
                Yes when we were kids. Stopped in high school. Walking into every
                room and becoming the instant center of attention just because of
                matching clothes gets exhausting. We stopped and never looked
                back.
              </span>
            </FaqItem>

            <FaqItem
              question="Do you fight?"
            >
              <span className="pov-n-text">
                As kids? Full WWE wrestling matches, I&apos;m not even joking.
                Now it&apos;s mostly word fights, which is natural between any
                siblings. One of our friends actually suggested we buy boxing
                gloves so we can settle things more efficiently. Both for sport
                and conflict resolution. We&apos;re seriously considering it.
              </span>
              <span className="pov-y-text">
                Lol. As kids we had full wrestling matches. Now it&apos;s
                arguments, words, normal sibling stuff. One friend suggested we
                just buy boxing gloves and make it official. Honestly not a bad
                idea. Would solve things faster.
              </span>
            </FaqItem>
            </div>
          </section>

          <section id="sec-myth" className="section-block section-split" data-section="myth">
            <div className="section-col-left">
              <h2 className="section-label">Myths &amp; magic</h2>
            </div>
            <div className="section-col-right">
            <FaqItem
              question="Do you feel each other's pain?"
            >
              <span className="pov-n-text">
                No. Absolutely not. We&apos;re people, not a magic trick. If
                Yeabsra stubs his toe, I feel exactly nothing. That&apos;s not
                how biology works. This question is probably the number one
                reason I made this site.
              </span>
              <span className="pov-y-text">
                No. We are actual human beings, not a supernatural phenomenon. If
                Natnael gets hurt, I feel nothing. Zero. Please understand this.
                It&apos;s not magic, it&apos;s biology.
              </span>
            </FaqItem>

            <FaqItem
              question="Do you have a secret twin language?"
            >
              <span className="pov-n-text">
                Not a language, but we definitely communicate differently. A look,
                a facial expression, a small body movement, and I already know
                what he&apos;s thinking. Finishing each other&apos;s sentences
                happens sometimes but it&apos;s random, not something we do on
                purpose.
              </span>
              <span className="pov-y-text">
                Not a formal language. But we understand each other through looks
                and expressions in a way other people can&apos;t. We just read
                each other well. Finishing sentences happens occasionally but
                it&apos;s not something we control, it just happens.
              </span>
            </FaqItem>

            <FaqItem
              question="What's the most similar thing about you?"
            >
              <span className="pov-n-text">
                Our voices. Even I sometimes can&apos;t tell which voice is mine
                on a recording. People on the phone have no idea which of us
                they&apos;re talking to. We don&apos;t always correct them.
                It&apos;s just easier that way.
              </span>
              <span className="pov-y-text">
                Our voices, without question. Even we get confused sometimes
                listening to recordings. People on calls genuinely can&apos;t
                tell us apart. We let it slide. It&apos;s fine.
              </span>
            </FaqItem>
            </div>
          </section>

          <section id="sec-fun" className="section-block section-split" data-section="fun">
            <div className="section-col-left">
              <h2 className="section-label">Fun</h2>
            </div>
            <div className="section-col-right">
            <FaqItem
              question="Have you ever switched places?"
            >
              <span className="pov-n-text">
                We&apos;ve covered each other&apos;s entire classes, not just one
                person, the whole class. Only people who knew us really well
                figured it out. We&apos;ve also used each other&apos;s photos
                for... non-governmental purposes. I&apos;d rather not say more
                for legal reasons. Advantage of having a copy of yourself.
              </span>
              <span className="pov-y-text">
                Yes. We&apos;ve sat in each other&apos;s full classes before.
                Most people had no idea. We&apos;ve also used each other&apos;s
                photos in certain situations, not going into detail. Legal
                reasons. Let&apos;s just say having an identical twin is
                occasionally very convenient.
              </span>
            </FaqItem>

            <FaqItem
              question="Same taste in music, food, movies?"
            >
              <span className="pov-n-text">
                Almost identical. If I discover something, he&apos;ll probably
                like it too. If he does something, I end up doing it as well.
                95%+ overlap across everything. I don&apos;t even need to ask
                him what he thinks most of the time, I already know.
              </span>
              <span className="pov-y-text">
                Almost identical across the board. If I get into something,
                Natnael will probably end up liking it too, and vice versa. Our
                taste is so aligned it&apos;s almost predictable. 95%+ overlap,
                easily.
              </span>
            </FaqItem>

            <FaqItem
              question="What about dating?"
            >
              <span className="pov-n-text">
                We&apos;re both single. We both have the same principle: date to
                marry, not here for games. Right now is a locking-in time, focus
                first. No need to worry about that department for now.
              </span>
              <span className="pov-y-text">
                Both single. Same principle, date to marry, not to waste time.
                Right now is about locking in and building. The rest comes
                later.
              </span>
            </FaqItem>

            <FaqItem
              question="Do you ever wish you weren't twins?"
            >
              <span className="pov-n-text">
                Never. Not even once. Having someone who has lived every
                experience alongside me, who understands without me having to
                explain anything, who I&apos;ve gone through everything with.
                That&apos;s irreplaceable. I can&apos;t imagine being an only
                child. Thank God for it.
              </span>
              <span className="pov-y-text">
                Never. I can&apos;t even imagine it. Having someone who truly
                gets your whole life without you having to explain yourself is
                something most people don&apos;t get. I wouldn&apos;t trade it for anything.
              </span>
            </FaqItem>

            <FaqItem
              question="Best part about being a twin?"
            >
              <span className="pov-n-text">
                Having someone who gets my whole life without me needing to say a
                word. Someone who&apos;s been there for every experience. The
                shared understanding, the fact that I&apos;m never really alone
                in anything. That, and the whole class-covering thing.
              </span>
              <span className="pov-y-text">
                The fact that there&apos;s someone in the world who has
                experienced life almost exactly as I have, at the same time, in
                the same way. That level of understanding is rare. Also the
                practical advantages are real, but mainly the first thing.
              </span>
            </FaqItem>
            </div>
          </section>
          </main>

          <footer className="footer footer-split">
            <div className="footer-col-left" aria-hidden />
            <div className="footer-col-right footer-credits">
              <p>
                <strong>Natnael & Yeabsra Ashebir</strong>
                <br />
                We made this so we never have to answer these questions again.
              </p>
            </div>
          </footer>
        </div>
      </div>
  )
}
