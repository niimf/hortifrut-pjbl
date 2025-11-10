const fs = require('fs');
const path = require('path');

describe('Clean Architecture - Layer Rules', () => {
  
  test('Domain layer should not depend on any other layer', () => {
    const domainPath = path.join(__dirname, '../../src/domain');
    const domainFiles = getAllJsFiles(domainPath);
    
    domainFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*application/);
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
      expect(content).not.toMatch(/require\(['"].*presentation/);
    });
  });

  test('Application layer should only depend on Domain layer', () => {
    const applicationPath = path.join(__dirname, '../../src/application');
    const applicationFiles = getAllJsFiles(applicationPath);
    
    applicationFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
      expect(content).not.toMatch(/require\(['"].*presentation/);
    });
  });

  test('Infrastructure layer can depend on Domain and Application', () => {
    const infrastructurePath = path.join(__dirname, '../../src/infrastructure');
    const infrastructureFiles = getAllJsFiles(infrastructurePath);
    
    infrastructureFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*presentation/);
    });
  });

  test('Presentation layer can depend on Application and Domain', () => {
    const presentationPath = path.join(__dirname, '../../src/presentation');
    const presentationFiles = getAllJsFiles(presentationPath);
    
    presentationFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
    });
  });

  test('All Use Cases should follow naming convention', () => {
    const useCasesPath = path.join(__dirname, '../../src/application/use-cases');
    const useCaseFiles = getAllJsFiles(useCasesPath);
    
    useCaseFiles.forEach(file => {
      const fileName = path.basename(file);
      expect(fileName).toMatch(/\.usecase\.js$/);
    });
  });

  test('All Entities should have a validate method', () => {
    const entitiesPath = path.join(__dirname, '../../src/domain/entities');
    
    if (!fs.existsSync(entitiesPath)) {
      throw new Error(`Directory does not exist: ${entitiesPath}`);
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

  test('Repository implementation should extend interface', () => {
    const repositoryFile = path.join(
      __dirname, 
      '../../src/infrastructure/database/mssql/OrderRepository.js'
    );
    
    const content = fs.readFileSync(repositoryFile, 'utf8');
    expect(content).toMatch(/extends\s+IOrderRepository/);
  });
});

function getAllJsFiles(dirPath, arrayOfFiles = []) {
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
