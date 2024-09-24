import { Log } from "index";
import { Request, Response } from "express";
import insightsService from "@Services/insightsService";
class BaseController {
  public async printBasicLogs(_req: Request, res: Response): Promise<Response> {
    console.log("psdafjaf ")
    Log.error(new Error("It does not work"), { custom_obj: "Hello" }, "Error with custom object and error stack trace");
    Log.errorWithChannel("app", { custom_obj: "Hello" }, "error with only custom object");
    Log.errorWithChannel("app", "error with this message");
    Log.errorWithChannel("app", new Error("It does not work"));
    return res.status(200).json({
      message: "For PRODs ",
    });
  }

  public async getInsights(req: Request, res: Response):Promise<Response>{
    console.log("Inside the get insights function");
    console.log("Inside the get insights function");
    console.log("Inside the get insights function");
    const {customerOrgDomain, prospectOrgDomain} = req.body;
    try{
      const insights = await insightsService.getInsights(customerOrgDomain,prospectOrgDomain);
      Log.info(insights,'Final insights: ...');
      return res.json(insights);
    }catch(error:any){
      throw new Error(`Error finding insights : ${customerOrgDomain}, ${prospectOrgDomain} - ${error.message}`);
    }
  }
}

export default new BaseController();
