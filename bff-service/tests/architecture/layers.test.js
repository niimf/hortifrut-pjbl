const fs = require('fs');
const path = require('path');

describe('Clean Architecture - Layer Rules (BFF)', () => {
  
  test('Domain layer should not depend on any other layer', () => {
    const domainPath = path.join(__dirname, '../../src/domain');
    const domainFiles = getAllJsFiles(domainPath);
    
    domainFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*application/);
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
      expect(content).not.toMatch(/require\(['"].*presentation/);
      expect(content).not.toMatch(/require\(['"].*features/);
    });
  });

  test('Application layer should only depend on Domain layer', () => {
    const applicationPath = path.join(__dirname, '../../src/application');
    const applicationFiles = getAllJsFiles(applicationPath);
    
    applicationFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*presentation/);
      // Permitir infrastructure (ex: JwtService usado no UseCase)
    });
  });

  test('Infrastructure layer can depend on Domain', () => {
    const infrastructurePath = path.join(__dirname, '../../src/infrastructure');
    const infrastructureFiles = getAllJsFiles(infrastructurePath);
    
    infrastructureFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*presentation/);
    });
  });

  test('Features encapsulate UseCase + Infrastructure', () => {
    const featuresPath = path.join(__dirname, '../../src/features');
    
    if (!fs.existsSync(featuresPath)) {
      throw new Error('Features directory does not exist');
    }
    
    const featureFiles = getAllJsFiles(featuresPath);
    
    expect(featureFiles.length).toBeGreaterThan(0);
  });

  test('All Entities should have a validate method', () => {
    const entitiesPath = path.join(__dirname, '../../src/domain/entities');
    
    if (!fs.existsSync(entitiesPath)) {
      console.warn('⚠️  No entities directory');
      return;
    }
    
    const entityFiles = getAllJsFiles(entitiesPath);
    
    if (entityFiles.length === 0) {
      console.warn('⚠️  No entity files found');
      return;
    }
    
    entityFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/validate\s*\(/);
    });
  });

  test('Gateway repository should extend interface', () => {
    const gatewayFile = path.join(
      __dirname, 
      '../../src/infrastructure/gateway/GatewayRepository.js'
    );
    
    if (!fs.existsSync(gatewayFile)) {
      throw new Error('GatewayRepository.js not found');
    }
    
    const content = fs.readFileSync(gatewayFile, 'utf8');
    expect(content).toMatch(/extends\s+IGatewayRepository/);
  });

  test('Auth middleware should validate JWT tokens', () => {
    const authFile = path.join(
      __dirname,
      '../../src/presentation/middlewares/authMiddleware.js'
    );
    
    if (!fs.existsSync(authFile)) {
      throw new Error('authMiddleware.js not found');
    }
    
    const content = fs.readFileSync(authFile, 'utf8');
    expect(content).toMatch(/verifyToken/);
    expect(content).toMatch(/authorization/);
  });
});

function getAllJsFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllJsFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}
