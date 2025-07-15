import { useState, useRef, useEffect } from 'react';

export default function TerminalAI() {
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function getApiConfig() {
    const useDeepSeek = import.meta.env.VITE_USE_DEEPSEEK === 'true';
    return useDeepSeek
      ? {
          key: import.meta.env.VITE_DEEPSEEK_KEY,
          url: 'https://api.deepseek.com/chat/completions',
          model: 'deepseek-chat',
        }
      : {
          key: import.meta.env.VITE_OPENAI_KEY,
          url: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-3.5-turbo',
        };
  }

  async function askAIStream(prompt: string, onToken: (token: string) => void): Promise<void> {
    const { key, url, model } = getApiConfig();
    if (!key) {
      onToken('Error: Missing API key. Check .env');
      return;
    }

    const systemPrompt = `
You are Viraj Murab's personal assistant. Respond in a friendly, human way using normal conversation. 
Keep responses concise and to the point. Avoid terminal jargon and hacker metaphors.

About Viraj:
- Software developer skilled in React, Python, and web development
- Created PriceTrackingWebScraper, PoeltlSolver, and BuddyCrush
- Enjoys building user-friendly apps and retro computing
 - This is a bit about me: I'm currently working under Professor Mahmoud at the University of Alberta as a Machine Learning Assistant, where I published a paper on Real-Time Reinforcement Learning (RTRL). My work involved building eLSTM and RTU models, applying Actor-Critic methods to POMDPs, and developing scalable RL systems.

• Interned at Questrade as FS dev on insurance microservices(Toronto)
• Starting at Air Canada in July as Full Stack Developer in Toronto
• Solved 730+ LeetCode problems (contest rating: 1600) - Profile: https://leetcode.com/u/VariableViking/
• Built PalCrush social app (Next.js/React/TS) had 300+ users day one, Top 50 Product Hunt - Live Demo(https://www.linkedin.com/feed/update/urn:li:activity:7294261590017593345/)
• Built low-level C systems (UNIX shell, file system, MapReduce)
• Led team of 6 on distributed social platform as Product Owner

Just answer questions naturally like a helpful colleague. No theatrics.
    `.trim();

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        onToken(`Error: ${errText.slice(0, 100)}`);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value);
        const chunks = buffer.split('data: ');
        buffer = chunks.pop() || '';
        
        for (const chunk of chunks) {
          if (chunk.trim() === '[DONE]') return;
          try {
            const data = JSON.parse(chunk);
            const token = data.choices[0]?.delta?.content || '';
            if (token) onToken(token);
          } catch {
            // Skip incomplete JSON chunks
          }
        }
      }
    } catch (err: any) {
      onToken(`Error: ${err.message || 'Network issue'}`);
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input;
    setInput('');
    setLog(prev => [...prev, `viraj@vm.sh ~ $ ${userInput}`]);
    setLoading(true);

    // Add empty response line
    setLog(prev => [...prev, '']);
    const responseIndex = log.length + 1;

    await askAIStream(userInput, (token) => {
      setLog(prev => {
        const newLog = [...prev];
        newLog[responseIndex] = (newLog[responseIndex] || '') + token;
        return newLog;
      });
    });

    setLoading(false);
  };

  return (
    <div
      style={{
        background: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        height: '100%',
        padding: 16,
      }}
    >
      <div style={{ overflowY: 'auto', maxHeight: 300 }}>
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {loading && <div>Thinking...</div>}
      </div>

      <div style={{ color: '#aaa', fontSize: 13, marginTop: 12, marginBottom: 4 }}>
        Ask me anything about Viraj!🤖
      </div>
      <form onSubmit={handleSend} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <span style={{ color: '#0f0' }}>viraj@vm.sh ~ $</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            background: 'black',
            color: 'white',
            border: 'none',
            outline: 'none',
            fontFamily: 'monospace',
            fontSize: 16,
            flex: 1,
          }}
          disabled={loading}
          autoFocus
        />
      </form>
    </div>
  );
}