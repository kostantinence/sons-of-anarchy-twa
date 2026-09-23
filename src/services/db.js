import { get, set } from 'idb-keyval';

const DB_KEY = 'guild_board_posts';

export const getLocalPosts = async () => {
  try {
    const posts = await get(DB_KEY);
    return posts || [];
  } catch (error) {
    console.error("Ошибка чтения из IndexedDB:", error);
    return [];
  }
};

export const saveLocalPosts = async (posts) => {
  try {
    await set(DB_KEY, posts);
  } catch (error) {
    console.error("Ошибка записи в IndexedDB:", error);
  }
};