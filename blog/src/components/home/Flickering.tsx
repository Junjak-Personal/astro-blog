import { FlickeringGrid } from '@/components/ui/flickering-grid';

export default function Flickering() {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <FlickeringGrid
        className="[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={8}
        color="#60A5FA"
        maxOpacity={0.35}
        flickerChance={0.08}
      />
    </div>
  );
}
