import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { getConfig, saveConfig, clearConfig, isConfigured, type AppConfig } from '@/lib/config';
import { initializeFirebase } from '@/lib/firebase';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [config, setConfig] = useState<AppConfig>({
    firebase: {
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
    },
    openaiApiKey: '',
  });

  useEffect(() => {
    const existingConfig = getConfig();
    if (existingConfig) {
      setConfig(existingConfig);
    }
  }, []);

  const handleSave = () => {
    try {
      // Validate required fields
      if (!config.firebase.apiKey || !config.firebase.projectId || !config.openaiApiKey) {
        showToast('請填寫所有必填欄位（Firebase API Key, Project ID, OpenAI API Key）', 'error');
        return;
      }

      saveConfig(config);

      // Try to initialize Firebase with new config
      const result = initializeFirebase();
      if (result) {
        showToast('✅ 設定已儲存並成功初始化 Firebase', 'success');
        setTimeout(() => navigate('/'), 1000);
      } else {
        showToast('設定已儲存，但 Firebase 初始化失敗，請檢查設定', 'error');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      showToast('儲存失敗，請檢查設定', 'error');
    }
  };

  const handleClear = () => {
    if (confirm('確定要清除所有設定嗎？此操作無法復原。')) {
      clearConfig();
      setConfig({
        firebase: {
          apiKey: '',
          authDomain: '',
          databaseURL: '',
          projectId: '',
          storageBucket: '',
          messagingSenderId: '',
          appId: '',
          measurementId: '',
        },
        openaiApiKey: '',
      });
      showToast('設定已清除', 'info');
    }
  };

  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.firebase && json.openaiApiKey) {
            setConfig(json);
            showToast('設定已匯入', 'success');
          } else {
            showToast('JSON 格式錯誤', 'error');
          }
        } catch (error) {
          showToast('匯入失敗', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportJson = () => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dune-config.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('設定已匯出', 'success');
  };

  const configured = isConfigured();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">⚙️ 系統設定</h1>

      <div className="space-y-6">
        {/* Status Banner */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-orbitron text-dune-sand mb-2">設定狀態</h3>
              <p className="text-dune-sand/70 font-rajdhani">
                {configured ? (
                  <span className="text-green-400">✅ 已完成設定</span>
                ) : (
                  <span className="text-yellow-400">⚠️ 尚未設定或設定不完整</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleImportJson}>
                匯入 JSON
              </Button>
              <Button variant="secondary" onClick={handleExportJson}>
                匯出 JSON
              </Button>
            </div>
          </div>
        </Card>

        {/* Firebase Configuration */}
        <Card>
          <h2 className="text-2xl font-orbitron text-dune-spice mb-4">Firebase 設定</h2>
          <p className="text-dune-sand/70 font-rajdhani mb-4">
            請前往 Firebase Console 取得您的專案設定
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-dune-sand font-rajdhani mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.firebase.apiKey}
                onChange={(e) => setConfig({ ...config, firebase: { ...config.firebase, apiKey: e.target.value } })}
                className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
                placeholder="AIzaSy..."
              />
            </div>

            <div>
              <label className="block text-dune-sand font-rajdhani mb-2">
                Auth Domain
              </label>
              <input
                type="text"
                value={config.firebase.authDomain}
                onChange={(e) => setConfig({ ...config, firebase: { ...config.firebase, authDomain: e.target.value } })}
                className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
                placeholder="your-project.firebaseapp.com"
              />
            </div>

            <div>
              <label className="block text-dune-sand font-rajdhani mb-2">
                Project ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.firebase.projectId}
                onChange={(e) => setConfig({ ...config, firebase: { ...config.firebase, projectId: e.target.value } })}
                className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
                placeholder="your-project-id"
              />
            </div>

            <div>
              <label className="block text-dune-sand font-rajdhani mb-2">
                Storage Bucket
              </label>
              <input
                type="text"
                value={config.firebase.storageBucket}
                onChange={(e) => setConfig({ ...config, firebase: { ...config.firebase, storageBucket: e.target.value } })}
                className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
                placeholder="your-project.appspot.com"
              />
            </div>

            <div>
              <label className="block text-dune-sand font-rajdhani mb-2">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={config.firebase.messagingSenderId}
                onChange={(e) => setConfig({ ...config, firebase: { ...config.firebase, messagingSenderId: e.target.value } })}
                className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
                placeholder="123456789012"
              />
            </div>

            <div>
              <label className="block text-dune-sand font-rajdhani mb-2">
                App ID
              </label>
              <input
                type="text"
                value={config.firebase.appId}
                onChange={(e) => setConfig({ ...config, firebase: { ...config.firebase, appId: e.target.value } })}
                className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
                placeholder="1:123456789012:web:..."
              />
            </div>
          </div>
        </Card>

        {/* OpenAI Configuration */}
        <Card>
          <h2 className="text-2xl font-orbitron text-dune-spice mb-4">OpenAI 設定</h2>
          <p className="text-dune-sand/70 font-rajdhani mb-4">
            請前往 OpenAI Platform 取得您的 API Key
          </p>

          <div>
            <label className="block text-dune-sand font-rajdhani mb-2">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={config.openaiApiKey}
              onChange={(e) => setConfig({ ...config, openaiApiKey: e.target.value })}
              className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice font-mono text-sm"
              placeholder="sk-proj-..."
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <Card>
          <div className="flex gap-4">
            <Button onClick={handleSave}>
              💾 儲存設定
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              取消
            </Button>
            <Button variant="danger" onClick={handleClear}>
              清除設定
            </Button>
          </div>

          <div className="mt-4 text-sm text-dune-sand/60 font-rajdhani space-y-1">
            <p>💡 提示：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>設定會儲存在瀏覽器的 localStorage 中</li>
              <li>不會上傳到任何伺服器，完全在本地端運行</li>
              <li>可以使用匯出/匯入功能備份設定</li>
              <li>清除瀏覽器資料會一併清除設定</li>
            </ul>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
