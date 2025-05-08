import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';

// Базовый URL для API
const BASE_API_URL = 'http://localhost:8000';

// Компонент карточки шаблона с поддержкой иконок
const TemplateCard = ({ template, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className="bg-card shadow-md rounded-2xl border border-border  rounded-lg p-6 border rounded-lg hover:shadow-md transition-all duration-200  border-border hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(template)}
    >
      <div className="flex flex-col items-center text-center">
        {template.icon && !imageError ? (
          // Если есть иконка и нет ошибки, отображаем её
          <div className="w-16 h-16 mb-4 flex items-center justify-center">
            <img 
              src={`data:image/png;base64,${template.icon}`} 
              alt={`Иконка ${template.name}`}
              className="max-w-full max-h-full object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          // Если иконки нет или ошибка, показываем первую букву названия
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <span className="text-3xl font-bold  font-bold">{template.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <h3 className="text-2xl  font-semibold mb-2">{template.name}</h3>
        <p className="text-muted-foreground text-sm">{template.description}</p>
        <div className="mt-2 text-xs text-muted-foreground">{`.${template.file_extension}`}</div>
      </div>
    </div>
  );
};

// Модальное окно для отображения результата с полем для имени конфигурации
const ResultModal = ({ isOpen, onClose, result, onSave, onDownload }) => {
  const [configName, setConfigName] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const [saveError, setSaveError] = useState('');
  
  // Устанавливаем имя по умолчанию при открытии модального окна
  useEffect(() => {
    if (isOpen && result) {
      setConfigName(`${result.serviceName} конфигурация`);
      // Сбрасываем статус сохранения при каждом открытии
      setSaveStatus(null);
      setSaveError('');
    }
  }, [isOpen, result]);
  
  if (!isOpen || !result) return null;
  
  // Функция для сохранения с обработкой статуса
  const handleSave = async () => {
    if (!configName.trim()) {
      setSaveStatus('error');
      setSaveError('Введите название конфигурации');
      return;
    }
    
    setSaveStatus('saving');
    try {
      await onSave(configName);
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error.message || 'Ошибка при сохранении');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl  font-semibold">Конфигурация для {result.serviceName}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">{result.format}</span>
            <button 
              className="text-sm text-primary hover:underline flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
              onClick={() => navigator.clipboard.writeText(result.content)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375H9.75a3.375 3.375 0 00-3.375 3.375v1.875m12 0v-1.875a3.375 3.375 0 00-3.375-3.375H9.75a3.375 3.375 0 00-3.375 3.375v1.875" />
              </svg>
              Копировать
            </button>
          </div>
          
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono whitespace-pre min-h-[300px] max-h-[500px]">
            {result.content}
          </pre>
          
          {/* Поле для ввода названия конфигурации */}
          <div className="mt-4 mb-4">
            <label htmlFor="config-name" className="block text-sm font-medium mb-1">
              Название конфигурации
            </label>
            <input
              id="config-name"
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Введите название для сохранения"
            />
          </div>
          
          <div className="flex mt-4 gap-2">
            <button 
              className={`flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm flex items-center justify-center ${saveStatus === 'saving' ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border rounded-lg hover:shadow-md transition-all duration-200 -2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                  </svg>
                  Сохранить в профиль
                </>
              )}
            </button>
            <button 
              className="flex-1 border rounded-lg hover:shadow-md transition-all duration-200  border-input bg-background py-2 px-4 rounded-md hover:bg-accent transition-colors text-sm flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
              onClick={() => onDownload(configName)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Скачать
            </button>
          </div>
          
          {/* Сообщение об успешном сохранении */}
          {saveStatus === 'success' && (
            <div className="mt-3 p-2 bg-green-50 border rounded-lg hover:shadow-md transition-all duration-200  border-green-200 text-green-700 rounded-md text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Конфигурация успешно сохранена
            </div>
          )}
          
          {/* Сообщение об ошибке */}
          {saveStatus === 'error' && (
            <div className="mt-3 p-2 bg-red-50 border rounded-lg hover:shadow-md transition-all duration-200  border-red-200 text-red-700 rounded-md text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {saveError || 'Ошибка при сохранении конфигурации'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Configurator = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [dependencies, setDependencies] = useState({});
  const [formValues, setFormValues] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configResult, setConfigResult] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        
        // Используем новый эндпоинт /templates
        const response = await api.get('/templates');
        
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        // Проверяем наличие данных
        if (!response.data) {
          throw new Error('Сервер вернул пустой ответ');
        }
        
        // Устанавливаем шаблоны из полученных данных
        setTemplates(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке шаблонов:', error);
        setErrorMessage('Не удалось загрузить список доступных шаблонов: ' + error.message);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // Отладочный эффект для отслеживания изменений формы
  useEffect(() => {
    console.log("Form values:", formValues);
    console.log("Dependencies:", dependencies);
    if (formValues.ssl_enabled !== undefined) {
      console.log("SSL enabled:", formValues.ssl_enabled);
    }
  }, [formValues, dependencies]);

  // Обновленная обработка метаданных формы с использованием правильного эндпоинта
  const handleSelectTemplate = async (template) => {
    setSelectedTemplate(template);
    setIsLoadingFields(true);
    setErrorMessage(null);
    
    try {
      // Загрузка метаданных формы для выбранного шаблона через правильный эндпоинт
      const response = await api.get(`/form-metadata/${template.name}`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить форму');
      }
      
      // Проверяем наличие данных
      if (!response.data) {
        throw new Error('Сервер вернул пустой ответ');
      }
      
      const data = response.data;
      
      // Предварительная обработка полей
      const processedFields = data.fields.map(field => {
        // Особая обработка для полей Dockerfile, содержащих JSON-строки в placeholder
        if (template.name === 'dockerfile') {
          // Пытаемся определить, является ли placeholder строкой, представляющей JSON
          if (field.placeholder && typeof field.placeholder === 'string') {
            try {
              // Если это выглядит как JSON-строка, сохраняем ее как есть
              if ((field.placeholder.startsWith('[') && field.placeholder.endsWith(']')) || 
                  (field.placeholder.startsWith('{') && field.placeholder.endsWith('}'))) {
                // Оставляем как есть
              }
            } catch (e) {
              console.warn(`Не удалось обработать placeholder для поля ${field.name}:`, e);
            }
          }
        }
        
        return field;
      });
      
      setFormFields(processedFields);
      setDependencies(data.dependencies || {});
      
      // Инициализация формы значениями по умолчанию
      const initialValues = {};
      data.fields.forEach(field => {
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          initialValues[field.name] = field.defaultValue;
        } else if (field.type === 'checkbox') {
          initialValues[field.name] = false;
        } else if (['copy_files', 'run_commands', 'expose_ports', 'cmd', 'volumes'].includes(field.name)) {
          // Для массивов - пустой массив
          initialValues[field.name] = [];
        } else if (['env_variables', 'labels'].includes(field.name)) {
          // Для объектов - пустой объект
          initialValues[field.name] = {};
        } else {
          // Для простых типов - пустая строка
          initialValues[field.name] = '';
        }
      });
      
      console.log("Initial form values:", initialValues);
      setFormValues(initialValues);
      setIsModalOpen(true);
      setShowAdvanced(false);
    } catch (error) {
      console.error('Ошибка при загрузке метаданных формы:', error);
      setErrorMessage('Не удалось загрузить форму для этого шаблона');
    } finally {
      setIsLoadingFields(false);
    }
  };

  // Функция обработки ввода (без изменений)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Если это чекбокс, используем свойство checked
    if (type === 'checkbox') {
      console.log(`Changing ${name} to ${checked}`);
      setFormValues(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    // Для других типов полей
    console.log(`Changing ${name} to ${value}`);
    
    // Просто сохраняем введенное значение напрямую
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обновленная функция сохранения конфигурации в профиль
  // Обновленная функция сохранения конфигурации в профиль
  const handleSaveToProfile = async (configName) => {
    try {
      // Получаем расширение из шаблона (по умолчанию — 'conf')
      const extension = selectedTemplate.file_extension || 'conf';
  
      // Очищаем имя и добавляем расширение, если его нет
      let finalName = configName.trim().replace(/[/\\?%*:|"<>]/g, '-');
      if (!finalName.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
        finalName += `.${extension}`;
      }
  
      // Создаем объект с данными для сохранения
      const saveData = {
        service: selectedTemplate.name,
        config_name: finalName,
        config_data: configResult.content
      };
  
      // Отправляем запрос на бэкенд
      const response = await api.post('/configurations', saveData);
  
      // Проверяем статус ответа
      if (response.status === 400) {
        throw new Error('Вы превысили лимит сохраненных файлов для вашего плана');
      }
  
      if (!response.ok) {
        throw new Error(response.error || 'Ошибка при сохранении конфигурации');
      }
  
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      throw error;
    }
  };
  

  // Обновленная функция скачивания конфигурации с использованием имени из поля
  const handleDownload = (configName) => {
    if (!configResult) return;
    
    const blob = new Blob([configResult.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Используем имя из поля ввода, но обеспечиваем правильное расширение файла
    // Удаляем запрещенные для имен файлов символы
    const sanitizedName = configName.replace(/[/\\?%*:|"<>]/g, '-').trim();
    
    // Добавляем расширение файла из шаблона, если оно еще не включено в имя
    const extension = selectedTemplate.file_extension || 'conf';
    let filename = sanitizedName;
    if (!filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
      filename = `${filename}.${extension}`;
    }
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Обновленная функция отправки формы для генерации конфигурации
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Подготовка данных для отправки
      const config = { ...formValues };
      
      console.log('Отправка данных конфигурации:', config);
      
      // Отправка запроса на бэкенд, используя name вместо id
      const response = await api.post(`/generate/${selectedTemplate.name}`, config);
      
      console.log('Получен ответ:', response);
      
      // Проверяем наличие ошибки в ответе
      if (!response.ok || response.error) {
        throw new Error(response.error || 'Ошибка при генерации конфигурации');
      }
      
      // Определяем, есть ли текстовое содержимое
      let content;
      
      if (response.isTextContent) {
        // Если это текстовый контент (не JSON)
        content = response.text;
      } else if (response.text && typeof response.text === 'string') {
        // Если есть текст
        content = response.text;
      } else if (response.data) {
        // Если есть данные
        if (typeof response.data === 'string') {
          content = response.data;
        } else {
          content = JSON.stringify(response.data, null, 2);
        }
      } else {
        throw new Error('Пустой ответ от сервера');
      }
      
      // Если контент получен, отображаем результат
      setConfigResult({
        content: content,
        format: selectedTemplate.file_extension || 'CONF',
        serviceName: selectedTemplate.name,
        configData: config // Сохраняем исходные данные для возможного редактирования
      });
      
      // Открываем всплывающее окно с результатом
      setResultModalOpen(true);
    } catch (error) {
      console.error('Ошибка при генерации конфигурации:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Компонент для подсказки c информацией о типе данных (без изменений)
  const Tooltip = ({ children, text, type }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    return (
      <div className="relative inline-block">
        <div
          className="text-muted-foreground ml-1 cursor-help"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onClick={() => setIsVisible(!isVisible)} // Для мобильных устройств
        >
          {children}
        </div>
        {isVisible && (
          <div className="absolute z-50 w-64 p-2 bg-background text-foreground text-sm rounded-md shadow-lg border rounded-lg hover:shadow-md transition-all duration-200  border-border left-0 top-full mt-1">
            {text}
            {type && (
              <div className="mt-1 pt-1 border rounded-lg hover:shadow-md transition-all duration-200 -t border-border">
                <span className="text-xs font-medium text-muted-foreground">Тип данных: {type}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Проверяет, является ли поле зависимым (без изменений)
  const isDependentField = (fieldName) => {
    for (const [parentField, dependentFields] of Object.entries(dependencies)) {
      if (dependentFields.includes(fieldName)) {
        return parentField;
      }
    }
    return null;
  };

  // Группирует поля по зависимостям и типу (без изменений)
  const groupedFields = formFields.reduce((acc, field) => {
    const dependsOn = isDependentField(field.name);
    
    if (dependsOn) {
      // Это зависимое поле
      if (!acc.dependent[dependsOn]) {
        acc.dependent[dependsOn] = [];
      }
      acc.dependent[dependsOn].push(field);
    } else if (field.isAdvanced) {
      // Это расширенное поле
      if (field.name.startsWith('enable_') || field.type === 'checkbox') {
        acc.advancedToggles.push(field);
      } else {
        acc.advanced.push(field);
      }
    } else {
      // Это основное поле
      if (field.name.startsWith('enable_') || field.type === 'checkbox') {
        acc.mainToggles.push(field);
      } else {
        acc.main.push(field);
      }
    }
    
    return acc;
  }, {
    main: [],
    mainToggles: [],
    advanced: [],
    advancedToggles: [],
    dependent: {}
  });

  // Функция рендеринга полей (без изменений)
  const renderField = (field) => {
    switch (field.type) {
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={!!formValues[field.name]}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border rounded-lg hover:shadow-md transition-all duration-200 -gray-300 text-primary focus:ring-primary px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
            />
            <span className="ml-2 text-sm">Включить</span>
          </div>
        );
      
      default:
        // Автоматически определяем тип поля на основе нескольких признаков
        const isArrayField = 
          Array.isArray(field.defaultValue) || 
          (field.placeholder && typeof field.placeholder === 'string' && 
            (field.placeholder.startsWith('[') || field.placeholder.includes(','))) ||
          field.name.toLowerCase().includes('files') ||
          field.name.toLowerCase().includes('commands') ||
          field.name.toLowerCase().includes('ports') ||
          field.name.toLowerCase().includes('volumes') ||
          field.name.toLowerCase().includes('args') ||
          field.name.toLowerCase().includes('origins');
        
        const isObjectField = 
          (typeof field.defaultValue === 'object' && field.defaultValue !== null && !Array.isArray(field.defaultValue)) || 
          (field.placeholder && typeof field.placeholder === 'string' && field.placeholder.startsWith('{')) ||
          field.name.toLowerCase().includes('variables') ||
          field.name.toLowerCase().includes('labels') ||
          field.name.toLowerCase().includes('env') ||
          field.name.toLowerCase().includes('config') && !isArrayField;
        
        if (isArrayField) {
          // Получаем текущее значение (массив)
          const currentArray = Array.isArray(formValues[field.name]) ? formValues[field.name] : [];
          // Преобразуем массив в текст с новыми строками
          const textValue = currentArray.join('\n');
          
          // Извлекаем примеры из placeholder, если они есть
          let placeholderText = "Каждый элемент с новой строки";
          let exampleItems = [];
          
          if (field.placeholder && typeof field.placeholder === 'string') {
            try {
              // Пытаемся извлечь примеры из формата массива в placeholder
              const matches = field.placeholder.match(/\[([^\]]*)\]/);
              if (matches && matches[1]) {
                // Удаляем все одинарные кавычки и разделяем по запятым
                exampleItems = matches[1].replace(/'/g, '').split(',').map(item => item.trim());
              }
            } catch (e) {
              console.warn("Не удалось разобрать placeholder для массива:", field.placeholder);
            }
          }
          
          // Определяем контекстно-зависимый placeholder на основе имени поля
          const fieldNameLower = field.name.toLowerCase();
          if (fieldNameLower.includes('command')) {
            placeholderText = "Каждая команда с новой строки";
          } else if (fieldNameLower.includes('port')) {
            placeholderText = "Каждый порт с новой строки";
          } else if (fieldNameLower.includes('file')) {
            placeholderText = "Каждый файл с новой строки";
          } else if (fieldNameLower.includes('volume')) {
            placeholderText = "Каждый том с новой строки";
          } else if (fieldNameLower.includes('arg')) {
            placeholderText = "Каждый аргумент с новой строки";
          } else if (fieldNameLower.includes('origin')) {
            placeholderText = "Каждый источник с новой строки";
          }
          
          // Добавляем "Например:" к подсказке, если у нас есть примеры
          if (exampleItems.length > 0) {
            placeholderText += "\nНапример:";
          }
          
          return (
            <textarea
              id={field.name}
              name={field.name}
              value={textValue}
              onChange={(e) => {
                // Разбиваем текст на строки и фильтруем пустые строки
                const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                handleArrayInputChange(field.name, lines);
              }}
              placeholder={exampleItems.length > 0 ? `${placeholderText}\n${exampleItems.join('\n')}` : placeholderText}
              className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
              required={field.required}
            />
          );
        } else if (isObjectField) {
          // Для объектов используем формат ключ:значение
          const currentObj = typeof formValues[field.name] === 'object' && formValues[field.name] !== null 
            ? formValues[field.name] : {};
          
          // Преобразуем объект в текст формата "ключ:значение"
          const objLines = Object.entries(currentObj).map(([key, value]) => `${key}:${value}`);
          const textValue = objLines.join('\n');
          
          // Попробуем извлечь примеры из placeholder
          let placeholderText = "Формат: ключ:значение, каждая пара с новой строки";
          let examplePairs = [];
          
          if (field.placeholder && typeof field.placeholder === 'string') {
            try {
              // Пытаемся извлечь примеры из формата объекта в placeholder
              const matches = field.placeholder.match(/\{([^}]*)\}/);
              if (matches && matches[1]) {
                // Разделяем на пары ключ:значение
                const pairsString = matches[1].replace(/'/g, '').trim();
                
                // Разбиваем строку на пары
                const pairs = pairsString.split(',');
                examplePairs = pairs.map(pair => {
                  const [key, value] = pair.split(':').map(part => part.trim());
                  return `${key}:${value}`;
                }).filter(pair => pair.includes(':'));
              }
            } catch (e) {
              console.warn("Не удалось разобрать placeholder для объекта:", field.placeholder);
            }
          }
          
          // Определяем контекстно-зависимый placeholder на основе имени поля
          const fieldNameLower = field.name.toLowerCase();
          if (fieldNameLower.includes('env') || fieldNameLower.includes('variable')) {
            placeholderText = "Формат: ПЕРЕМЕННАЯ:значение, каждая с новой строки";
          } else if (fieldNameLower.includes('label')) {
            placeholderText = "Формат: ключ:значение, каждая метка с новой строки";
          } else if (fieldNameLower.includes('config')) {
            placeholderText = "Формат: параметр:значение, каждый с новой строки";
          }
          
          // Добавляем "Например:" к подсказке, если у нас есть примеры
          if (examplePairs.length > 0) {
            placeholderText += "\nНапример:";
          }
          
          return (
            <textarea
              id={field.name}
              name={field.name}
              value={textValue}
              onChange={(e) => {
                // Преобразуем текст обратно в объект
                const newObj = {};
                e.target.value.split('\n')
                  .map(line => line.trim())
                  .filter(line => line !== '' && line.includes(':'))
                  .forEach(line => {
                    const [key, ...valueParts] = line.split(':');
                    const value = valueParts.join(':'); // Объединяем обратно, если в значении были двоеточия
                    if (key && key.trim()) {
                      newObj[key.trim()] = value.trim();
                    }
                  });
                
                // Обновляем состояние формы
                handleArrayInputChange(field.name, newObj);
              }}
              placeholder={examplePairs.length > 0 ? `${placeholderText}\n${examplePairs.join('\n')}` : placeholderText}
              className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
              required={field.required}
            />
          );
        } else {
          // Работа с обычными полями ввода текста
          // Выбираем placeholder
          let placeholder = '';
          
          if (field.placeholder) {
            if (typeof field.placeholder === 'string') {
              placeholder = field.placeholder;
            } else if (typeof field.placeholder === 'object' && field.placeholder !== null) {
              placeholder = JSON.stringify(field.placeholder);
            } else {
              placeholder = String(field.placeholder);
            }
          } else if (field.example) {
            placeholder = `Например: ${field.example}`;
          }
          
          // Используем стандартный механизм placeholder HTML
          return (
            <input
              id={field.name}
              name={field.name}
              type={field.type === 'number' ? 'number' : 'text'}
              value={formValues[field.name] || ''}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
              required={field.required}
            />
          );
        }
    }
  };

  // Рендеринг метки поля с подсказкой (без изменений)
  const renderFieldLabel = (field) => {
    return (
      <div className="flex items-center mb-1">
        <label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.description && (
          <Tooltip text={field.description} type={field.variableType}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </Tooltip>
        )}
      </div>
    );
  };

  // Рендеринг блока полей с зависимыми полями (без изменений)
  const renderFieldWithDependencies = (field) => {
    console.log(`Rendering toggle field: ${field.name}, value: ${formValues[field.name]}`);
    
    // Получаем список зависимых полей имен из объекта dependencies
    const dependentFieldNames = dependencies[field.name] || [];
    console.log(`Dependent field names for ${field.name}:`, dependentFieldNames);
    
    return (
      <div key={field.name} className="space-y-4 pt-2">
        {/* Основное поле (чекбокс) */}
        <div>
          {renderFieldLabel(field)}
          {renderField(field)}
        </div>
        
        {/* Зависимые поля (показываются только если чекбокс включен) */}
        {formValues[field.name] === true && dependentFieldNames.length > 0 && (
          <div className="pl-4 border rounded-lg hover:shadow-md transition-all duration-200 -l-2 border-primary/30 space-y-3 mt-2 transition-all duration-300">
            {dependentFieldNames.map(dependentName => {
              // Находим полное определение зависимого поля
              const dependentField = formFields.find(f => f.name === dependentName);
              
              if (!dependentField) {
                console.warn(`Dependent field not found: ${dependentName}`);
                return null;
              }
              
              console.log(`Rendering dependent field: ${dependentField.name}`);
              
              return (
                <div key={dependentField.name}>
                  {renderFieldLabel(dependentField)}
                  {renderField(dependentField)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Создать конфигурацию</h1>
        <p className="text-muted-foreground mb-8">
          Выберите шаблон, для которого вы хотите создать конфигурацию, и заполните необходимые параметры.
        </p>
        
        {/* Индикатор загрузки шаблонов */}
        {isLoadingTemplates ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4"></div>
            <p>Загрузка доступных шаблонов...</p>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border rounded-lg hover:shadow-md transition-all duration-200  border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            <p>{errorMessage}</p>
          </div>
        ) : (
          // Сетка шаблонов
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {templates && templates.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Шаблоны не найдены</p>
              </div>
            ) : (
              templates && templates.map(template => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onClick={handleSelectTemplate} 
                />
              ))
            )}
          </div>
        )}
        
        {/* Модальное окно с формой */}
        {isModalOpen && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl  font-semibold">Настройка {selectedTemplate.name}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-100 border rounded-lg hover:shadow-md transition-all duration-200  border-red-300 text-red-700 rounded-md">
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}
                
                {isLoadingFields ? (
                  <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-lg">Загрузка формы...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Основные обязательные поля */}
                    <div className="space-y-4">
                      {groupedFields.main.map(field => (
                        <div key={field.name}>
                          {renderFieldLabel(field)}
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                    
                    {/* Основные переключатели с зависимыми полями */}
                    <div className="space-y-6">
                      {groupedFields.mainToggles.map(field => renderFieldWithDependencies(field))}
                    </div>
                    
                    {/* Переключатель дополнительных настроек */}
                    {(groupedFields.advanced.length > 0 || groupedFields.advancedToggles.length > 0) && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="text-sm text-primary flex items-center"
                        >
                          {showAdvanced ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          )}
                          {showAdvanced ? 'Скрыть дополнительные настройки' : 'Показать дополнительные настройки'}
                        </button>
                      </div>
                    )}
                    
                    {/* Дополнительные настройки */}
                    {showAdvanced && (
                      <div className="space-y-6 pt-2 border rounded-lg hover:shadow-md transition-all duration-200 -t border-border">
                        {/* Дополнительные поля */}
                        <div className="space-y-4 mt-4">
                          {groupedFields.advanced.map(field => (
                            <div key={field.name}>
                              {renderFieldLabel(field)}
                              {renderField(field)}
                            </div>
                          ))}
                        </div>
                        
                        {/* Дополнительные переключатели с зависимыми полями */}
                        <div className="space-y-6">
                          {groupedFields.advancedToggles.map(field => renderFieldWithDependencies(field))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 border rounded-lg hover:shadow-md transition-all duration-200  border-input bg-background py-2 rounded-md hover:bg-accent transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                      >
                        {isLoading ? 'Генерация...' : 'Создать конфигурацию'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Модальное окно с результатом */}
        <ResultModal 
          isOpen={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          result={configResult}
          onSave={handleSaveToProfile}
          onDownload={handleDownload}
        />
      </div>
    </PageLayout>
  );
};

export default Configurator;