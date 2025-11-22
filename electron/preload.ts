import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('easyTalk', {
  version: process.env.npm_package_version,
});









