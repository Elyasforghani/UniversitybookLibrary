import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { updateUserStatus } from "@/lib/admin/actions/user";

const Page = async () => {
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt));

  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(20);

  return (
    <div className="flex flex-col gap-8">
      {/* Pending Account Requests */}
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-dark-400">
              Pending Account Requests
            </h2>
            <p className="text-sm text-light-500">
              {pendingUsers.length} user(s) waiting for admin approval
            </p>
          </div>
        </div>

        <div className="mt-7 w-full overflow-x-auto">
          <table className="w-full text-left text-sm text-dark-200">
            <thead className="bg-light-300 text-xs uppercase text-light-500">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-l-lg">User</th>
                <th scope="col" className="px-6 py-4">University ID</th>
                <th scope="col" className="px-6 py-4">ID Card</th>
                <th scope="col" className="px-6 py-4">Date Requested</th>
                <th scope="col" className="px-6 py-4 rounded-r-lg">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-light-500">
                    🎉 No pending account requests! All users have been reviewed.
                  </td>
                </tr>
              ) : (
                pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-light-300/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-amber-100 text-dark-200 font-bold text-sm">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-dark-400">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-light-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-dark-300">
                      {user.universityId}
                    </td>
                    <td className="px-6 py-4">
                      {user.universityCard ? (
                        <a
                          href={user.universityCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                        >
                          <div className="relative h-8 w-12 rounded border border-gray-200 overflow-hidden bg-gray-50">
                            <Image
                              src={user.universityCard}
                              alt="ID card"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>View Card</span>
                        </a>
                      ) : (
                        <span className="text-light-500 text-xs">No card provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-light-500 text-xs">
                      {user.createdAt
                        ? dayjs(user.createdAt).format("MMM DD, YYYY")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <form
                          action={async () => {
                            "use server";
                            await updateUserStatus(user.id, "APPROVED");
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-lg bg-green-100 px-3.5 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        </form>

                        <form
                          action={async () => {
                            "use server";
                            await updateUserStatus(user.id, "REJECTED");
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-lg bg-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Overview of Reviewed Accounts */}
      <section className="w-full rounded-2xl bg-white p-7">
        <h2 className="text-lg font-semibold text-dark-400">
          Recent Accounts Status
        </h2>

        <div className="mt-4 w-full overflow-x-auto">
          <table className="w-full text-left text-sm text-dark-200">
            <thead className="bg-light-300 text-xs uppercase text-light-500">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">User</th>
                <th scope="col" className="px-6 py-3">University ID</th>
                <th scope="col" className="px-6 py-3">Current Status</th>
                <th scope="col" className="px-6 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-light-300/40">
                  <td className="px-6 py-3">
                    <span className="font-medium text-dark-400">{u.fullName}</span>
                    <span className="text-light-500 text-xs ml-2">({u.email})</span>
                  </td>
                  <td className="px-6 py-3">{u.universityId}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : u.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {u.status !== "APPROVED" ? (
                      <form
                        action={async () => {
                          "use server";
                          await updateUserStatus(u.id, "APPROVED");
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-green-700 hover:underline cursor-pointer font-medium"
                        >
                          Set to Approved
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-light-500">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Page;
