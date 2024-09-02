export const formatTitle = (name: string | undefined): string => {
    if (!name) {
      console.error("Invalid name provided to formatTitle:", name);
      return ""; // Return an empty string or some default value if name is undefined
    }
  
    const parts = name.split('-');
    return parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };
  