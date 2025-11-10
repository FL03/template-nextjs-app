/**
 * Created At: 2025.09.30:14:13:29
 * @author - @FL03
 * @directory - src/types
 * @file - author.ts
 */

export class Author extends String {
  constructor(name: string) {
    super(name);
    if (name.length < 3 || name.length > 50) {
      throw new Error("Author name must be between 3 and 50 characters");
    }
    if (!/^[a-zA-Z0-9 _.-]+$/.test(name)) {
      throw new Error("Author name contains invalid characters");
    }
    Object.freeze(this);
  }
}