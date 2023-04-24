import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-32  bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt="Profile image"
            width={128}
            height={128}
            className="bg-sl absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-slate-600"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-300"></div>
      </PageLayout>
    </>
  );
};

import { generateSSGHelper } from "../server/helpers/ssgHelper";
import { PageLayout } from "../components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
