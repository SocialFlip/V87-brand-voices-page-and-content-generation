import { useLocalStorage } from './useLocalStorage';

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage('socialflip_templates', []);

  const getTemplatesForPlatform = (platform) => {
    return templates.filter(t => t.platform === platform);
  };

  const addTemplate = (template) => {
    const platformTemplates = getTemplatesForPlatform(template.platform);
    if (platformTemplates.length >= 25) {
      throw new Error(`Maximum limit of 25 templates reached for ${template.platform}`);
    }
    
    setTemplates(prev => [template, ...prev]);
    return template;
  };

  const updateTemplate = (id, content) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, content, updatedAt: new Date().toISOString() }
          : template
      )
    );
  };

  const deleteTemplate = (id) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  return {
    getTemplatesForPlatform,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    hasReachedLimit: (platform) => getTemplatesForPlatform(platform).length >= 25
  };
}