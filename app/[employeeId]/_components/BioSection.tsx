"use client";

interface BioSectionProps {
  bio: string;
}

export function BioSection({ bio }: BioSectionProps) {
  if (!bio) return null;
  
  return (
    <div className="mt-8 pt-6 border-t">
      <h2 className="text-xl font-semibold mb-4">About</h2>
      <p className="text-muted-foreground">{bio}</p>
    </div>
  );
}