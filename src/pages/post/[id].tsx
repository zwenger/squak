import { type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "../../components/loading";
import { api } from "../../utils/api";

const SinglePostPage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "zwenger",
  });

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>404</div>;
  console.log(data);
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <main className="flex h-screen justify-center ">
        <span>{data.username}</span>
      </main>
    </>
  );
};

export default SinglePostPage;
