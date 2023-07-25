rm -rf ./dist/main.wasm
rm -rf ./android/link-assets-manifest.json
rm -rf ./android/app/src/main/assets/custom/main.wasm
echo \"wasm files removed!\"
cd ./go 
# GOOS=js GOARCH=wasm go build -o ../dist/main.wasm
# tinygo build -target wasm -o ../dist/main.wasm
tinygo build -target wasm -o ../dist/main.wasm -no-debug
cd ../
react-native-asset
echo \"wasm compiled successfully!\"