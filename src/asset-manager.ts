import {Dirs, FileSystem} from 'react-native-file-access';
import {Platform} from 'react-native';

export const AssetsManager = {
  async listFiles(path: string, lvl: number = 0) {
    try {
      const files = await FileSystem.ls(path);
      if (!files.length && lvl === 0) console.log('empty path:', path);
      let gap = '';
      for (let i = 0; i <= lvl; i++) {
        gap += '──';
      }

      for (let file of files) {
        const filePath = `${path}/${file}`;
        const isDir = await FileSystem.isDir(filePath);
        if (isDir) {
          console.log(`├${gap}`, file, '(directory)');
          lvl++;
          await AssetsManager.listFiles(filePath, lvl);
        } else {
          console.log(`├${gap}`, file, '(file)');
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  async copyAssets() {
    await AssetsManager.createDir();
    if (Platform.OS === 'ios') {
      await AssetsManager.copyIOSAssets();
    } else {
      await AssetsManager.copyAndroidAssets();
    }
  },

  async copyAndroidAssets() {
    try {
      const src = 'custom';
      const dest = `${Dirs.DocumentDir}/wasmBin`;

      await FileSystem.cpAsset(
        `${src}/hello-world.wasm`,
        `${dest}/hello-world.wasm`,
      );
      await FileSystem.cpAsset(`${src}/main.wasm`, `${dest}/main.wasm`);
    } catch (e) {
      console.error(e);
    }
  },

  async copyIOSAssets() {
    const src = `${Dirs.MainBundleDir}`;
    const dest = `${Dirs.DocumentDir}/wasmBin`;

    try {
      await FileSystem.cp(
        `${src}/hello-world.wasm`,
        `${dest}/hello-world.wasm`,
      );
      await FileSystem.cp(`${src}/main.wasm`, `${dest}/main.wasm`);
    } catch (e) {
      console.error(e);
    }
  },

  async createDir() {
    const dirPath = `${Dirs.DocumentDir}/wasmBin`;
    const pathExist = await FileSystem.exists(dirPath);
    if (pathExist) {
      await FileSystem.unlink(dirPath);
    }
    const path = await FileSystem.mkdir(dirPath);
    console.log('Folder created, in path:', path);
  },
};
