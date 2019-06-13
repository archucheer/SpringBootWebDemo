package com.example.demo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;

/**
 * @Auther: ccz
 * @Date: 2019/5/15 17:05
 * @Description:
 */
@Controller
public class HttpController {


    @GetMapping("/index")
    public String firstPage(){
        return "index2";
    }

    @GetMapping("/test")
    public String test(){
        return "policeCheck";
    }

    JSONObject object = JSON.parseObject("{name:'邓鑫月',police_no:'12345',date:'2019.09.08',time:'2',state:'2',bus:'2',stage:'1',result:'通过',img:'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'}");

    @RequestMapping(value = "/example")
    public String tet(@RequestBody String body){

        JSONArray jsonArray = new JSONArray();
        jsonArray.add(object);
        return jsonArray.toJSONString();
    }


    private static ArrayList<PolicePO> policePOS = new ArrayList<PolicePO>();


    @GetMapping("/take-police")
    public String takePolice() {
        return "policeCheck";
    }

    @ResponseBody
    @RequestMapping("/take-police-test")
    public Dto takePoliceTest() {
        Dto result = new Dto();

        PolicePO policePO = JSON.parseObject(object.toJSONString(),PolicePO.class);
        policePOS.add(policePO);

        result.setData(policePOS);
        return result;
    }


    @ResponseBody
    @RequestMapping("/take-police-save")
    public Dto savePoliceTest(@RequestBody String body) {
        System.out.println(body);
        Dto result = new Dto();
        PolicePO policePO = JSON.parseObject(body, PolicePO.class);

//        for (PolicePO po:policePOS) {
//            if(policePO.getPolice_no().equals(po.getPolice_no())){
//                if(policePO.getState().equals(po.getState())){
//                    po = policePO;
//                }
//            }
//        }

        policePOS.add(policePO);
        result.setResult("1");
        result.setMsg("记录完成");
        return result;
    }
}
