
import express, {Request, Response, NextFunction} from 'express';
import router from './router';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'dell';
  next();
});
app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher dell'],
    maxAge: 24 * 60 *60 *1000
  })
)

app.use(router);

//lsof -i tcp:
app.listen(7004, ()=>{
  console.log("server is running");
})
