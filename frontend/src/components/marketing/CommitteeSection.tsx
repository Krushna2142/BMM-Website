'use client';

interface CommitteeMember {
  nameMarathi: string;
  nameEnglish: string;
  designationMarathi: string;
  designationEnglish: string;
  image: string;
}

interface CommitteeData {
  titleMarathi: string;
  titleEnglish: string;
  members: CommitteeMember[];
}

export default function CommitteeSection({ data }: { data: CommitteeData }) {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.members.map((member, idx) => (
            <div key={idx} className="text-center group">
              <div className="relative mb-4 inline-block">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-orange-500 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.nameEnglish}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-red-800 mb-1">
                {member.nameMarathi}
              </h4>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                {member.nameEnglish}
              </p>
              <p className="text-sm text-gray-600 mb-0.5">
                {member.designationMarathi}
              </p>
              <p className="text-sm text-gray-500">
                {member.designationEnglish}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}