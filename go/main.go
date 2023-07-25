package main

import (
	"fmt"
	"syscall/js"
)

func print(this js.Value, inputs []js.Value) interface{} {
	return "hello js"
}

func add(this js.Value, inputs []js.Value) interface{} {
	a := inputs[0].Float()
	b := inputs[1].Float()
	return a + b
}

func main() {
	fmt.Println("hello")
	ch := make(chan struct{}, 0)
	js.Global().Set("add", js.FuncOf(add))
	js.Global().Set("print", js.FuncOf(print))
	<-ch
}
