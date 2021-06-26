import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {Analyzer} from './crowller';


interface Course{
  title: string;
  count: number;
}

interface CourseResult{
  time: number;
  data: Course[];
}
interface Content{
  [propName: number]: Course[];
}



export default class DellAnalyzer  implements Analyzer{

  private static instance: DellAnalyzer;
  static getInstance(){
    if(! DellAnalyzer.instance){
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return DellAnalyzer.instance;
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    // console.log(courseItems.length);

    // courseItems.map((index, element) => {
    //   const descs = $(element).find('.course-desc');
    //   const title = descs.eq(0).text();
    //   const count = parseInt(descs.eq(1).text().split("：")[1]);
    //   console.log(title, " ", count);
    // })

    const coursetInfos: Course[] = [];
    for(var i=0; i< courseItems.length; i++){
      const descs = $(courseItems[i]).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split("：")[1]);
      coursetInfos.push({title,count})
    }

    const result = {
      time:(new Date()).getTime(),
      data: coursetInfos
    }
    return result;
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string){

    let fileContent:Content = {};
    if(fs.existsSync(filePath)){
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }



  public analyze(html: string, filePath: string){
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    console.log(fileContent);
    return JSON.stringify(fileContent);

  }

  private constructor(){

  }


}