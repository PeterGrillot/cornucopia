"use client";
import { Button, Card, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
};

type Posts = Post[];

type Pagination = {
  skip: number;
  limit: number;
};

type PostsResponse = {
  posts: Posts;
  total: number;
} & Pagination;

export function PostsList() {
  const [posts, setPosts] = useState<Posts | null>(null);
  const [pagination, setPagination] = useState<
    Omit<PostsResponse, "posts" | "total">
  >({
    skip: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://dummyjson.com/posts?limit=${pagination.limit}&skip=${pagination.skip}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const { posts, limit, skip }: PostsResponse = await response.json();

        setPosts(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pagination]);

  const prevPage = () => {
    console.log("prev");
    setPagination((prev) => ({
      ...prev,
      skip: Math.max(prev.skip - prev.limit, 0),
    }));
  };

  const nextPage = () => {
    console.log("next");
    setPagination((prev) => ({ ...prev, skip: prev.limit + prev.skip }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts) return <p>No posts</p>;

  return (
    <div className="p-4 flex gap-2 flex-col">
      {posts.map((post) => (
        <Card key={post.id}>
          <Heading as="h2" size="2">
            {post.title}
          </Heading>
        </Card>
      ))}
      <div className="flex gap-2">
        <Button onClick={prevPage}>Prev</Button>
        <Button onClick={nextPage}>Next</Button>
      </div>
      {JSON.stringify(pagination)}
    </div>
  );
}

export default PostsList;
