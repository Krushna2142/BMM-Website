"use client";

import Image from "next/image";

interface CustomSectionProps {
  data: any;
}

const fontSizeMap: Record<string, string> = {
  'xs': 'text-xs',           // 12px
  'sm': 'text-sm',           // 14px
  'base': 'text-base',       // 16px
  'lg': 'text-lg',           // 18px
  'xl': 'text-xl',           // 20px
  '2xl': 'text-2xl',         // 24px
  '3xl': 'text-3xl',         // 30px
};

const fontWeightMap: Record<string, string> = {
  'normal': 'font-normal',
  'medium': 'font-medium',
  'semibold': 'font-semibold',
  'bold': 'font-bold',
};

const textAlignMap: Record<string, string> = {
  'left': 'text-left',
  'center': 'text-center',
  'right': 'text-right',
  'justify': 'text-justify',
};

// Helper function to get field styling classes
function getFieldClasses(field: any) {
  const fontSize = fontSizeMap[field.fontSize] || 'text-base';
  const fontWeight = fontWeightMap[field.fontWeight] || 'font-normal';
  const textAlign = textAlignMap[field.textAlign] || 'text-left';
  const textColor = field.textColor || '#111827'; // gray-900 default

  return {
    className: `${fontSize} ${fontWeight} ${textAlign}`,
    style: { color: textColor },
  };
}

export function CustomSection({ data }: CustomSectionProps) {
  if (!data || !data.customFields) return null;

  const sectionName = data.sectionName || '';
  const layout = data.layout || 'grid';

  // Filter out empty fields
  const filledFields = data.customFields.filter((field: any) =>
    field.value && field.value !== '' && field.value !== 'false'
  );

  if (filledFields.length === 0) return null;

  // Layout classes
  const layoutClasses: Record<string, string> = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'space-y-4',
    cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    'full-width': 'space-y-6',
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionName && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {sectionName}
          </h2>
        )}

        <div className={layoutClasses[layout] || layoutClasses.grid}>
          {filledFields.map((field: any) => {
            const fieldName = field.label || field.name;
            const { className: fieldClasses, style: fieldStyle } = getFieldClasses(field);

            return (
              <div
                key={field.id}
                className={`
                  ${layout === 'cards' ? 'p-4 bg-gray-50 rounded-lg border border-gray-200' : ''}
                  ${layout === 'full-width' ? 'max-w-none' : ''}
                `}
              >
                {/* Only show label if showLabel is true and label exists */}
                {field.showLabel !== false && fieldName && (
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {fieldName}
                  </h4>
                )}

                {/* Render based on field type */}
                {field.type === 'image' && field.value ? (
                  <div className="mb-3">
                    <Image
                      src={field.value}
                      alt={fieldName || 'Custom image'}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                ) : field.type === 'toggle' ? (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      field.value === 'true'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {field.value === 'true' ? '✓ Yes' : '✗ No'}
                  </span>
                ) : field.type === 'richtext' ? (
                  <div
                    className={`${fieldClasses} leading-relaxed`}
                    style={fieldStyle}
                    dangerouslySetInnerHTML={{ __html: field.value }}
                  />
                ) : field.type === 'url' ? (
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${fieldClasses} text-blue-600 hover:text-blue-800 underline break-all`}
                  >
                    {field.value}
                  </a>
                ) : field.type === 'email' ? (
                  <a
                    href={`mailto:${field.value}`}
                    className={`${fieldClasses} text-blue-600 hover:text-blue-800 underline`}
                  >
                    {field.value}
                  </a>
                ) : field.type === 'color' ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: field.value }}
                    />
                    <span className={`${fieldClasses} text-gray-600`}>
                      {field.value}
                    </span>
                  </div>
                ) : field.type === 'textarea' ? (
                  <p
                    className={`${fieldClasses} whitespace-pre-line leading-relaxed`}
                    style={fieldStyle}
                  >
                    {field.value}
                  </p>
                ) : field.type === 'number' ? (
                  <p
                    className={`${fieldClasses} tabular-nums`}
                    style={fieldStyle}
                  >
                    {field.value}
                  </p>
                ) : (
                  <p
                    className={fieldClasses}
                    style={fieldStyle}
                  >
                    {field.value}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}