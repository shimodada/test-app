import React, { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

type Message = {
  id: number;
  content: string;
  created_at: string;
};

function App(): React.ReactElement {
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('id, content, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(`読み込みに失敗しました: ${fetchError.message}`);
      setMessages([]);
    } else {
      setMessages(data ?? []);
    }
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) {
      setError('メッセージを入力してください。');
      return;
    }

    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('messages')
      .insert({ content: content.trim() });

    if (insertError) {
      setError(`保存に失敗しました: ${insertError.message}`);
    } else {
      setContent('');
      await fetchMessages();
    }

    setSaving(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">WKPJapan Notes</div>
        <div className="meta">Supabase経由でメッセージを保存・表示します</div>
      </header>

      <main className="app-main">
        <section className="app-panel">
          <h1 className="panel-title">メッセージを登録</h1>
          <p className="panel-description">このメッセージは Supabase の <code>messages</code> テーブルに保存されます。将来的にはプレミアムチャットやリード管理機能としてマネタイズできます。</p>

          <form className="message-form" onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ここにメッセージを入力します..."
              rows={5}
              aria-label="メッセージ"
            />
            <div className="form-actions">
              <button className="button button-primary" type="submit" disabled={saving}>
                {saving ? '保存中...' : 'メッセージを保存'}
              </button>
              <button className="button button-secondary" type="button" onClick={() => setContent('')}>
                リセット
              </button>
            </div>
          </form>

          {error && <div className="alert">{error}</div>}
        </section>

        <section className="app-panel">
          <div className="panel-header">
            <h2>保存されたメッセージ</h2>
            <button className="button button-ghost" type="button" onClick={fetchMessages}>
              再読み込み
            </button>
          </div>

          {loading ? (
            <div className="loading">読み込み中...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">まだメッセージがありません。最初のメッセージを保存してください。</div>
          ) : (
            <ul className="message-list">
              {messages.map((message) => (
                <li key={message.id} className="message-card">
                  <p>{message.content}</p>
                  <time>{new Date(message.created_at).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>将来は「課金メッセージ保存」「通知」「分析レポート」などの機能追加で収益化できます。</p>
      </footer>
    </div>
  );
}

export default App;
