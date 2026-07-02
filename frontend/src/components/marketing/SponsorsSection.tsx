interface Sponsor {
  name: string;
  image: string;
  link: string;
}

interface SponsorsData {
  title: string;
  subtitle: string;
  sponsors: Sponsor[];
}

export default function SponsorsSection({ data }: { data: SponsorsData }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-red-900 mb-2">{data.title}</h2>
        <p className="text-center text-gray-600 mb-12">{data.subtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {data.sponsors.map((sponsor, idx) => (
            <a
              key={idx}
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex items-center justify-center"
            >
              <img src={sponsor.image} alt={sponsor.name} className="max-h-20 object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}