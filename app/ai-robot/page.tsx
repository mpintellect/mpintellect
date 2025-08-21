'use client';

import AIRobotCards from '../../components/AIRobotCards';

export default function AIRobotPage() {
  return (
    <>
      <main className="pt-24 px-4 md:px-8 bg-black text-white min-h-screen">
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-6"></h2>
          <AIRobotCards />
        </section>
      </main>
    </>
  );
}