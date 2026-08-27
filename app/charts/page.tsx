import LiveChartsTerminal from '@/components/LiveChartsTerminal';

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 px-4 flex justify-center">
       <div className="w-full max-w-4xl">
          <LiveChartsTerminal />
       </div>
    </div>
  );
}
