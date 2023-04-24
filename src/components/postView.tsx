import { type RouterOutputs } from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import daysjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

daysjs.extend(relativeTime);
type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt="Author profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <div>
            <Link href={`/@${author.username}`}>
              <span>{`@${author.username}`}</span>
            </Link>
            <Link href={`/post/${post.id}`}>
              <span className="font-thin">{` · ${daysjs(
                post.createdAt
              ).fromNow()}`}</span>
            </Link>
          </div>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
