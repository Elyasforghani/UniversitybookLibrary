import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import BookCover from "@/components/BookCover";
import dayjs from "dayjs";
import Image from "next/image";

const Page = async () => {
  const allBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-dark-400">All Books</h2>
          <p className="text-sm text-light-500">
            Total {allBooks.length} books in the library catalog
          </p>
        </div>

        <Button className="bg-primary-admin hover:bg-primary-admin/90 text-white" asChild>
          <Link href="/admin/books/new">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-dark-200">
          <thead className="bg-light-300 text-xs uppercase text-light-500">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-l-lg">Book Title</th>
              <th scope="col" className="px-6 py-4">Author</th>
              <th scope="col" className="px-6 py-4">Genre</th>
              <th scope="col" className="px-6 py-4">Rating</th>
              <th scope="col" className="px-6 py-4">Available</th>
              <th scope="col" className="px-6 py-4 rounded-r-lg">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allBooks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-light-500">
                  No books found. Click "+ Create a New Book" to add one.
                </td>
              </tr>
            ) : (
              allBooks.map((book) => (
                <tr key={book.id} className="hover:bg-light-300/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 flex-shrink-0">
                        <BookCover
                          variant="extraSmall"
                          coverColor={book.coverColor}
                          coverImage={book.coverUrl}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-dark-400 line-clamp-1">
                          {book.title}
                        </p>
                        <p className="text-xs text-light-500 line-clamp-1">
                          ID: {book.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-dark-300">
                    {book.author}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-light-400 px-3 py-1 text-xs font-medium text-dark-200">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-semibold text-dark-400">
                      <Image
                        src="/icons/star.svg"
                        alt="star"
                        width={16}
                        height={16}
                      />
                      <span>{book.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        book.availableCopies > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-light-500 text-xs">
                    {book.createdAt
                      ? dayjs(book.createdAt).format("MMM DD, YYYY")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Page;
