const fs = require('fs');
const path = require('path');

describe('Clean Architecture - Layer Rules', () => {
  
  test('Domain layer should not depend on any other layer', () => {
    const domainPath = path.join(__dirname, '../../src/domain');
    const domainFiles = getAllJsFiles(domainPath);
    
    domainFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Domain não deve importar de application, infrastructure ou presentation
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
      
      // Application não deve importar infrastructure ou presentation
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
      expect(content).not.toMatch(/require\(['"].*presentation/);
      
      // Mas PODE importar domain
      // (não fazemos assert negativo aqui)
    });
  });

  test('Infrastructure layer can depend on Domain and Application', () => {
    const infrastructurePath = path.join(__dirname, '../../src/infrastructure');
    const infrastructureFiles = getAllJsFiles(infrastructurePath);
    
    infrastructureFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Infrastructure não deve importar presentation
      expect(content).not.toMatch(/require\(['"].*presentation/);
    });
  });

  test('Presentation layer can depend on Application and Domain', () => {
    const presentationPath = path.join(__dirname, '../../src/presentation');
    const presentationFiles = getAllJsFiles(presentationPath);
    
    presentationFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Presentation não deve importar infrastructure diretamente
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
    });
  });

  test('All Use Cases should follow naming convention', () => {
    const useCasesPath = path.join(__dirname, '../../src/application/use-cases');
    const useCaseFiles = getAllJsFiles(useCasesPath);
    
    useCaseFiles.forEach(file => {
      const fileName = path.basename(file);
      
      // Deve terminar com .usecase.js
      expect(fileName).toMatch(/\.usecase\.js$/);
    });
  });

  test('All Entities should have a validate method', () => {
    const entitiesPath = path.join(__dirname, '../../src/domain/entities');
    const entityFiles = getAllJsFiles(entitiesPath);
    
    entityFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Deve ter método validate()
      expect(content).toMatch(/validate\s*\(/);
    });
  });

  test('Repository implementation should extend interface', () => {
    const repositoryFile = path.join(
      __dirname, 
      '../../src/infrastructure/database/mongoose/ProductRepository.js'
    );
    
    const content = fs.readFileSync(repositoryFile, 'utf8');
    
    // Deve extender IProductRepository
    expect(content).toMatch(/extends\s+IProductRepository/);
  });
});

// Função auxiliar para buscar todos os arquivos .js
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
