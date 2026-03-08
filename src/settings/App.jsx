import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULTS } from '../shared/constants';
import ProfileForm from './components/ProfileForm';
import ToneSelect from './components/ToneSelect';
import ExampleComments from './components/ExampleComments';
import ApiKeyField from './components/ApiKeyField';

export default function App() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState(DEFAULTS.TONE);
  const [exampleComments, setExampleComments] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  // Load existing settings on mount
  useEffect(() => {
    chrome.storage.local.get(
      [STORAGE_KEYS.USER_PROFILE, STORAGE_KEYS.API_KEY],
      (result) => {
        const profile = result[STORAGE_KEYS.USER_PROFILE];
        if (profile) {
          setName(profile.name || '');
          setRole(profile.role || '');
          setTone(profile.tone || DEFAULTS.TONE);
          setExampleComments(profile.exampleComments || '');
        }
        if (result[STORAGE_KEYS.API_KEY]) {
          setApiKey(result[STORAGE_KEYS.API_KEY]);
        }
      }
    );
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({
      [STORAGE_KEYS.USER_PROFILE]: { name, role, tone, exampleComments },
      [STORAGE_KEYS.API_KEY]: apiKey,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto p-header-pad py-8">
      <h1 className="text-base font-bold text-text-primary tracking-heading mb-6">
        Sift Settings
      </h1>

      <div className="flex flex-col gap-6">
        <ProfileForm
          name={name}
          onNameChange={setName}
          role={role}
          onRoleChange={setRole}
        />

        <ToneSelect tone={tone} onToneChange={setTone} />

        <ExampleComments
          value={exampleComments}
          onChange={setExampleComments}
        />

        <ApiKeyField value={apiKey} onChange={setApiKey} />

        <button
          onClick={handleSave}
          className="w-full py-2.5 text-[13px] font-semibold rounded-btn transition-all duration-default
            bg-primary text-white hover:bg-primary-hover"
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>

        {saved && (
          <p className="text-[11px] font-medium text-status-success text-center">
            Settings saved successfully.
          </p>
        )}
      </div>
    </div>
  );
}
