import AnimeList from "@/components/seldom/AnimeList";
import DetailsBanner from "@/components/seldom/DetailsBanner";
import DetailsSection from "@/components/seldom/DetailsSection";
import Button from "@/components/shared/Button";
import CharacterCard from "@/components/shared/CharacterCard";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import InfoItem from "@/components/shared/InfoItem";
import data from "@/data.json";
import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React from "react";
import { BsFillPlayFill } from "react-icons/bs";

interface DetailsPageProps {
  anime: Anime;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ anime }) => {
  const nextAiringSchedule = anime.airing_schedule.length
    ? anime.airing_schedule[0]
    : null;

  return (
    <React.Fragment>
      <Head
        title={anime.title.user_preferred}
        description={`Xem anime ${anime.title.user_preferred} ngay tại Kaguya!`}
        image={anime.banner_image}
      />

      <div className="pb-8">
        <DetailsBanner image={anime.banner_image} />

        <div className="relative px-4 sm:px-12 z-10 bg-background-900 pb-16">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20">
              <div className="relative aspect-w-9 aspect-h-16">
                <Image
                  src={anime.cover_image.extra_large}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left flex flex-col items-center md:items-start py-4 mt-4 md:-mt-16">
              <Button primary LeftIcon={BsFillPlayFill} className="mb-4">
                <p>Xem ngay</p>
              </Button>

              <div className="flex flex-col md:flex-row items-center space-x-4 space-y-2 mb-2">
                <p className="text-3xl font-semibold">
                  {anime.title.user_preferred}
                </p>
                {nextAiringSchedule && (
                  <p className="text-primary-300">
                    Tập tiếp theo (dự kiến): Tập {nextAiringSchedule.episode} -{" "}
                    {dayjs.unix(nextAiringSchedule.airing_at).fromNow()}
                  </p>
                )}
              </div>

              <DotList dotClassName="bg-gray-200">
                <p>{anime.format}</p>
                <p>{anime.duration} phút / tập</p>
                <p>
                  {anime.season} {anime.season_year}
                </p>
              </DotList>

              <p className="mt-4 text-gray-300">{anime.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-0 px-4 md:grid md:grid-cols-10 w-full min-h-screen mt-8 sm:px-12 gap-8">
          <div className="md:col-span-2 bg-background-900 rounded-md p-4 space-y-4 h-[max-content]">
            <InfoItem title="Số tập" value={anime.total_episodes} />
            <InfoItem title="Thời lượng" value={anime.duration} />
            <InfoItem title="Tình trạng" value={anime.status} />
            <InfoItem
              title="Mùa"
              value={`${anime.season} ${anime.season_year}`}
            />
            <InfoItem
              title="Thể loại"
              value={anime.genres.slice(0, 3).join(", ")}
            />
            <InfoItem title="Điểm dánh giá" value={anime.average_score + "%"} />
            <InfoItem title="Nổi bật" value={anime.popularity} />
            <InfoItem title="Yêu thích" value={anime.favourites} />
            <InfoItem title="Xu hướng" value={anime.trending} />
            <InfoItem
              title="Studio"
              value={anime.studios.slice(0, 3).join(", ")}
            />
          </div>
          <div className="md:col-span-8 space-y-12">
            {!!anime?.characters?.length && (
              <DetailsSection
                title="Nhân vật"
                className="w-full grid md:grid-cols-2 grid-cols-1 gap-4"
              >
                {anime.characters.map((character, index) => (
                  <CharacterCard character={character} key={index} />
                ))}
              </DetailsSection>
            )}

            {!!anime?.relations?.length && (
              <DetailsSection
                title="Anime liên quan"
                className="flex justify-between flex-wrap"
              >
                <AnimeList
                  data={anime.relations.map((relation) => relation.anime)}
                />
              </DetailsSection>
            )}

            {!!anime?.recommendations?.length && (
              <DetailsSection
                title="Anime hay khác"
                className="flex flex-wrap gap-y-8"
              >
                <AnimeList
                  data={anime.recommendations.map(
                    (recommendation) => recommendation.anime
                  )}
                />
              </DetailsSection>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("anime")
    .select(
      `
        *,
        airing_schedule(*),
        characters(*),
        recommendations!original_id(anime:recommend_id(*))
        relations!original_id(anime:relation_id(*))
      `
    )
    .eq("ani_id", Number(params.id))
    .single();

  if (error) {
    return { notFound: true };
  }

  return {
    props: {
      anime: data as Anime,
    },
    revalidate: 43200, // 12 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase.from("anime").select("ani_id");

  const paths = data.map((anime: Anime) => ({
    params: { id: anime.ani_id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default DetailsPage;