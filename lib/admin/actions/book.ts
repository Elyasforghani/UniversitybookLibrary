"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const returnBook = async (recordId: string, bookId: string) => {
  try {
    const { borrowRecords } = await import("@/database/schema");
    const { eq } = await import("drizzle-orm");
    const { revalidatePath } = await import("next/cache");

    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date().toISOString().slice(0, 10),
      })
      .where(eq(borrowRecords.id, recordId));

    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (book) {
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, bookId));
    }

    revalidatePath("/admin/book-requests");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error returning book:", error);
    return { success: false, message: "Failed to mark book as returned" };
  }
};

