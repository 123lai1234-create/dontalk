import { useEffect } from 'react';

function StockPage() {
  useEffect(() => {
    document.title = '台股均線買賣訊號系統';
  }, []);

  const src = `${import.meta.env.BASE_URL}stock-app/index.html`;

  return (
    <iframe
      src={src}
      title="台股均線買賣訊號系統"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
      }}
    />
  );
}

export default StockPage;
