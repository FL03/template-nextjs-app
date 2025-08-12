/**
 * Created At: 2025.07.05:21:10:02
 * @author - @FL03
 * @file - blog/types.ts
 */
import { NotebookDatabase } from "@/types/database.types";

/** A type alias for updates to entries within the `notebook.notes` table. */
export type NoteUpdate = NotebookDatabase["notebook"]["Tables"]["notes"]["Update"];
/** A type alias for insertions to entries within the `notebook.notes` table. */
export type NoteInsert = NotebookDatabase["notebook"]["Tables"]["notes"]["Insert"];
/** A type alias that defines entries within the `notebook.notes` table. */
export type NoteData = NotebookDatabase["notebook"]["Tables"]["notes"]["Row"];

export type BookUpdate = NotebookDatabase["notebook"]["Tables"]["books"]["Update"];

export type BookInsert = NotebookDatabase["notebook"]["Tables"]["books"]["Insert"];

export type BookData = NotebookDatabase["notebook"]["Tables"]["books"]["Row"];

/** A type alias that unifies the various _views_ of the `notebook.notes` table entries. */
export type Note = NoteData | NoteInsert | NoteUpdate;

/** A type alias representing all possible variants of the `notebook.books` entries. */
export type Book = BookData | BookInsert | BookUpdate;