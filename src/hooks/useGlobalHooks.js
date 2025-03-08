import { useState, useEffect } from 'react';
import { getGlobalHooks, createGlobalHook, updateGlobalHook, deleteGlobalHook } from '../services/globalHooksService';

export function useGlobalHooks() {
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGlobalHooks();
      setHooks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading global hooks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHooks();
  }, []);

  const addHook = async (content, type) => {
    try {
      const newHook = await createGlobalHook(content, type);
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
      await updateGlobalHook(id, content);
      await loadHooks();
    },
    deleteHook: async (id) => {
      await deleteGlobalHook(id);
      await loadHooks();
    }
  };
}