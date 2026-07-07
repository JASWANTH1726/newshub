export default function NewsCard({ article }) {
  const formatDate = dateStr => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="news-card">
      <div className="news-card-inner">
        {/* Front */}
        <div className="news-card-front">
          {article.urlToImage
            ? <img src={article.urlToImage} alt="news" className="thumb" loading="lazy" onError={e => { e.target.style.display='none'; }} />
            : <div className="no-thumb">📰</div>
          }
          <div className="body">
            <div className="src">{article.source?.name || 'Unknown'}</div>
            <h4>{article.title}</h4>
            <div className="foot">
              <span className="date">📅 {formatDate(article.publishedAt)}</span>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-btn" onClick={e => e.stopPropagation()}>
                Read →
              </a>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="news-card-back">
          <div className="back-src">{article.source?.name || 'Unknown'}</div>
          <div className="back-title">{article.title}</div>
          <div className="back-desc">{article.description || 'No description available.'}</div>
          <div className="back-foot">
            <span className="back-date">📅 {formatDate(article.publishedAt)}</span>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-btn" onClick={e => e.stopPropagation()}>
              Read Full →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
