// app/page.tsx
export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '50px', lineHeight: '1.6' }}>
      <h1>MZPrimer Ads Engine 🚀</h1>
      <p>Status: <strong>Online</strong></p>
      <hr />
      <h3>API Endpoints:</h3>
      <ul>
        <li><a href="/api/fb-catalog">Facebook Catalog (CSV)</a></li>
        <li><a href="/api/google-feed">Google Ads Feed (CSV)</a></li>
        <li><a href="/api/og?symbol=BTCUSD">Image Generator (facebook)</a></li>
        <li><a href="/api/og-google?symbol=BTCUSD">Image Generator (google)</a></li>
      </ul>
    </div>
  );
}