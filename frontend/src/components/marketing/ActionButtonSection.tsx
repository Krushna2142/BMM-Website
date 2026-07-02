'use client';

interface ActionButton {
  label: string;
  link: string;
  color: string;
}

interface ActionButtonsData {
  buttons: ActionButton[];
}

export default function ActionButtonsSection({ data }: { data: ActionButtonsData }) {
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'orange': 'bg-orange-500 hover:bg-orange-600',
      'red': 'bg-red-600 hover:bg-red-700',
      'blue': 'bg-blue-600 hover:bg-blue-700',
      'green': 'bg-green-600 hover:bg-green-700',
    };
    return colorMap[color.toLowerCase()] || 'bg-gray-800 hover:bg-gray-900';
  };

  if (!data.buttons || data.buttons.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.buttons.map((button, idx) => (
            <a
              key={idx}
              href={button.link}
              className={`${getColorClass(button.color)} text-white text-center py-6 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}