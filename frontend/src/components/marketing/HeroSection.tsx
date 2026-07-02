interface HeroData {
  backgroundImage: string;
  title: string;
  subtitleMarathi: string;
  subtitleEnglish: string;
  buttons: { label: string; link: string; variant: string }[];
}

export default function HeroSection({ data }: { data: HeroData }) {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">{data.title}</h1>
        <p className="text-2xl text-orange-400 mb-2">{data.subtitleMarathi}</p>
        <p className="text-xl mb-8">{data.subtitleEnglish}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {data.buttons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                btn.variant === 'primary'
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}