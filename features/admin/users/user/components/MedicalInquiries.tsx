import { CollapsibleSection } from "./CollapsibleSection";

interface MedicalInquiriesProps {
  medicalInquiries: Record<string, string | null>;
}

export function MedicalInquiries({ medicalInquiries }: MedicalInquiriesProps) {
  return (
    <CollapsibleSection title="Medical Inquiries">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(medicalInquiries).map(([key, value]) => (
          <div key={key} className="border-t border-gray-700 pt-4">
            <dt className="font-medium text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </dt>
            <dd className="mt-1 text-black">{value === null ? "N/A" : value}</dd>
          </div>
        ))}
      </dl>
    </CollapsibleSection>
  );
}
