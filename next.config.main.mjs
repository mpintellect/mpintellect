// next.config.main.mjs
import baseConfig from './next.config.js';

// Clone the base config
const nextConfig = { ...baseConfig };

// Add a function to exclude the intel page from the build
nextConfig.exportPathMap = async function (defaultPathMap) {
  // Get all default paths
  const allPaths = { ...defaultPathMap };
  
  // Remove the intel page
  delete allPaths['/intel'];
  
  // Also remove root if it points to intel (optional)
  if (allPaths['/'] && allPaths['/'].page === '/intel') {
    delete allPaths['/'];
  }
  
  return allPaths;
};

export default nextConfig;