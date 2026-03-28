import { prisma } from '../../lib/prisma';
import { deleteMessage, toggleMessageStatus } from '../actions/messageActions';

export default async function AdminDashboard() {
  let messages = [];
  try {
    messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database connection error or uninitialized:", error);
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '60px', textAlign: 'center', maxWidth: '800px', margin: '60px auto' }}>
        <h2>Database Pending...</h2>
        <p>Please wait for the database tables to be fully constructed.</p>
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '40px', maxWidth: '900px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '30px' }}>
        <h2 className="section-title" style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Customer Inquiries</h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <span style={{ padding: '8px 20px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', color: 'var(--text-primary)', borderRadius: '50px', fontWeight: 'bold' }}>
            Unread: {unreadCount}
          </span>
          <span style={{ padding: '8px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: '50px', fontWeight: 'bold' }}>
            Total: {messages.length}
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem' }}>No messages received yet.</p>
          <p>When customers fill out the Contact form, their inquiries will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '16px', 
              padding: '24px',
              background: msg.status === 'UNREAD' ? 'var(--bg-main)' : 'var(--bg-secondary)',
              transition: 'transform 0.3s ease',
              boxShadow: msg.status === 'UNREAD' ? '0 4px 15px rgba(212, 175, 55, 0.05)' : 'none',
              opacity: msg.status === 'UNREAD' ? 1 : 0.75
            }} className="message-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: msg.status === 'UNREAD' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {msg.name} {msg.status === 'UNREAD' && <span style={{ fontSize: '0.7rem', verticalAlign: 'middle', marginLeft: '8px', background: '#D4AF37', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>NEW</span>}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <form action={toggleMessageStatus.bind(null, msg.id, msg.status)}>
                    <button type="submit" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent' }}>
                      {msg.status === 'UNREAD' ? 'Mark as Read' : 'Unmark'}
                    </button>
                  </form>
                  <form action={deleteMessage.bind(null, msg.id)}>
                    <button type="submit" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d' }}>
                      Trash
                    </button>
                  </form>
                  <a href={`mailto:${msg.contact}`} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem', textDecoration: 'none', marginLeft: '8px' }}>
                    Reply
                  </a>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '1.2rem' }}>📞</span> {msg.contact}
                </p>
              </div>

              <div style={{ padding: '16px', background: msg.status === 'UNREAD' ? 'rgba(212, 175, 55, 0.03)' : 'var(--bg-main)', borderRadius: '12px', borderLeft: `3px solid ${msg.status === 'UNREAD' ? 'var(--accent-primary)' : 'var(--border-subtle)'}` }}>
                <p style={{ margin: 0, lineHeight: '1.6' }}>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
