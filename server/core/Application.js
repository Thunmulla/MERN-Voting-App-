import Express from "express";

const App = Express()
App.use(Express.urlencoded({extended: false}))
App.use(Express.json())
export default App