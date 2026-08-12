import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabaseClient';

type PushWindow = Window & {
  __initPush?: (token: string) => Promise<void>;
};

const urlBase64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const bytes = atob(normalized);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
};

const initPush = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  
  if (!token) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    await navigator.serviceWorker.register('/sw.js');
    const readyRegistration = await navigator.serviceWorker.ready;
    let subscription = await readyRegistration.pushManager.getSubscription();

    if (!subscription) {
      const response = await fetch('/api/vapidPublicKey');
      if (!response.ok) throw new Error('Unable to get the push public key.');
      const applicationServerKey = urlBase64ToUint8Array(await response.text());
      subscription = await readyRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Unable to save the push subscription.');
  } catch (error) {
    console.warn('Push notifications could not be enabled:', error);
  }
};

(window as PushWindow).__initPush = initPush;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
