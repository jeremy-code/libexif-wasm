/**
 * Often, a wrapper around a C struct where `byteOffset` is the pointer to the
 * struct in memory
 *
 * The struct members are assigned are accessed with getters and setters to
 * ensure the values remain in sync with the C struct. Furthermore, if a struct
 * member is a pointer to another struct, it will also have a lazy getter of a
 * wrapper instance of that struct to prevent infinite recursion
 */
interface DataSegment {
  /**
   * The location of the data segment in memory in bytes. Value is established
   * when instance is constructed and cannot be changed
   */
  readonly byteOffset: number;
  /**
   * Increments the reference counter (i.e. `data->ref_count++;`)
   *
   * @see {@link https://en.wikipedia.org/wiki/Reference_counting}
   * @see {@link https://libexif.github.io/api/#memory_management}
   */
  ref: () => void;
  /**
   * Decrements the reference count, possibly freeing the data segment
   *
   * @see {@link DataSegment.ref}
   */
  unref: () => void;
}

type DisposableDataSegment = Disposable &
  DataSegment & {
    /**
     * Deallocates the memory used by the data segment
     */
    free: () => void;
  };

export type { DataSegment, DisposableDataSegment };
