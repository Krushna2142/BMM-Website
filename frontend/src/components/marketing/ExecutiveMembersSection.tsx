'use client';

interface ExecutiveMember {
  nameMarathi: string;
  nameEnglish: string;
  image: string;
}

interface ExecutiveMembersData {
  titleMarathi: string;
  titleEnglish: string;
  members: ExecutiveMember[];
}

export default function ExecutiveMembersSection({ data }: { data: ExecutiveMembersData }) {
  return (
    <section className="py-16 bg-gray-50">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {data.members.map((member, idx) => (
            <div key={idx} className="text-center group">
              <div className="relative mb-4 inline-block">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-orange-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
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