export const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

export const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * 24);
  const random2 = Math.floor(Math.random() * (24 - random1)) + random1 + 1;

  return [random1, random2];
};

import type { NextRequest } from "next/server";
import { or, like, ilike, sql } from "drizzle-orm";

import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const searchQuery = params.get("q")?.trim();
  const page = Number(params.get('page')?.trim());

  const dbQuery = db.select().from(advocates);

  if (searchQuery) {
    dbQuery.where(
      or(
        ilike(advocates.firstName, `%${searchQuery}%`),
        ilike(advocates.lastName, `%${searchQuery}%`),
        ilike(advocates.city, `%${searchQuery}%`),
        like(advocates.phoneNumber, `%${searchQuery.replaceAll("-", "")}%`),
        ilike(
          sql`${advocates.firstName} || ' ' || ${advocates.lastName}`,
          `%${searchQuery}%`
        )
      )
    );
  }

  dbQuery.find({
    name: "asc",
  })

  const data = await dbQuery;

  return Response.json({ data });
}


"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@radix-ui/themes";
import { Advocate } from "@/db/schema";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.append("q", searchTerm);

    fetch(`/api/advocates?${params.toString()}`).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
    });
  }, [searchTerm]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    setSearchTerm(searchTerm);
  };

  const onClick = () => {
    setSearchTerm("");
  };

  return (
    <main className="flex flex-col gap-4 m-8">
      <header className="flex place-content-between">
        <h1 className="font-display text-4xl text-solace-dark-green">
          Solace Advocates
        </h1>

        <div className="flex justify-end gap-4">
          <Input variant="search" className="max-w-lg" onChange={onChange} />
          <Button className="bg-primary" onClick={onClick}>
            Reset Search
          </Button>
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead on Click>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead>Years of Experience</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {advocates.map((advocate) => (
            <TableRow key={advocate.id}>
              <TableCell>{advocate.firstName}</TableCell>
              <TableCell>{advocate.lastName}</TableCell>
              <TableCell>{advocate.city}</TableCell>
              <TableCell>{advocate.degree}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {advocate.specialties?.map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
              </TableCell>
              <TableCell>{advocate.yearsOfExperience}</TableCell>
              <TableCell>{advocate.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
