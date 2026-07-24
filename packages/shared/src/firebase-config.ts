// Firebase configuration — shared across portfolio and dashboard

export const firebaseConfig = {
  apiKey: 'AIzaSyB0U1USDZ0APIV8Bw8eeZGn6QnzBBWjfBc',
  authDomain: 'fjml-studio.firebaseapp.com',
  projectId: 'fjml-studio',
  storageBucket: 'fjml-studio.appspot.com',
  messagingSenderId: '141934667896',
  appId: '1:141934667896:web:d8a0e14df887b7c9f0d60f',
};

export const firebaseConfigured = !!firebaseConfig.projectId;

export const LEADS_COLLECTION = 'leads';
export const BUILDS_COLLECTION = 'builds';
export const SHARED_BUILDS_COLLECTION = 'shared_builds';
export const TASKS_COLLECTION = 'tasks';
export const KB_PAGES_COLLECTION = 'kb_pages';
export const KB_SETTINGS_COLLECTION = 'kb_settings';

export const FB_VERSION = '12.12.1';
export const CONTACT_EMAIL = 'freddymarin.jpg@gmail.com';
