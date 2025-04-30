**React Query Cheatsheet for WhatsApp Clone**

---

### **Summary Table**

| Name | When to Use | Important Reminders |
| ----- | ----- | ----- |
| `useQuery` | Fetch and display server data | Caches automatically, refetches on mount/focus, use `enabled` to control conditional fetches |
| `useMutation` | Create/update/delete data on server | Supports optimistic updates, use `onMutate` and `onSettled` for UI sync |
| `useInfiniteQuery` | Fetch paginated data (e.g., infinite scroll) | Use `getNextPageParam` to define pagination logic, `data.pages` holds results |
| `invalidateQueries` | Mark cached data as stale and refetch | Use after server-side changes when exact new data isn't known or for safety |
| `setQueryData` | Immediately update cache with known new data | Useful for optimistic updates or WebSocket pushes, prevents waiting for refetch |
| `getQueryData` | Read cached data imperatively without rerender | Best used in `onMutate` to get current state before applying optimistic changes |
| `cancelQueries` | Cancel ongoing fetches to avoid race conditions | Essential before optimistic updates using `setQueryData` to avoid overwrite by late fetches |

---

### **1\. Core Hooks**

#### **1.1 useQuery**

**What it Does:** Fetches, caches, and synchronizes data read from the server.

**How it Works:** Takes a unique queryKey (array) and an async queryFn (your API call). Returns { data, isLoading, isError, error, isFetching, ... }. Automatically handles caching, background updates (stale-while-revalidate), refetching on mount/window focus.

**WhatsApp Example:**

* Fetching the initial list of conversations: useQuery({ queryKey: \['conversations'\], queryFn: fetchConversations })

* Fetching the messages for the currently open chat: useQuery({ queryKey: \['messages', conversationId\], queryFn: () \=\> fetchMessages(conversationId), enabled: \!\!conversationId })

**When to Use:** For getting any data from your backend that you need to display. The workhorse for reading server state.

---

#### **1.2 useMutation**

**What it Does:** Handles actions that change (create, update, delete) data on the server.

**How it Works:** Takes an async mutationFn (your API call for POST/PUT/DELETE). Returns { mutate, mutateAsync, isPending, isSuccess, isError, ... }. Provides callbacks (onMutate, onSuccess, onError, onSettled) for side effects like optimistic updates and cache invalidation.

**WhatsApp Example:**

* Sending a message: useMutation({ mutationFn: sendMessageApi, onMutate: ..., onSuccess: ..., onError: ..., onSettled: ... }). Call mutate({ conversationId, content }) to send.

* Marking messages as seen: useMutation({ mutationFn: markConversationAsSeen, onSuccess: () \=\> queryClient.invalidateQueries(\['conversations'\]) })

**When to Use:** Any time a user action needs to modify data on the backend. Essential for optimistic updates.

---

#### **1.3 useInfiniteQuery**

**What it Does:** A specialized version of useQuery for fetching data in paginated "chunks" (infinite scrolling).

**How it Works:** Similar to useQuery, but the queryFn receives page parameters. Returns data structured as pages (data.pages), plus functions like fetchNextPage, hasNextPage.

**WhatsApp Example:**

* Loading older messages when scrolling up in a chat: useInfiniteQuery({ queryKey: \['messages', conversationId\], queryFn: fetchMessagePage, getNextPageParam: (lastPage) \=\> lastPage.nextCursor })

**When to Use:** For long lists of data where you don't want to load everything at once (like message history).

---

### **2\. QueryClient Methods (Access via useQueryClient())**

#### **2.1 queryClient.invalidateQueries()**

**What it Does:** Marks cached data as stale.

**How it Works:** Takes a queryKey (or partial key/filter). Flags matching cache entries. If active useQuery/useInfiniteQuery hooks exist for those keys, it triggers a background refetch. Does not change data immediately.

**WhatsApp Example:**

* After sending a message (in useMutation's onSettled), call queryClient.invalidateQueries({ queryKey: \['conversations'\] }) to signal that the conversation list summary (last message) is likely outdated and should be refetched from the server eventually.

* After blocking a user: invalidateQueries({ queryKey: \['conversations'\] }) and invalidateQueries({ queryKey: \['contacts'\] })

**When to Use:** When an action might have changed data on the server, and you want React Query to refetch the "source of truth" to ensure consistency. Good when the exact resulting state isn't immediately known on the client, or as a safety net.

---

#### **2.2 queryClient.setQueryData()**

**What it Does:** Directly and immediately updates data in the cache.

**How it Works:** Takes an exact queryKey and the new data (or an updater function (oldData) \=\> newData). Synchronously overwrites the cache value. Any active hooks using that exact key will re-render immediately. Does not trigger a server fetch.

**WhatsApp Example:**

* Inside the Socket.IO listener for message:update: queryClient.setQueryData(\['messages', newMessage.conversationId\], (old) \=\> \[...old, newMessage\]) to instantly add the new message to the UI.

* In useMutation's onMutate for optimistic updates: queryClient.setQueryData(\['messages', convId\], (old) \=\> \[...old, tempMessage\])

**When to Use:** When you have the definitive new data on the client (e.g., from a WebSocket, or a temporary optimistic state) and want the UI to update instantly without a server roundtrip. The "trust me" update.

---

#### **2.3 queryClient.getQueryData()**

**What it Does:** Reads data directly from the cache without subscribing to updates.

**How it Works:** Takes an exact queryKey. Synchronously returns the current cached value, or undefined. Does not trigger fetches or cause component re-renders on its own.

**WhatsApp Example:**

* Inside onMutate of useSendMessage: const previousMessages \= queryClient.getQueryData(\['messages', conversationId\]) to save the current state before applying an optimistic update, allowing rollback on error.

**When to Use:** When you need synchronous access to cached data imperatively (outside the normal render cycle of a component using useQuery), often within mutation callbacks or effects.

---

#### **2.4 queryClient.cancelQueries()**

**What it Does:** Cancels any ongoing fetches for a specific query key.

**How it Works:** Takes a queryKey. Prevents any in-flight requests for that key from resolving and potentially overwriting cache data you're about to manipulate (e.g., with setQueryData).

**WhatsApp Example:**

* Crucial First Step in onMutate for optimistic updates: await queryClient.cancelQueries({ queryKey: \['messages', conversationId\] }) before calling setQueryData to prevent a concurrent fetch from overwriting your optimistic message.

**When to Use:** Almost always needed before applying optimistic updates (setQueryData in onMutate) to avoid race conditions.



# Full conversation 
account: SRaz.sw

link: 
https://aistudio.google.com/prompts/1CU5AOCY4ZYgOjgjIBlqjAPXF7diAokhN
