/**
 * Created At: 2025.07.05:21:10:02
 * @author - @FL03
 * @file - text-editor/types.ts
 */

type UpdatedAt = { updatedAt: Date } | { modifiedAt: Date };

/** The `EditorData` type defines the basic structure for data managed by the text editor. */
export type EditorData = {
  /** The content of the editor, typically in markdown format. */
  content: string;
  /** The title of the document being edited. */
  title: string;
  /** The author of the document. */
  author?: string;
  /** Additional metadata associated with the document. */
  metadata?: Record<string, any>;
  /** The type of content being managed */
  contentType?: "markdown" | "html" | "text";
} & UpdatedAt;
