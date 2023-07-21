import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import * as WebAssembly from 'react-native-webassembly';
import axios from 'axios';
import {AssetsManager} from './src/asset-manager';
import {Dirs, FileSystem} from 'react-native-file-access';
import {Base64Url} from './src/base64url';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
    marginTop: 50,
    padding: 5,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  testContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },

  label: {
    flex: 3,
  },

  result: {
    flex: 1,
    textAlign: 'right',
  },
});

const TestResult: React.FC<{
  value: boolean | undefined;
  name: string;
}> = props => {
  const text = props.value === undefined ? '?' : props.value ? 'Pass' : 'Fail';
  const style = {
    color: props.value === undefined ? 'black' : props.value ? 'green' : 'red',
  };
  return (
    <View style={styles.testContainer}>
      <Text style={styles.label}>{props.name}:</Text>
      <Text style={[styles.result, style]}>{text}</Text>
    </View>
  );
};

export default function App() {
  // ---------------------------------------------------------------------------
  // variables
  // ---------------------------------------------------------------------------
  const [result1, setResult1] = useState<boolean>();
  const [result2, setResult2] = useState<boolean>();

  // ---------------------------------------------------------------------------
  // effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    wasmTest();
  }, []);

  // ---------------------------------------------------------------------------
  // functions
  // ---------------------------------------------------------------------------

  async function wasmTest() {
    try {
      const response = await axios({
        url: 'https://github.com/torch2424/wasm-by-example/raw/master/examples/hello-world/demo/assemblyscript/hello-world.wasm',
        method: 'get',
        responseType: 'arraybuffer',
      });

      // console.log('response', response.data);

      const x = await WebAssembly.instantiate<{
        add: (a: number, b: number) => number;
      }>(response.data);
      const firstResult = x.instance.exports.add(200, 300);
      console.log('first result  = ', firstResult);
      if (firstResult === 500) {
        setResult1(true);
      } else {
        setResult1(false);
      }
      // --------------------------------------------------------------

      await AssetsManager.copyAssets();
      const wasmBinPath = `${Dirs.DocumentDir}/wasmBin`;
      await AssetsManager.listFiles(wasmBinPath);
      const result = await FileSystem.readFile(
        `${wasmBinPath}/hello-world.wasm`,
        'base64',
      );
      const buffer = Base64Url.toBuffer(result);
      const module = await WebAssembly.instantiate<{
        add: (a: number, b: number) => number;
      }>(new Uint8Array(buffer));
      const secondResult = module.instance.exports.add(300, 200);
      console.log('second result = ', secondResult);
      if (secondResult === 500) {
        setResult2(true);
      } else {
        setResult2(false);
      }

      console.log('-----------------------------------------------');
    } catch (e) {
      throw e;
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Wasm test:</Text>
        <TestResult name="with remote file:" value={result1} />
        <TestResult name="with local file:" value={result2} />
      </View>
    </SafeAreaView>
  );
}
