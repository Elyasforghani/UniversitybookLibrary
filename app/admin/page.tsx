import React from "react";
import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BookCover from "@/components/BookCover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const Page = async () => {
  const [totalBooks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(books);

  const [totalUsers] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [totalBorrowed] = await db
    .select({ count: sql<number>`count(*)` })
    .from(borrowRecords)
    .where(eq(borrowRecords.status, "BORROWED"));

  const [pendingRequests] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.status, "PENDING"));

  const recentBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(5);

  const recentUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Total Books</p>
            <div className="rounded-lg bg-blue-50 p-2.5">
              <Image
                src="/icons/admin/book.svg"
                alt="books"
                width={20}
                height={20}
              />
            </div>
          </div>
          <p className="stat-count">{Number(totalBooks?.count || 0)}</p>
        </div>

        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <div className="rounded-lg bg-purple-50 p-2.5">
              <Image
                src="/icons/admin/users.svg"
                alt="users"
                width={20}
                height={20}
              />
            </div>
          </div>
          <p className="stat-count">{Number(totalUsers?.count || 0)}</p>
        </div>

        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Borrowed Books</p>
            <div className="rounded-lg bg-amber-50 p-2.5">
              <Image
                src="/icons/admin/bookmark.svg"
                alt="borrowed"
                width={20}
                height={20}
              />
            </div>
          </div>
          <p className="stat-count">{Number(totalBorrowed?.count || 0)}</p>
        </div>

        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Pending Requests</p>
            <div className="rounded-lg bg-rose-50 p-2.5">
              <Image
                src="/icons/admin/user.svg"
                alt="pending"
                width={20}
                height={20}
              />
            </div>
          </div>
          <p className="stat-count">{Number(pendingRequests?.count || 0)}</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recently Added Books */}
        <div className="rounded-2xl bg-white p-7 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-dark-400">
              Recently Added Books
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/books">View All</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {recentBooks.length === 0 ? (
              <p className="text-light-500 text-sm">No books added yet.</p>
            ) : (
              recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between rounded-xl bg-light-300 p-4 transition-all hover:bg-light-400/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-12 flex-shrink-0">
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
                      <p className="text-light-500 text-sm">
                        {book.author} &bull; {book.genre}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {book.availableCopies} / {book.totalCopies} available
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users & Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-7">
            <h2 className="text-xl font-semibold text-dark-400">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Button
                asChild
                className="w-full bg-primary-admin hover:bg-primary-admin/90 text-white"
              >
                <Link href="/admin/books/new">+ Add New Book</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/account-requests">
                  Review Account Requests ({Number(pendingRequests?.count || 0)})
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-dark-400">
                Recent Users
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/users">View All</Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-light-300"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-amber-100 text-dark-200 font-bold text-xs">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-dark-400">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-light-500">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
