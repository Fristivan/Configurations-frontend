import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';

const SavedConfigurations = () => {
  const [configurations, setConfigurations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ config_name: '', config_data: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Загрузка списка конфигураций
  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const response = await api.get('/configurations');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить список конфигураций');
      }
      
      setConfigurations(response.data || []);
    } catch (error) {
      console.error('Ошибка при загрузке конфигураций:', error);
      setErrorMessage('Ошибка при загрузке конфигураций: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка одной конфигурации
  const fetchConfigurationDetails = async (configId) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const response = await api.get(`/configurations/${configId}`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить конфигурацию');
      }
      
      setSelectedConfig(response.data);
      setEditFormData({
        config_name: response.data.config_name || '',
        config_data: response.data.config_data || ''
      });
    } catch (error) {
      console.error('Ошибка при загрузке конфигурации:', error);
      setErrorMessage('Ошибка при загрузке конфигурации: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка выбора конфигурации для просмотра
  const handleSelectConfiguration = (configId) => {
    fetchConfigurationDetails(configId);
    setIsEditing(false);
  };

  // Начать редактирование
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Восстанавливаем исходные данные
    setEditFormData({
      config_name: selectedConfig.config_name || '',
      config_data: selectedConfig.config_data || ''
    });
  };

  // Обновление данных формы при редактировании
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Сохранение изменений
  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const response = await api.put(`/configurations/${selectedConfig.id}`, editFormData);
      
      if (!response.ok) {
        throw new Error('Не удалось сохранить изменения');
      }
      
      // Обновляем локальные данные
      setSelectedConfig({
        ...selectedConfig,
        config_name: editFormData.config_name,
        config_data: editFormData.config_data
      });
      
      // Обновляем данные в списке
      setConfigurations(prevConfigs => 
        prevConfigs.map(config => 
          config.id === selectedConfig.id 
            ? {...config, config_name: editFormData.config_name} 
            : config
        )
      );
      
      setSuccessMessage('Конфигурация успешно обновлена');
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении конфигурации:', error);
      setErrorMessage('Ошибка при сохранении: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление конфигурации
  const handleDeleteConfiguration = async () => {
    if (!window.confirm('Вы действительно хотите удалить эту конфигурацию?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const response = await api.delete(`/configurations/${selectedConfig.id}`);
      
      if (!response.ok) {
        throw new Error('Не удалось удалить конфигурацию');
      }
      
      // Удаляем из списка
      setConfigurations(prevConfigs => 
        prevConfigs.filter(config => config.id !== selectedConfig.id)
      );
      
      setSelectedConfig(null);
      setSuccessMessage('Конфигурация успешно удалена');
    } catch (error) {
      console.error('Ошибка при удалении конфигурации:', error);
      setErrorMessage('Ошибка при удалении: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Скачивание конфигурации
  // Скачивание конфигурации
    const handleDownloadConfiguration = () => {
        if (!selectedConfig) return;
        
        const blob = new Blob([selectedConfig.config_data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Используем расширение из конфигурации, если оно есть
        let filename = selectedConfig.config_name;
        
        // Проверяем наличие расширения в имени
        if (selectedConfig.file_extension && !filename.toLowerCase().endsWith(`.${selectedConfig.file_extension.toLowerCase()}`)) {
        filename = `${filename}.${selectedConfig.file_extension}`;
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Сохраненные конфигурации</h1>
        <p className="text-muted-foreground mb-8">
          Управление вашими сохраненными конфигурациями.
        </p>
        
        {/* Показываем сообщения об ошибках или успешных операциях */}
        {errorMessage && (
          <div className="bg-red-50 border rounded-lg hover:shadow-md transition-all duration-200  border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border rounded-lg hover:shadow-md transition-all duration-200  border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Левая колонка - список конфигураций */}
          <div className="md:col-span-1">
            <div className="bg-card shadow-md rounded-2xl border border-border  p-4 rounded-lg border rounded-lg hover:shadow-md transition-all duration-200  border-border h-full">
              <h2 className="text-2xl  font-semibold mb-4">Список конфигураций</h2>
              
              {isLoading && !selectedConfig ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4"></div>
                  <p>Загрузка конфигураций...</p>
                </div>
              ) : configurations.length === 0 ? (
                <p className="text-muted-foreground">У вас еще нет сохраненных конфигураций.</p>
              ) : (
                <ul className="space-y-2">
                  {configurations.map(config => (
                    <li 
                      key={config.id} 
                      className={`p-3 rounded-md cursor-pointer transition-colors hover:bg-muted ${selectedConfig && selectedConfig.id === config.id ? 'bg-muted' : ''}`}
                      onClick={() => handleSelectConfiguration(config.id)}
                    >
                      <div className="font-medium">{config.config_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {config.service || 'Неизвестный сервис'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(config.created_at).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Правая колонка - детали конфигурации */}
          <div className="md:col-span-2">
            {selectedConfig ? (
              <div className="bg-card shadow-md rounded-2xl border border-border  p-6 rounded-lg border rounded-lg hover:shadow-md transition-all duration-200  border-border">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4"></div>
                    <p>Загрузка конфигурации...</p>
                  </div>
                ) : isEditing ? (
                  /* Режим редактирования */
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl  font-semibold">Редактирование конфигурации</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="config_name" className="block text-sm font-medium mb-1">
                          Название конфигурации
                        </label>
                        <input
                          type="text"
                          id="config_name"
                          name="config_name"
                          value={editFormData.config_name}
                          onChange={handleEditFormChange}
                          className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background text-foreground px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="config_data" className="block text-sm font-medium mb-1">
                          Содержимое конфигурации
                        </label>
                        <textarea
                          id="config_data"
                          name="config_data"
                          value={editFormData.config_data}
                          onChange={handleEditFormChange}
                          className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background text-foreground font-mono text-sm min-h-[300px]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleSaveChanges}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                        disabled={isLoading}
                      >
                        Сохранить изменения
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="border rounded-lg hover:shadow-md transition-all duration-200  border-input bg-background px-4 py-2 rounded-md hover:bg-accent transition-colors px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Режим просмотра */
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl  font-semibold">{selectedConfig.config_name}</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleStartEdit}
                          className="text-sm text-primary hover:underline flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Редактировать
                        </button>
                        <button
                          onClick={handleDeleteConfiguration}
                          className="text-sm text-red-600 hover:underline flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Удалить
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Сервис</div>
                      <div className="font-medium">{selectedConfig.service || 'Не указан'}</div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Дата создания</div>
                      <div className="font-medium">
                        {selectedConfig.created_at 
                          ? new Date(selectedConfig.created_at).toLocaleString() 
                          : 'Не указана'}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm text-muted-foreground">Содержимое конфигурации</div>
                        <button
                          onClick={handleDownloadConfiguration}
                          className="text-sm text-primary hover:underline flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Скачать
                        </button>
                      </div>
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono whitespace-pre h-[300px]">
                        {selectedConfig.config_data}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card shadow-md rounded-2xl border border-border  p-6 rounded-lg border rounded-lg hover:shadow-md transition-all duration-200  border-border flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p>Выберите конфигурацию из списка слева для просмотра</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SavedConfigurations;