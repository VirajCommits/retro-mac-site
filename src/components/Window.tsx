import { useState, useRef, useEffect } from 'react'
import type { WindowState } from '../types'
import TerminalAI from './TerminalAI';

interface WindowProps {
  window: WindowState
  onClose: () => void
  onUpdate: (updates: Partial<WindowState>) => void
  onBringToFront: () => void
}

const Window = ({ window, onClose, onUpdate, onBringToFront }: WindowProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [closeHover, setCloseHover] = useState(false);

  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 180;

  // Helper to enlarge window for basketball journey
  const enlargeForBasketball = () => {
    const targetWidth  = Math.max(window.size.width, 700);
    const targetHeight = Math.max(window.size.height, 550);
    onUpdate({
      size: { width: targetWidth, height: targetHeight }
    });
  };

  // --- DRAG LOGIC ---
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only start drag if not clicking a window-control button
    if (
      target === e.currentTarget ||
      (typeof target.className === 'string' && target.className.includes('window-titlebar'))
    ) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onBringToFront();
    } else if (
      typeof target.classList !== 'undefined' &&
      !target.classList.contains('window-control') &&
      target.closest('.window-titlebar')
    ) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onBringToFront();
    }
  }

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      onUpdate({
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      })
    };
    const handleUp = () => setIsDragging(false);
    globalThis.addEventListener('mousemove', handleMove);
    globalThis.addEventListener('mouseup', handleUp);
    return () => {
      globalThis.removeEventListener('mousemove', handleMove);
      globalThis.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragOffset, onUpdate]);

  // --- RESIZE LOGIC ---
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
    });
    onBringToFront();
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(MIN_HEIGHT, resizeStart.height + (e.clientY - resizeStart.y));
      onUpdate({
        size: {
          width: newWidth,
          height: newHeight
        }
      });
    };
    const handleUp = () => setIsResizing(false);
    globalThis.addEventListener('mousemove', handleMove);
    globalThis.addEventListener('mouseup', handleUp);
    return () => {
      globalThis.removeEventListener('mousemove', handleMove);
      globalThis.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing, resizeStart, onUpdate]);

  // --- CONTENT RENDER ---
  const renderContent = () => {
    switch (window.type) {
      case 'about':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, minHeight: 0 }}>
            <h1 style={{ fontFamily: 'inherit', fontSize: 28, margin: 0 }}>About Me</h1>
            <div style={{ display: 'flex', gap: 24, marginTop: 16, flex: 1, minHeight: 0 }}>
              <div style={{ flex: 1, fontSize: 16, lineHeight: 1.6 }}>
                <p>I'm a passionate developer and machine learning enthusiast. I will be joining Air Canada as a Full Stack Developer in Toronto starting July 2024.</p>
                <p>I worked as a Machine Learning Assistant under Professor Rupam Mahmoud at the University of Alberta, where I published research on Real-Time Reinforcement Learning (RTRL). My work includes building eLSTM and RTU models, applying Actor-Critic methods to POMDPs, and developing scalable RL systems.</p>
                <p>Previously, I interned at Questrade in Toronto as a Full Stack Developer, building insurance microservices. I have a strong foundation in systems programming, having built low-level C projects like a UNIX shell, file system, and MapReduce engine.</p>
                <p>I love solving challenging problems—I've tackled 730+ LeetCode questions (contest rating: 1600, <a href="https://leetcode.com/u/VariableViking/" target="_blank" rel="noopener noreferrer">profile</a>)—and enjoy building products that make an impact. My social app PalCrush (Next.js/React/TS) reached 300+ users on launch day and was a Top 50 Product Hunt project (<a href="https://www.linkedin.com/feed/update/urn:li:activity:7294261590017593345/" target="_blank" rel="noopener noreferrer">live demo</a>). As a Product Owner, I led a team of six to deliver a distributed social platform.</p>
                <p>I thrive at the intersection of software engineering, machine learning, and creative product development.</p>
              </div>
              <img src="./potrait.png" alt="urab portrait" width={188} height={256} style={{ filter: 'grayscale(1)', border: '2px solid #111', alignSelf: 'flex-start' }} />
            </div>
          </div>
        )
      case 'experience':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, minHeight: 0 }}>
            <h2 style={{ fontFamily: 'inherit', fontSize: 22, margin: 0 }}>Experience</h2>
            <ul style={{ marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
              <li><b>Incoming Full Stack Developer, Air Canada (Toronto)</b><br/>
                Starting July 2024
              </li>
              <li><b>Machine Learning Assistant, University of Alberta (with Prof. Rupam Mahmoud)</b><br/>
                Published research on Real-Time Reinforcement Learning (RTRL). Built eLSTM and RTU models, applied Actor-Critic methods to POMDPs, and developed scalable RL systems for real-time and batch learning.
              </li>
              <li><b>Full Stack Developer Intern, Questrade (Toronto)</b><br/>
                Built and maintained insurance microservices (C#, Node.js, AWS ECS). Enhanced policy flows, improved reliability, and refactored CI/CD pipelines. Collaborated with cross-functional teams in Agile sprints.
              </li>
              <li><b>Product Owner & Backend Developer, Social Distribution (UAlberta)</b><br/>
                Led a team of 6 to deliver a distributed social platform. Designed RESTful APIs, integrated privacy/auth, and managed Agile workflow.
              </li>
              <li><b>Personal Projects</b><br/>
                <ul style={{ marginTop: 4, marginBottom: 4 }}>
                  <li><b>PalCrush</b>: Social app (Next.js/React/TS), 300+ users on launch, Top 50 Product Hunt (<a href="https://www.linkedin.com/feed/update/urn:li:activity:7294261590017593345/" target="_blank" rel="noopener noreferrer">demo</a>)</li>
                  <li><b>LeetCode</b>: Solved 730+ problems (contest rating: 1600, <a href="https://leetcode.com/u/VariableViking/" target="_blank" rel="noopener noreferrer">profile</a>)</li>
                  <li>Built low-level C systems: UNIX shell, file system, MapReduce engine</li>
                </ul>
              </li>
            </ul>
          </div>
        )
      case 'resume': {
        const [resumeType, setResumeType] = useState<'none' | 'mle' | 'fullstack'>('none');
        let resumeSrc = '';
        if (resumeType === 'mle') resumeSrc = '/VirajMurabMLE.pdf';
        if (resumeType === 'fullstack') resumeSrc = '/VirajMurabL.pdf';
        const isMobile = typeof globalThis !== 'undefined' && globalThis.window && globalThis.window.innerWidth <= 600;
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? 0 : 24, minHeight: 0 }}>
            <h2 style={{ fontFamily: 'inherit', fontSize: 22, margin: 0, padding: isMobile ? '12px' : 0 }}>Résumé</h2>
            {resumeType === 'none' && (
              <div style={{ margin: isMobile ? '12px 0' : '16px 0' }}>
                <span>Which resume would you like to view?</span>
                <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                  <button onClick={() => setResumeType('mle')}>MLE Resume</button>
                  <button onClick={() => setResumeType('fullstack')}>FullStack Resume</button>
                </div>
              </div>
            )}
            {resumeType !== 'none' && (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => setResumeType('none')}
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 12,
                    background: '#fff',
                    color: '#111',
                    border: '2px solid #111',
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    fontSize: 14,
                    padding: '2px 14px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 #111',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  ← Back
                </button>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  {isMobile ? (
                    <>
                      <div style={{ textAlign: 'center', fontSize: 16, margin: '32px 0' }}>
                        PDF viewing is not supported on mobile browsers.<br />
                        <a href={resumeSrc} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-block',
                          marginTop: 16,
                          padding: '10px 24px',
                          background: '#111',
                          color: '#fff',
                          borderRadius: 6,
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          fontSize: 16,
                          boxShadow: '2px 2px 0 #111',
                        }}>
                          Open Resume in New Tab
                        </a>
                      </div>
                    </>
                  ) : (
                    <iframe
                      src={resumeSrc}
                      title="Resume PDF"
                      width="100%"
                      height="100%"
                      style={{
                        filter: 'grayscale(1)',
                        border: 'none',
                        flex: 1,
                        minHeight: 0,
                        margin: 0,
                        padding: 0,
                        display: 'block',
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )
      }
      case 'terminal':
        return <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}><TerminalAI /></div>;
      case 'fun': {
        const [funType, setFunType] = useState<'none' | 'cycling' | 'basketball'>('none');
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, minHeight: 0 }}>
            <h2 style={{ fontFamily: 'inherit', fontSize: 22, margin: 0 }}>The Fun Bits</h2>
            {funType === 'none' && (
              <div style={{ margin: '24px 0', textAlign: 'center' }}>
                <span>Which journey would you like to see?</span>
                <div style={{ marginTop: 16, display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setFunType('basketball');
                      enlargeForBasketball();
                    }}
                    style={{
                      background: '#fff',
                      color: '#111',
                      border: '2px solid #111',
                      fontFamily: 'inherit',
                      fontWeight: 'bold',
                      fontSize: 15,
                      padding: '6px 18px',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0 #111',
                      transition: 'background 0.1s, color 0.1s',
                    }}
                  >
                    Basketball Journey
                  </button>
                  <button
                    onClick={() => {
                      setFunType('cycling');
                      enlargeForBasketball();
                    }}
                    style={{
                      background: '#fff',
                      color: '#111',
                      border: '2px solid #111',
                      fontFamily: 'inherit',
                      fontWeight: 'bold',
                      fontSize: 15,
                      padding: '6px 18px',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0 #111',
                      transition: 'background 0.1s, color 0.1s',
                    }}
                  >
                    A Cycling Tale
                  </button>
                </div>
              </div>
            )}
            {funType === 'cycling' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => setFunType('none')}
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 12,
                    background: '#fff',
                    color: '#111',
                    border: '2px solid #111',
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    fontSize: 14,
                    padding: '2px 14px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 #111',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  ← Back
                </button>
                <div style={{ fontSize: 16, lineHeight: 1.7 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                    {/* Panel 1: The Bike */}
                    <div style={{ width: 220, textAlign: 'center' }}>
                      <img src="/cycling/IMG_2314.png" alt="Trek Bike" style={{ width: '100%', border: '2px solid #111', background: '#fff', marginBottom: 8 }} />
                      <div style={{ fontSize: 15, fontWeight: 'bold' }}>My Trek XCaliber 8 Bike</div>
                      <div style={{ fontSize: 13 }}>Bought in Toronto during my Questrade internship. Has to be one of the most expensive purchases of my life</div>
                    </div>
                    {/* Panel 2: The Plan */}
                    <div style={{ width: 220, textAlign: 'center' }}>
                      <img src="/cycling/big_idea.png" alt="Planning Ride" style={{ width: '100%', border: '2px solid #111', background: '#fff', marginBottom: 8 }} />
                      <div style={{ fontSize: 15, fontWeight: 'bold' }}>The Big Idea</div>
                      <div style={{ fontSize: 13 }}>One random weekend I decided Let’s ride from Oakville to Niagara Falls!</div>
                    </div>
                    {/* Panel 3: The Journey */}
                    <div style={{ width: 220, textAlign: 'center' }}>
                      <img src="/cycling/tough.png" alt="On the Road" style={{ width: '100%', border: '2px solid #111', background: '#fff', marginBottom: 8 }} />
                      <div style={{ fontSize: 15, fontWeight: 'bold' }}>100km Adventure</div>
                      <div style={{ fontSize: 13 }}>Oakville → Niagara. It was tough but I never gave up.</div>
                    </div>
                    {/* Panel 4: The Arrival */}
                    <div style={{ width: 220, textAlign: 'center' }}>
                      <img src="/cycling/niagra.png" alt="Arriving at Niagara" style={{ width: '100%', border: '2px solid #111', background: '#fff', marginBottom: 8 }} />
                      <div style={{ fontSize: 15, fontWeight: 'bold' }}>Made it!</div>
                      <div style={{ fontSize: 13 }}>Finally reached Niagara Falls. Unbeatable feeling!</div>
                    </div>
                    {/* Panel 5: The View */}
                    <div style={{ width: 220, textAlign: 'center' }}>
                      <img src="/cycling/view.png" alt="Niagara View" style={{ width: '100%', border: '2px solid #111', background: '#fff', marginBottom: 8 }} />
                      <div style={{ fontSize: 15, fontWeight: 'bold' }}>The View</div>
                      <div style={{ fontSize: 13 }}>Niagara in all its glory.It was worth every pedal stroke.</div>
                    </div>
                    {/* Panel 6: The Video */}
                    <div style={{ width: 220, textAlign: 'center' }}>
                      <video
                        src="/cycling/trip-browser-noaudio.mp4"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', border: '2px solid #111', background: '#fff', marginBottom: 8 }}
                      />
                      <div style={{ fontSize: 15, fontWeight: 'bold' }}>Proof of the Ride</div>
                      <div style={{ fontSize: 13 }}>A little video from the journey. Memories for life!</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 32, textAlign: 'center', fontSize: 15, color: '#333' }}>
  <b>What I learned:</b> Some of the best things start with a random idea quick planning.  
  <br />
  Just keep going.You’ll be really surprised to know how far you can actually get!
</div>

                </div>
              </div>
            )}
            {funType === 'basketball' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 1800 }}>
                <button
                  onClick={() => setFunType('none')}
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 12,
                    background: '#fff',
                    color: '#111',
                    border: '2px solid #111',
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    fontSize: 14,
                    padding: '2px 14px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 #111',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  ← Back
                </button>
                <div style={{
                  maxWidth: isMobile ? '80vw' : 600,
                  margin: isMobile ? '0 auto' : '0 auto',
                  background: '#fff',
                  border: '2px solid #111',
                  boxShadow: '2px 2px 0 #111',
                  padding: 24,
                  fontSize: 16,
                  color: '#222',
                  lineHeight: 1.7,
                  fontFamily: 'inherit',
                  borderRadius: 4,
                  marginTop: 16
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, textAlign: 'center' }}>My Basketball Journey</div>
                  <p>I was born and brought up in Dehradun(a city in North India). I was fortunate enough to have a basketball hoop at my house which is rare in India unlike in Western countries. Even more special, I was coached by Mr. Vinod Vachani. He had worked with NBA coaches from teams like the Warriors and the Mavericks back in the 90s. Later, he returned to India to coach, and I happened to cross paths with him.</p>
                  <div style={{ width: 260, margin: '24px auto 0 auto', textAlign: 'center' }}>
                    <img
                      src="/basketball/intro2.PNG"
                      alt="Basketball Intro"
                      style={{
                        width: '100%',
                        height: 300, // or any height you prefer
                        objectFit: 'cover',
                        objectPosition: 'center',
                        border: '2px solid #111',
                        background: '#fff',
                        marginBottom: 8,
                        borderRadius: 6
                      }}
                    />
                    <div style={{ fontWeight: 'bold', fontSize: 15 }}>Where it all started</div>
                    {/* <div style={{ fontSize: 14 }}>Where the journey started. My home, my hoop, my story.</div> */}
                  </div>
                  <p>I took an interest in basketball in 9th grade and I became extremely ambitious about playing. My goal was to make it to the NBA and nobody could tell me otherwise. For six months, I played basketball every single day no days off.I was driven by the Mamba mentality which was the idea of becoming the best version of yourself. I was determined.</p>
                  {/* Video 1: Only play when in view */}
                  <VideoInView
                    src="/basketball/play.mp4"
                    width={340}
                    height={420}
                  />
                  <p>I used to worship Kyrie Irving.He was my idol. All I wanted was to have crazy handles like him.Everyday after school, I'd go straight to YouTube and watch his high school and college highlights. I couldn’t believe how easily he got past defenders and scored against guys way taller than him. It blew my mind. I just kept thinking, I want to move like that.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, margin: '24px 0' }}>
                    <img
                      src="/basketball/kyrie.jpg"
                      alt="Kyrie Irving"
                      style={{
                        width: 180,
                        height: 260,
                        objectFit: 'cover',
                        objectPosition: 'center',
                        border: '2px solid #111',
                        background: '#fff',
                        marginBottom: 8,
                        borderRadius: 6,
                        display: 'block'
                      }}
                    />
                    <img
                      src="/basketball/intro_.PNG"
                      alt="Basketball Intro"
                      style={{
                        width: 180,
                        height: 260,
                        objectFit: 'cover',
                        objectPosition: 'center',
                        border: '2px solid #111',
                        background: '#fff',
                        marginBottom: 8,
                        borderRadius: 6,
                        display: 'block'
                      }}
                    />
                  </div>
                  <p>So I got to work. Every day after school I would practice for hours trying to get quicker and sharper with the ball. At first I kept fumbling. I’d mess up basic moves, get annoyed, sometimes even angry but I kept going. It became a habit. I got used to failing. And slowly, things started to change. In a few months I could do in-and-outs and crossovers at real speed. I could actually get past people just like Kyrie. That moment hit hard. I was happy. I even cried a little. That’s when I really understood that getting good at something takes time, and a lot of patience.</p>
                  {/* Video 2: Only play when in view */}
                  <VideoInView
                    src="/basketball/hard_.mp4"
                    width={340}
                    height={420}
                  />
                  <p>Basketball was and still is my escape. Whenever things got stressful in undergrad, whether it was coursework or job hunting, I’d hit the court. It never let me down. The game taught me resilience. It showed me that if you stick with something and keep putting in the work, you’ll get better. Simple as that.</p>

                  <p>I saw myself getting better every day, beating the pros and honing my craft. I realized we should all chase excellence instead of obsessing over the end result and ALWAYS focus on the process. Although I couldn’t make it to the NBA, the results I’ve seen and the person I’ve become are incredible. I’m proud of myself for even picking up the ball to play. I will always cherish this game!</p>
                  <VideoInView
                    src="/basketball/shoot.mp4"
                    width={340}
                    height={420}
                  />
                  
                  <div style={{ marginTop: 18, textAlign: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Follow my basketball journey on Instagram: </span>
                    <a href="https://www.instagram.com/viraj_ballin/" target="_blank" rel="noopener noreferrer" style={{
                      color: '#111',
                      background: '#e0e0e0',
                      border: '1.5px solid #111',
                      padding: '2px 10px',
                      borderRadius: 3,
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      boxShadow: '1px 1px 0 #111',
                      marginLeft: 4
                    }}>
                      @viraj_ballin
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }
      default:
        return <div style={{ flex: 1 }}>Unknown window type</div>
    }
  }

  const isMobile = typeof globalThis !== 'undefined' && globalThis.window && globalThis.window.innerWidth <= 600;

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: isMobile ? '3vw' : window.position.x,
        top: isMobile ? 48 : window.position.y, // 48px header
        width: isMobile ? '94vw' : window.size.width,
        height: isMobile ? 'calc(100vh - 48px)' : window.size.height,
        maxWidth: isMobile ? '94vw' : undefined,
        maxHeight: isMobile ? 'calc(100vh - 48px)' : undefined,
        zIndex: window.zIndex || 1,
        cursor: isDragging ? 'grabbing' : 'default',
        display: 'flex',
        flexDirection: 'column',
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        position: isMobile ? 'fixed' : 'absolute',
      }}
      onMouseDown={handleMouseDown}
      tabIndex={0}
      aria-label={window.title}
    >
      <div className="window-titlebar" onMouseDown={handleMouseDown} style={{ display: 'flex', alignItems: 'center', position: 'relative', height: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          {/* Red Close Button */}
          <div
            className="window-control"
            style={{
              width: 14,
              height: 14,
              background: '#ff5f56',
              border: '1.5px solid #111',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '1px 1px 0 #111',
              transition: 'background 0.1s',
            }}
            onClick={onClose}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            title="Close"
            tabIndex={0}
            aria-label="Close window"
          >
            {closeHover && (
              <svg width="100%" height="100%" viewBox="0 0 14 14">
                <line x1="4" y1="4" x2="10" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="4" x2="4" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {/* Yellow Minimize Button */}
          <div
            className="window-control"
            style={{
              width: 14,
              height: 14,
              background: '#ffbd2e',
              border: '1.5px solid #111',
              borderRadius: '50%',
              boxShadow: '1px 1px 0 #111',
              marginLeft: 0,
            }}
            title="Minimize (not implemented)"
          />
          {/* Green Zoom Button */}
          <div
            className="window-control"
            style={{
              width: 14,
              height: 14,
              background: '#27c93f',
              border: '1.5px solid #111',
              borderRadius: '50%',
              boxShadow: '1px 1px 0 #111',
              marginLeft: 0,
            }}
            title="Zoom (not implemented)"
          />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontFamily: 'inherit' }}>{window.title}</div>
      </div>
      <div className="window-content" style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </div>
      {!isMobile && (
        <div
          className="window-resize-handle"
          onMouseDown={handleResizeMouseDown}
          style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'nwse-resize', zIndex: 10 }}
          aria-label="Resize window"
        />
      )}
    </div>
  )
}

export default Window

function VideoInView({ src, width, height }: { src: string, width: number, height: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        },
        { threshold: 0.25 }
      );
      observer.observe(video);
    }
    return () => {
      if (observer && video) observer.unobserve(video);
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
      <video
        ref={videoRef}
        src={src}
        width={width}
        height={height}
        controls
        loop
        muted
        playsInline
        style={{
          maxWidth: '100%',
          border: '2px solid #111',
          borderRadius: 8,
          background: '#000',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}