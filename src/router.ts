import { Router, Request, Response} from 'express';
import Crowller from './crowller';
import DellAnalyzer from './dellAnalyzer';
import fs from 'fs';
import path from 'path';

const router = Router()

router.get('/', (request: Request, response: Response) => {
  
  const isLogin = request.session ? request.session.login: false;

  if(isLogin){
    response.send(`
    <html>
    <body>
      <a href='getData'>爬取内容</a>
      <a href='logout'>退出</a>
    </body>
  </html>
    `)
  }else {
    response.send(`
      <html>
        <body>
          <form method="post" action="/login" >
            <input type="password" name="password" />
            <button>登录</button>
          </form>
        </body>

      </html>
      `);

  }


  
});


router.get('/logout', (request: Request, response: Response) => {
  if(request.session){
    request.session.login = undefined;
  }
  response.redirect('/');
});



interface RequestWithBody extends Request {
  body:  {
    [key: string]: string | undefined;
  }
}

router.get('/getData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login: false;
  if(isLogin){
    const secret = 'x3b174jsx';
    const  url = 
    `http://www.dell-lee.com/typescript/demo.html?secret=${secret}` ;

    const analyzer = DellAnalyzer.getInstance();
    const crowller = new Crowller(url, analyzer);
    res.send("get data success. ");

  }else{
    // res.send(`${req.teacherName} password Error!`);
    res.redirect('/');
  }
  
});

router.get('/showData', (req: RequestWithBody, res: Response) => {
  const filePath = path.resolve(__dirname, '../data/course.json');
  const result = fs.readFileSync(filePath,  'utf-8');
  res.json(JSON.parse(result));
});



router.post('/login', (req: RequestWithBody, res: Response) => {
  const {password} = req.body;
  const isLogin = req.session ? req.session.login: false;
  if(isLogin){
    res.send("已经登录过");    
    res.redirect("/");
  }else {
    if(req.body.password === '123' && req.session){
        req.session.login = true;
        // res.send("登录成功！");
        res.redirect("/");
    }else{
      res.send("登录失败！");    
    }
  }

  
});




export default router;
