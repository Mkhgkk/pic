const { User } = require("./model");
const { Text } = require("./models/text");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/pic3", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => console.log("connected to db..."));

app.use(express.static("public"));
const port = process.env.PORT || 3001;

const SECRET = "fdfhfjdfdjfdjerwrereresaassa2dd@ddds";

// app.get('/', async(req, res) => {
//   res.send('ok')
// })

// app.get('/', (req, res) => res.send('Hello World!'))

// 从MongoDB数据库express-auth中的User表查询所有的用户信息
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post("/upload", async (req, res) => {
  const text = await Text.create({
    text: req.body.text,
  });

  return res.redirect("/pic");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/html/login.html"));
});

app.get("/pic", function (req, res) {
  res.sendFile(path.join(__dirname, "/html/pic.html"));
});

app.get("/signin", function (req, res) {
  res.sendFile(path.join(__dirname, "/html/signin.html"));
});

app.post("/register", async (req, res) => {
  // console.log(req.body)
  // 在MongoDB数据库表USer中新增一个用户
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  // res.send("register");
  res.redirect("/pic");
});

app.post("/pic", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  return res.redirect("/");
});

app.post("/login", async (req, res) => {
  // res.send('login')
  // 1.看用户是否存在
  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.redirect("/");
  }

  // 2.用户如果存在，则看密码是否正确
  const isPasswordValid = require("bcryptjs").compareSync(
    req.body.password,
    user.password
  );
  if (!isPasswordValid) {
    // 密码无效
    return res.redirect("/");
  }

  return res.redirect("/pic");
  // 生成token
  const token = jwt.sign(
    {
      id: String(user._id),
    },
    SECRET
  );

  res.send({
    user,
    token,
  });
});

// 中间件：验证授权
const auth = async (req, res, next) => {
  // 获取客户端请求头的token
  const rawToken = String(req.headers.authorization).split(" ").pop();
  const tokenData = jwt.verify(rawToken, SECRET);
  //  console.log(tokenData)
  // 获取用户id
  const id = tokenData.id;
  //  const user = await User.findById(id)
  req.user = await User.findById(id);
  next();
};

app.get("/profile", auth, async (req, res) => {
  res.send(req.user);
});

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
