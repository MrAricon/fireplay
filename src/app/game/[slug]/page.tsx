import { getGameDetails, getGameScreenshots } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameDetails from "@/components/game-details";
import { JSX } from "react";

type GamePageProps = {
  params: { slug: string };
};

const GamePage = async ({ params }: { params: { slug: string } }): Promise<JSX.Element> => {
  const game = await getGameDetails(params.slug);
  if (!game) notFound();

  const screenshots = await getGameScreenshots(game.id);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-4">
        <Link href="/games" className="text-orange-500 hover:text-orange-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a juegos
        </Link>
      </div>

      <GameDetails game={game} screenshots={screenshots} />
    </div>
  );
};

export default GamePage;