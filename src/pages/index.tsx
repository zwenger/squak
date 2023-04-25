import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "../components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "../components/layout";
import { PostView } from "../components/postView";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const CreatePostWizzard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const [parent] = useAutoAnimate();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong, try again later");
      }
    },
  });

  if (!user) return null;

  return (
    <div ref={parent} className="flex w-full gap-4 ">
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: 56,
              height: 56,
            },
          },
        }}
      />
      <input
        placeholder="What emoji's on your mind?"
        className="grow bg-transparent outline-none"
        type={"text"}
        value={input}
        disabled={isPosting}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          className="rounded-xl bg-blue-600 bg-opacity-25 p-4 text-white"
          onClick={() => mutate({ content: input })}
          disabled={isPosting}
        >
          Squeak
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  const [parent] = useAutoAnimate();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Ups something went wrong...</div>;

  return (
    <div ref={parent} className="flex flex-col">
      {data.map((post) => (
        <PostView {...post} key={post.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <LoadingPage />;

  return (
    <>
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizzard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
