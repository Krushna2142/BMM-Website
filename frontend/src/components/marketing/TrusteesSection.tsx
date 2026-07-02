'use client';

interface Trustee {
  nameMarathi: string;
  nameEnglish: string;
  image: string;
}

interface TrusteesData {
  titleMarathi: string;
  titleEnglish: string;
  members: Trustee[];
}

export default function TrusteesSection({ data }: { data: TrusteesData }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {data.titleMarathi}
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-red-800">
            {data.titleEnglish}
          </h3>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {data.members.map((member, idx) => (
            <div key={idx} className="text-center group">
              <div className="relative mb-4 inline-block">
                <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-orange-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.nameEnglish}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-red-800 mb-1">
                {member.nameMarathi}
              </h4>
              <p className="text-base font-semibold text-gray-800">
                {member.nameEnglish}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}