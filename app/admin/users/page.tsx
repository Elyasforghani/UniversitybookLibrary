import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc } from "drizzle-orm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import dayjs from "dayjs";
import { updateUserRole, updateUserStatus } from "@/lib/admin/actions/user";

const Page = async () => {
  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-dark-400">All Users</h2>
          <p className="text-sm text-light-500">
            Total {allUsers.length} registered users
          </p>
        </div>
      </div>

      <div className="mt-7 w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-dark-200">
          <thead className="bg-light-300 text-xs uppercase text-light-500">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-l-lg">User</th>
              <th scope="col" className="px-6 py-4">University ID</th>
              <th scope="col" className="px-6 py-4">Role</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Joined Date</th>
              <th scope="col" className="px-6 py-4 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-light-500">
                  No users found.
                </td>
              </tr>
            ) : (
              allUsers.map((user) => (
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
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : user.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
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
                          const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                          await updateUserRole(user.id, nextRole);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-dark-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                        </button>
                      </form>

                      {user.status !== "APPROVED" && (
                        <form
                          action={async () => {
                            "use server";
                            await updateUserStatus(user.id, "APPROVED");
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                    </div>
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
