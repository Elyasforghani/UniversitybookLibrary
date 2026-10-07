import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import BookCover from "@/components/BookCover";
import dayjs from "dayjs";
import { returnBook } from "@/lib/admin/actions/book";

const Page = async () => {
  const records = await db
    .select({
      id: borrowRecords.id,
      bookId: borrowRecords.bookId,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      bookTitle: books.title,
      bookCover: books.coverUrl,
      bookCoverColor: books.coverColor,
      userName: users.fullName,
      userEmail: users.email,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .orderBy(desc(borrowRecords.borrowDate));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-dark-400">Borrow Requests</h2>
          <p className="text-sm text-light-500">
            Monitor and manage all borrowed and returned books
          </p>
        </div>
      </div>

      <div className="mt-7 w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-dark-200">
          <thead className="bg-light-300 text-xs uppercase text-light-500">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-l-lg">Book</th>
              <th scope="col" className="px-6 py-4">Borrowed By</th>
              <th scope="col" className="px-6 py-4">Borrow Date</th>
              <th scope="col" className="px-6 py-4">Due Date</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-light-500">
                  No borrow requests found yet.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-light-300/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 flex-shrink-0">
                        <BookCover
                          variant="extraSmall"
                          coverColor={record.bookCoverColor}
                          coverImage={record.bookCover}
                        />
                      </div>
                      <p className="font-semibold text-dark-400 line-clamp-1">
                        {record.bookTitle}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-dark-400">{record.userName}</p>
                    <p className="text-xs text-light-500">{record.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-light-500 text-xs">
                    {record.borrowDate
                      ? dayjs(record.borrowDate).format("MMM DD, YYYY")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-light-500 text-xs">
                    {record.dueDate
                      ? dayjs(record.dueDate).format("MMM DD, YYYY")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        record.status === "RETURNED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {record.status === "BORROWED" && (
                      <form
                        action={async () => {
                          "use server";
                          await returnBook(record.id, record.bookId);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-lg bg-primary-admin px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-admin/90 transition-colors cursor-pointer"
                        >
                          Mark Returned
                        </button>
                      </form>
                    )}
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
