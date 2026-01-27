import { FeedSnippet } from "@/components/feed/FeedSnippet";
import { useState, useEffect, useRef } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

const Feed = () => {
  const { safeAreaTopInset } = useSettingsStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const snippets = [
    {
      id: "1",
      username: "trapmaster",
      trackName: "Dark Drill Beat",
      genre: "Drill",
      likes: 2341,
      comments: 89,
      gradientBg: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600",
      description: "Новый дрилл бит в стиле NY 🔥 Записывал в студии на Маяковской. Доступен для аренды! #drill #beat #music",
      serviceTitle: "Запись трека",
      servicePrice: 3000,
      audioUrl: "/audio/62757_232225.mp3",
      commentsData: [
        { id: "c1", username: "music_lover", text: "Огонь! Когда релиз?", likes: 12, timestamp: "2ч назад" },
        { id: "c2", username: "producer_23", text: "Жесткий саунд, респект!", likes: 8, timestamp: "1ч назад" },
        { id: "c3", username: "beatmaker", text: "Можно купить эксклюзив?", likes: 5, timestamp: "30мин назад" },
      ],
    },
    {
      id: "2",
      username: "synth_wave",
      trackName: "Neon Nights",
      genre: "EDM",
      likes: 1876,
      comments: 54,
      gradientBg: "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600",
      description: "Синтвейв атмосфера города. Работал над этим треком 3 недели ✨",
      serviceTitle: "Сведение",
      servicePrice: 2500,
      audioUrl: "/audio/62757_260347.mp3",
      commentsData: [
        { id: "c4", username: "dj_alex", text: "Играл вчера в клубе, зал взорвался!", likes: 24, timestamp: "5ч назад" },
        { id: "c5", username: "nightrider", text: "Прямо в ночную поездку", likes: 15, timestamp: "3ч назад" },
      ],
    },
    {
      id: "3",
      username: "lo_fi_beats",
      trackName: "Chill Vibes",
      genre: "Lo-Fi",
      likes: 3124,
      comments: 112,
      gradientBg: "bg-gradient-to-br from-green-900 via-green-600 to-teal-600",
      description: "Спокойный лоу-фай для учебы и отдыха 🍃 Семплировал винил 70-х",
      serviceTitle: "Аренда студии",
      servicePrice: 2000,
      audioUrl: "/audio/62757_265416.mp3",
      commentsData: [
        { id: "c6", username: "student_life", text: "Под это учу экзамены, спасибо!", likes: 45, timestamp: "1д назад" },
        { id: "c7", username: "chill_master", text: "Добавил в плейлист", likes: 32, timestamp: "8ч назад" },
        { id: "c8", username: "vinyl_collector", text: "Какой винил использовал?", likes: 18, timestamp: "5ч назад" },
      ],
    },
    {
      id: "4",
      username: "beat_maker_pro",
      trackName: "Trap Banger",
      genre: "Trap",
      likes: 4521,
      comments: 203,
      gradientBg: "bg-gradient-to-br from-orange-900 via-red-700 to-pink-600",
      description: "Хардкорный трэп! 808 бас пробьет любые колонки 💥 #trap #bass #producer",
      serviceTitle: "Мастеринг",
      servicePrice: 3500,
      audioUrl: "/audio/62757_274560.mp3",
      commentsData: [
        { id: "c9", username: "bass_head", text: "Басс просто космос!", likes: 67, timestamp: "6ч назад" },
        { id: "c10", username: "trap_nation", text: "Можем обсудить коллаб?", likes: 42, timestamp: "4ч назад" },
      ],
    },
    {
      id: "5",
      username: "drill_king",
      trackName: "Street Energy",
      genre: "Drill",
      likes: 5234,
      comments: 178,
      gradientBg: "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900",
      description: "Уличная энергия Москвы в звуке 🏙️ Записано в подземке",
      serviceTitle: "Запись трека",
      servicePrice: 2800,
      audioUrl: "/audio/62757_232225.mp3",
      commentsData: [
        { id: "c11", username: "moscow_drill", text: "Столичный drill на высоте!", likes: 89, timestamp: "12ч назад" },
        { id: "c12", username: "street_sound", text: "Атмосфера огонь", likes: 56, timestamp: "9ч назад" },
      ],
    },
    {
      id: "6",
      username: "edm_master",
      trackName: "Festival Vibes",
      genre: "EDM",
      likes: 6891,
      comments: 312,
      gradientBg: "bg-gradient-to-br from-pink-900 via-purple-700 to-indigo-600",
      description: "Фестивальный EDM трек! Drop на 1:20 разорвет танцпол 🎉🎊 Премьера на фестивале в следующем месяце",
      serviceTitle: "Аренда студии",
      servicePrice: 4000,
      audioUrl: "/audio/62757_260347.mp3",
      commentsData: [
        { id: "c13", username: "festival_lover", text: "На каком фестивале будет премьера?", likes: 125, timestamp: "1д назад" },
        { id: "c14", username: "edm_fan", text: "Drop просто убийственный!", likes: 98, timestamp: "18ч назад" },
        { id: "c15", username: "dj_mike", text: "Уже добавил в сет!", likes: 76, timestamp: "10ч назад" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollPosition = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollPosition / windowHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < snippets.length) {
        setActiveIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex, snippets.length]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory lg:snap-none scroll-smooth max-w-lg lg:max-w-4xl mx-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {snippets.map((snippet, index) => (
        <FeedSnippet
          key={snippet.id}
          {...snippet}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
};

export default Feed;
