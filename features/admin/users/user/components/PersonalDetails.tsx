import { CollapsibleSection } from "./CollapsibleSection";

interface PersonalDetailsProps {
  personalDetails: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    town: string;
    telHome: string;
    telMobile: string;
    emergencyContact: string;
  };
}

export function PersonalDetails({ personalDetails }: PersonalDetailsProps) {
  return (
    <CollapsibleSection title="Personal Details">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(personalDetails).map(([key, value]) => (
          <div key={key} className="border-t border-gray-700 pt-4">
            <dt className="font-medium text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </dt>
            <dd className="mt-1 text-black">{value}</dd>
          </div>
        ))}
      </dl>
    </CollapsibleSection>
  );
}
