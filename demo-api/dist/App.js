"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const Task_1 = __importDefault(require("./model/Task"));
const password = encodeURIComponent("!rlaehdrbs81");
const serviceAddress = process.env.MONGODB_ADDRESS || "localhost";
const mongoDb = `mongodb://root:${password}@${serviceAddress}:27017/test?authSource=admin`;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.get("/{}", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Task_1.default.findById({ _id: 1 });
    res.send(result === null || result === void 0 ? void 0 : result.toObject());
}));
app.post("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Task_1.default.create({
        _id: 1,
        title: "test",
        deacription: "test11",
        createdAt: Date.now()
    });
    console.log("save data");
    res.send("Hello world!!");
}));
console.log(mongoDb);
mongoose_1.default.connect(mongoDb)
    .then(() => {
    app.listen(3000, () => {
        console.log(`listening on port ${3000}`);
    });
});
