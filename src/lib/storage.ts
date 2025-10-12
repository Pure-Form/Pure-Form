import AsyncStorage from '@react-native-async-storage/async-storage';

export async function store(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('storage.set error', e);
    return false;
  }
}

export async function load(key: string) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('storage.get error', e);
    return null;
  }
}

export async function remove(key: string) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn('storage.remove error', e);
    return false;
  }
}
