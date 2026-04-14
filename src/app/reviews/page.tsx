"use client";
import { useState } from "react";

type Review = {
  id: number;
  title: string;
  content: string;
  rating: number;
  user: string;
  date: string;
};

const reviews: Review[] = [
  {
    id: 1,
    title: "Great product, very reliable",
    content:
      "I've been using this for a few months now and it has exceeded my expectations. Performance is solid and setup was straightforward.",
    rating: 5,
    user: "pgrillot",
    date: "2026-01-12T14:32:00Z",
  },
  {
    id: 2,
    title: "Good, but has minor issues",
    content:
      "Overall I’m happy with the purchase. There are a couple of small bugs, but nothing that prevents me from using it daily.",
    rating: 4,
    user: "frontendFan92",
    date: "2023-01-18T09:15:00Z",
  },
  {
    id: 3,
    title: "Decent value for the price",
    content: "It does what it promises. Not perfect, but for the price point it’s a solid option.",
    rating: 3,
    user: "dev_guy",
    date: "2024-01-25T19:47:00Z",
  },
  {
    id: 4,
    title: "Had some problems",
    content:
      "Initial setup was confusing and I ran into a few errors. Customer support helped, but it took some time.",
    rating: 2,
    user: "reactLearner",
    date: "2022-02-02T11:05:00Z",
  },
  {
    id: 5,
    title: "Would not recommend",
    content:
      "Unfortunately, the product did not meet my expectations. Performance was inconsistent and documentation was lacking.",
    rating: 1,
    user: "honestReviewer",
    date: "2026-02-10T16:20:00Z",
  },
];

const ReviewPage = () => {
  const [sort, setSort] = useState<keyof Review>("rating");

  const compare = (a: Review, b: Review) => {
    if (sort === "rating") {
      return b.rating - a.rating;
    } else if (sort === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return a[sort] < b[sort] ? -1 : 1;
    }
  };

  return (
    <div className="p-3 w-[1024px] m-auto">
      <label htmlFor="sort">Sort By</label>{" "}
      <select name="sort" onChange={(e) => setSort(e.target.value as keyof Review)}>
        <option value="rating">Rating</option>
        <option value="date">Date</option>
      </select>
      {reviews.sort(compare).map((review) => (
        <div key={review.id} className="py-4">
          <p>{new Date(review.date).toLocaleDateString()}</p>
          <h1>{review.title}</h1>
          <p>
            <i>{review.user}</i>
          </p>
          <p>{review.rating}</p>
          <p>{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewPage;
