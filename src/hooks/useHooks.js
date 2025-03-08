import { useState, useEffect } from 'react';
import { getHooks, createHook, updateHook, deleteHook } from '../services/hooksService';

export function useHooks() {
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHooks();
      setHooks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading hooks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHooks();
  }, []);

  const addHook = async (content, type) => {
    try {
      const newHook = await createHook(content, type);
      await loadHooks();
      return newHook;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getHooksByType = (type) => {
    if (type === 'All Hooks') return hooks;
    return hooks.filter(hook => hook.type === type);
  };

  const getHookCount = (type) => {
    return type === 'All Hooks' ? hooks.length : hooks.filter(hook => hook.type === type).length;
  };

  return {
    hooks,
    loading,
    error,
    addHook,
    getHooksByType,
    getHookCount,
    updateHook: async (id, content) => {
      await updateHook(id, content);
      await loadHooks();
    },
    deleteHook: async (id) => {
      await deleteHook(id);
      await loadHooks();
    }
  };
}