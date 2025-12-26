'use client';

import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mock Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-6 lg:px-12">
        <div className="font-serif text-2xl tracking-widest text-elm-navy">ELM CLINIC</div>
        <nav className="hidden md:flex gap-8 text-sm text-gray-600 tracking-wide">
          <Link href="#" className="hover:text-elm-gold transition-colors">初めての方へ</Link>
          <Link href="#" className="hover:text-elm-gold transition-colors">施術メニュー</Link>
          <Link href="#" className="hover:text-elm-gold transition-colors">料金表</Link>
          <Link href="#" className="hover:text-elm-gold transition-colors">ドクター紹介</Link>
          <Link href="#" className="hover:text-elm-gold transition-colors">アクセス</Link>
        </nav>
        <button className="bg-elm-gold text-white px-6 py-2 rounded-full text-sm hover:bg-opacity-90 transition-opacity">
          WEB予約
        </button>
      </header>

      {/* Mock Hero */}
      <main className="pt-24 pb-20">
        <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-20">
          <div className="relative h-[600px] w-full bg-[#f8f5f2] rounded-sm overflow-hidden flex items-center justify-center">
            {/* Abstract background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent" />

            <div className="relative z-10 text-center space-y-6 max-w-2xl px-4">
              <p className="text-elm-gold tracking-[0.2em] text-sm uppercase">Medical Beauty Clinic</p>
              <h1 className="text-4xl md:text-6xl font-serif text-elm-navy leading-tight">
                美しさは、<br />医学と感性から。
              </h1>
              <p className="text-gray-500 leading-relaxed">
                エルムクリニックは、メスを使わない美容医療を専門とする<br />
                美容皮膚科クリニックです。
              </p>
            </div>
          </div>
        </section>

        {/* Mock Content Sections */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif text-elm-navy">Treatment Menu</h2>
            <p className="text-gray-400 text-sm">施術メニュー</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "医療アートメイク", desc: "自然で美しい仕上がり" },
              { title: "ボトックス注射", desc: "表情じわの改善に" },
              { title: "ヒアルロン酸", desc: "リフトアップ・形成" }
            ].map((item, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-50 group cursor-pointer relative overflow-hidden rounded-sm hover:shadow-xl transition-shadow duration-300">
                <div className="absolute inset-0 bg-elm-navy/5 group-hover:bg-elm-navy/10 transition-colors" />
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-white/90 to-transparent">
                  <h3 className="text-xl font-serif text-elm-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Chat Widget Container */}
      <ChatWidget />
    </div>
  );
}
